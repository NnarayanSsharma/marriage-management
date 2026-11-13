import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { connectDatabase } from "../src/server/db/connection";
import { AuthRateCounter, AuthSession, PasswordReset, User, ensureAuthIndexes } from "../src/modules/auth/models";
import { hashToken } from "../src/server/security/tokens";
import { createServer, type Server } from "node:http";
import { resolve } from "node:path";

const origin = "http://localhost:3108";
const password = "A long wedding passphrase 2026";
let mongo: MongoMemoryReplSet;
let app: ChildProcess;
let db: Awaited<ReturnType<typeof connectDatabase>>;
let output = "";
let mailbox: Server;
const delivered = new Map<string, string>();
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function api(action: string, body?: unknown, cookie?: string, requestOrigin = origin) {
  const response = await fetch(`${origin}/api/auth/${action}`, {
    method: action === "me" ? "GET" : "POST",
    headers: { Origin: requestOrigin, "Content-Type": "application/json", ...(cookie && { Cookie: cookie }) },
    ...(action !== "me" && body !== undefined && { body: JSON.stringify(body) }),
    redirect: "manual",
  });
  return { response, body: await response.json(), cookie: response.headers.get("set-cookie")?.split(";")[0] };
}

before(async () => {
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 }, instanceOpts: [{ storageEngine: "wiredTiger" }] });
  Object.assign(process.env, {
    MONGODB_URI: mongo.getUri(), MONGODB_DB_NAME: "marriage_auth_test",
    NEXT_PUBLIC_APP_URL: origin, TOKEN_HASH_SECRET: randomBytes(32).toString("hex"),
    AUTH_PASSWORD_MIN_LENGTH: "15", AUTH_SESSION_DAYS: "7", AUTH_RESET_MINUTES: "30", AUTH_RESET_REVOKE_SESSIONS: "true",
    RESEND_API_KEY: "test-only-not-a-provider-key", EMAIL_FROM: "Marriage Test <test@example.com>",
  });
  mailbox = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk.toString();
    const message = JSON.parse(body);
    delivered.set(message.to[0].toLowerCase(), message.text);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ id: "test-email" }));
  });
  await new Promise<void>(resolve => mailbox.listen(0, "127.0.0.1", resolve));
  const address = mailbox.address();
  assert.ok(address && typeof address !== "string");
  process.env.AUTH_TEST_MAILBOX_URL = `http://127.0.0.1:${address.port}/emails`;
  db = await connectDatabase();
  await ensureAuthIndexes();
  app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--port", "3108"], {
    env: { ...process.env, NODE_OPTIONS: `--require ${JSON.stringify(resolve("tests/support/resend-stub.cjs"))}`, NODE_ENV: "development", AUTH_TEST_BUILD: "1" }, stdio: ["ignore", "pipe", "pipe"],
  });
  app.stdout?.on("data", data => { output = (output + data.toString()).slice(-6000); });
  app.stderr?.on("data", data => { output = (output + data.toString()).slice(-6000); });
  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (app.exitCode !== null) throw new Error("Test application exited before startup.");
    try { if ((await fetch(`${origin}/api/auth/me`)).status === 401) { ready = true; break; } } catch { /* Wait for local test server. */ }
    await sleep(500);
  }
  assert.ok(ready, "Test application must start.");
}, { timeout: 120_000 });

after(async () => {
  if (app && app.exitCode === null) {
    app.kill("SIGTERM");
    await new Promise<void>(resolve => { app.once("exit", () => resolve()); setTimeout(resolve, 5000); });
  }
  if (db) await db.disconnect();
  if (mongo) await mongo.stop();
  if (mailbox) await new Promise<void>(resolve => mailbox.close(() => resolve()));
});

test("signup, normalized uniqueness, session cookies, me, logout and private guards", async () => {
  const result = await api("signup", { name: "Test Planner", email: "Planner@Example.com", password });
  assert.equal(result.response.status, 201);
  assert.equal(result.body.data.hasWedding, false);
  assert.ok(result.cookie);
  const setCookie = result.response.headers.get("set-cookie")!;
  assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /SameSite=lax/i); assert.match(setCookie, /Path=\//i);
  assert.equal(result.body.data.user.passwordHash, undefined);
  const user = await User.findOne({ emailNormalized: "planner@example.com" }).select("+passwordHash").lean();
  assert.match(user!.passwordHash, /^\$argon2id\$/);
  const session = await AuthSession.findOne({ userId: user!._id }).lean();
  assert.notEqual(session!.tokenHash, result.cookie!.split("=")[1]);
  const current = await api("me", undefined, result.cookie);
  assert.equal(current.body.data.user.name, "Test Planner"); assert.equal(current.body.data.membership, null);
  assert.equal(current.response.headers.get("cache-control"), "no-store");
  const duplicate = await api("signup", { name: "Other", email: " planner@example.com ", password });
  assert.equal(duplicate.response.status, 409);
  const anon = await fetch(`${origin}/app/tasks`, { redirect: "manual" });
  assert.equal(anon.status, 307); assert.equal(anon.headers.get("location"), "/login");
  const noWedding = await fetch(`${origin}/app`, { headers: { Cookie: result.cookie! }, redirect: "manual" });
  assert.equal(noWedding.headers.get("location"), "/onboarding/create-wedding");
  const onboarding = await fetch(`${origin}/onboarding/create-wedding`, { headers: { Cookie: result.cookie! } });
  assert.match(await onboarding.text(), /Your account is ready/);
  assert.equal((await api("logout", undefined, result.cookie)).response.status, 200);
  assert.equal((await api("me", undefined, result.cookie)).response.status, 401);
});

test("login uses generic errors, honors expiry, and reads membership by authenticated user", async () => {
  const wrong = await api("login", { email: "planner@example.com", password: "wrong" });
  const missing = await api("login", { email: "missing@example.com", password: "wrong" });
  assert.equal(wrong.response.status, 401); assert.deepEqual(wrong.body, missing.body);
  const result = await api("login", { email: "PLANNER@example.com", password });
  assert.equal(result.response.status, 200);
  const user = await User.findOne({ emailNormalized: "planner@example.com" }).lean();
  const weddingId = new db.Types.ObjectId();
  await db.connection.collection("weddings").insertOne({ _id: weddingId, brideName: "A", groomName: "B", weddingDate: "2027-02-14" });
  await db.connection.collection("wedding_memberships").insertOne({ userId: user!._id, weddingId, role: "MANAGER" });
  const me = await api("me", undefined, result.cookie);
  assert.equal(me.body.data.membership.role, "MANAGER"); assert.equal(me.body.data.wedding.id, weddingId.toString());
  await AuthSession.updateMany({ userId: user!._id }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal((await api("me", undefined, result.cookie)).response.status, 401);
  await db.connection.collection("wedding_memberships").deleteMany({ userId: user!._id });
});

test("origin, JSON size, field validation, and persistent rate limits reject unsafe requests", async () => {
  assert.equal((await api("signup", {}, undefined, "https://evil.example")).response.status, 403);
  const invalid = await api("signup", { name: "", email: "bad", password: "short" });
  assert.equal(invalid.response.status, 400); assert.ok(invalid.body.error.details.password);
  const large = await api("signup", { name: "x".repeat(9000) });
  assert.equal(large.response.status, 413);
  for (let i = 0; i < 10; i++) await api("login", { email: "limited@example.com", password: "wrong" });
  const limit = await api("login", { email: "limited@example.com", password: "wrong" });
  assert.equal(limit.response.status, 429); assert.ok(limit.response.headers.get("retry-after"));
  const counters = await AuthRateCounter.find().lean();
  assert.ok(counters.every(counter => !counter.key.includes("@")));
});

test("signed-in users cannot reopen guest-only pages or replace their session via login/signup", async () => {
  const account = { name: "Signed In Guard", email: "guard@example.com", password };
  const created = await api("signup", account);
  assert.equal(created.response.status, 201);
  const user = await User.findOne({ emailNormalized: account.email }).lean();
  const before = await AuthSession.countDocuments({ userId: user!._id });
  for (const action of ["login", "signup"]) {
    const result = await api(action, action === "login" ? account : { ...account, email: "unwanted-switch@example.com" }, created.cookie);
    assert.equal(result.response.status, 409);
    assert.equal(result.body.error.code, "ALREADY_AUTHENTICATED");
    assert.equal(result.cookie, undefined);
    const page = await fetch(`${origin}/${action}`, { headers: { Cookie: created.cookie! }, redirect: "manual" });
    assert.equal(page.status, 307);
    assert.equal(page.headers.get("location"), "/onboarding/create-wedding");
  }
  assert.equal(await User.countDocuments({ emailNormalized: "unwanted-switch@example.com" }), 0);
  assert.equal(await AuthSession.countDocuments({ userId: user!._id }), before);
  assert.equal((await api("me", undefined, created.cookie)).response.status, 200);
  const homepage = await (await fetch(origin, { headers: { Cookie: created.cookie! } })).text();
  assert.ok(homepage.includes('href="/onboarding/create-wedding"'));
  assert.ok(!homepage.includes('href="/login"') && !homepage.includes('href="/signup"'));
  const weddingId = new db.Types.ObjectId();
  await db.connection.collection("weddings").insertOne({ _id: weddingId, brideName: "A", groomName: "B", weddingDate: "2027-02-14" });
  await db.connection.collection("wedding_memberships").insertOne({ userId: user!._id, weddingId, role: "ADMIN" });
  for (const action of ["login", "signup"]) {
    const page = await fetch(`${origin}/${action}`, { headers: { Cookie: created.cookie! }, redirect: "manual" });
    assert.equal(page.headers.get("location"), "/app");
  }
  const memberHome = await (await fetch(origin, { headers: { Cookie: created.cookie! } })).text();
  assert.ok(memberHome.includes('href="/app"'));
});

test("duplicate signup races create only one account and session", async () => {
  const results = await Promise.all([1, 2].map(() => api("signup", { name: "Race", email: "race@example.com", password })));
  assert.deepEqual(results.map(result => result.response.status).sort(), [201, 409]);
  const users = await User.find({ emailNormalized: "race@example.com" }).lean();
  assert.equal(users.length, 1); assert.equal(await AuthSession.countDocuments({ userId: users[0]._id }), 1);
});

test("repeated throttled attempts cannot exhaust other accounts or authenticated logout", async () => {
  const account = { name: "Rate Isolation", email: "isolation@example.com", password };
  const created = await api("signup", account);
  assert.equal(created.response.status, 201);
  // These include attempts already rejected by the account-level limiter.
  for (let i = 0; i < 105; i++) await api("login", { email: "limited@example.com", password: "wrong" });
  const unrelated = await api("login", { email: account.email, password });
  assert.equal(unrelated.response.status, 200);
  for (let i = 0; i < 105; i++) {
    assert.equal((await api("logout")).response.status, 401);
  }
  assert.equal((await api("logout", undefined, unrelated.cookie)).response.status, 200);
  assert.equal((await api("me", undefined, unrelated.cookie)).response.status, 401);
});

test("reset-token limits are isolated and do not persist raw token values", async () => {
  const token = randomBytes(32).toString("base64url");
  for (let i = 0; i < 10; i++) assert.equal((await api("reset-password", { token, password })).response.status, 400);
  assert.equal((await api("reset-password", { token, password })).response.status, 429);
  assert.equal((await api("reset-password", { token: randomBytes(32).toString("base64url"), password })).response.status, 400);
  const counters = await AuthRateCounter.find().lean();
  assert.ok(counters.every(counter => !counter.key.includes(token) && !counter.key.startsWith("global:")));
});

test("password recovery sends a fragment link, is single-use, and revokes prior sessions", async () => {
  const signedIn = await api("login", { email: "planner@example.com", password });
  const recovery = await api("forgot-password", { email: "planner@example.com" });
  assert.equal(recovery.response.status, 200);
  assert.deepEqual(recovery.body, { success: true });
  const message = delivered.get("planner@example.com");
  assert.ok(message);
  const link = message.match(/http[^\s]+/)![0];
  const token = new URLSearchParams(new URL(link).hash.slice(1)).get("token")!;
  assert.ok(token);
  const stored = await PasswordReset.findOne({ tokenHash: hashToken("reset", token) }).lean();
  assert.ok(stored); assert.notEqual(stored.tokenHash, token);
  const nextPassword = "A different long wedding password";
  const resets = await Promise.all([1, 2].map(() => api("reset-password", { token, password: nextPassword })));
  assert.deepEqual(resets.map(result => result.response.status).sort(), [200, 400]);
  assert.equal((await api("me", undefined, signedIn.cookie)).response.status, 401);
  assert.equal((await api("login", { email: "planner@example.com", password })).response.status, 401);
  assert.equal((await api("login", { email: "planner@example.com", password: nextPassword })).response.status, 200);
  const generic = await api("forgot-password", { email: "absent@example.com" });
  assert.equal(generic.response.status, 200); assert.deepEqual(generic.body, { success: true });
});

test("expired reset tokens remain unusable before TTL cleanup", async () => {
  const user = await User.findOne({ emailNormalized: "planner@example.com" }).lean();
  const token = randomBytes(32).toString("base64url");
  await PasswordReset.create({ userId: user!._id, tokenHash: hashToken("reset", token), expiresAt: new Date(Date.now() - 1000) });
  assert.equal((await api("reset-password", { token, password })).response.status, 400);
  assert.equal(output.includes("ReferenceError"), false);
});

test("browser signup, logout, login, recovery, responsive forms, and no-JavaScript protection", { skip: !process.env.CHROME_PATH, timeout: 60_000 }, async () => {
  const { mkdtemp, rm, writeFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const profile = await mkdtemp(`${tmpdir()}/marriage-auth-browser-`);
  const chrome = spawn(process.env.CHROME_PATH!, ["--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--remote-debugging-port=9228", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
  let socket: WebSocket | undefined;
  try {
    let target: { webSocketDebuggerUrl: string } | undefined;
    for (let i = 0; i < 40; i++) {
      try {
        const targets = await (await fetch("http://127.0.0.1:9228/json/list")).json();
        target = targets.find((entry: { type: string }) => entry.type === "page");
        if (target) break;
      } catch { /* Wait for the browser. */ }
      await sleep(100);
    }
    assert.ok(target);
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise<void>(resolve => socket!.addEventListener("open", () => resolve(), { once: true }));
    let id = 0;
    const pending = new Map<number, (value: Record<string, unknown>) => void>();
    socket.addEventListener("message", event => {
      const message = JSON.parse(String(event.data));
      if (message.id) { pending.get(message.id)?.(message); pending.delete(message.id); }
    });
    const call = (method: string, params: object = {}) => new Promise<Record<string, unknown>>(resolve => {
      const next = ++id; pending.set(next, resolve); socket!.send(JSON.stringify({ id: next, method, params }));
    });
    const evaluate = async (expression: string) => {
      const reply = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      const result = reply.result as { result: { value: unknown }; exceptionDetails?: unknown };
      assert.equal(result.exceptionDetails, undefined);
      return result.result.value;
    };
    const navigate = async (path: string) => { await call("Page.navigate", { url: `${origin}${path}` }); await sleep(800); };
    await call("Page.enable");
    await navigate("/login");
    for (const width of [320, 390, 768, 1440]) {
      await call("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await navigate("/signup");
      assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
      assert.equal(await evaluate("document.querySelector('button[type=submit]').disabled"), false);
    }
    const screenshot = await call("Page.captureScreenshot", { format: "png" });
    await writeFile(`${tmpdir()}/marriage-auth-signup.png`, Buffer.from((screenshot.result as { data: string }).data, "base64"));
    await evaluate("document.querySelector('form').requestSubmit()");
    assert.equal(await evaluate("document.querySelectorAll('input[aria-invalid=true]').length"), 3);
    await evaluate(`(() => {
      for (const [name,value] of Object.entries({name:'Browser Planner',email:'browser@example.com',password:'A browser wedding passphrase'})) {
        const input=document.querySelector('[name='+name+']');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);
        input.dispatchEvent(new Event('input',{bubbles:true}));
      }
    })()`);
    await evaluate("document.querySelector('form').requestSubmit()");
    for (let i = 0; i < 30; i++) {
      if (await evaluate("location.pathname === '/onboarding/create-wedding'")) break;
      await sleep(200);
    }
    assert.equal(await evaluate("location.pathname"), "/onboarding/create-wedding");
    assert.equal(await evaluate("document.body.textContent.includes('Browser Planner')"), true);
    const history = await call("Page.getNavigationHistory");
    const navigation = history.result as { currentIndex: number; entries: { id: number }[] };
    await call("Page.navigateToHistoryEntry", { entryId: navigation.entries[navigation.currentIndex - 1].id });
    await sleep(1500);
    assert.equal(await evaluate("location.pathname"), "/onboarding/create-wedding");
    assert.equal(await evaluate("!!document.querySelector('[name=password]')"), false);
    await navigate("/login");
    assert.equal(await evaluate("location.pathname"), "/onboarding/create-wedding");
    assert.equal(await evaluate("!!document.querySelector('[name=password]')"), false);
    await navigate("/signup");
    assert.equal(await evaluate("location.pathname"), "/onboarding/create-wedding");
    await navigate("/");
    assert.equal(await evaluate("Array.from(document.querySelectorAll('header a')).some(a => a.getAttribute('href') === '/login')"), false);
    await navigate("/onboarding/create-wedding");
    const fill = async (values: Record<string, string>) => evaluate(`(() => {
      for (const [name,value] of Object.entries(${JSON.stringify(values)})) {
        const input=document.querySelector('[name='+name+']');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);
        input.dispatchEvent(new Event('input',{bubbles:true}));
      }
    })()`);
    const waitFor = async (expression: string) => {
      for (let i = 0; i < 40; i++) {
        if (await evaluate(expression)) return;
        await sleep(200);
      }
      assert.fail("Browser account flow did not reach its expected state.");
    };
    await evaluate("document.querySelector('button').click()");
    await waitFor("location.pathname === '/login'");
    await sleep(300);
    await fill({ email: "browser@example.com", password: "A browser wedding passphrase" });
    await evaluate("document.querySelector('form').requestSubmit()");
    await waitFor("location.pathname === '/onboarding/create-wedding'");
    const cookies = await call("Network.getCookies", { urls: [origin] });
    const sessionCookie = (cookies.result as { cookies: { name: string; value: string }[] }).cookies.find(cookie => cookie.name === "mmm_session");
    assert.ok(sessionCookie);
    await navigate("/forgot-password");
    await fill({ email: "browser@example.com" });
    await evaluate("document.querySelector('form').requestSubmit()");
    await waitFor("document.querySelector('[role=status]').textContent.includes('If an account exists')");
    const message = delivered.get("browser@example.com");
    assert.ok(message);
    const resetUrl = new URL(message.match(/http[^\s]+/)![0]);
    assert.equal(resetUrl.search, "");
    await navigate(resetUrl.pathname + resetUrl.hash);
    await fill({ password: "A changed browser wedding passphrase" });
    await evaluate("document.querySelector('form').requestSubmit()");
    await waitFor("document.querySelector('[role=status]').textContent.includes('Your password has been changed')");
    assert.equal(await evaluate("location.hash"), "");
    assert.equal((await api("me", undefined, `mmm_session=${sessionCookie.value}`)).response.status, 401);
    await navigate("/login");
    await fill({ email: "browser@example.com", password: "A browser wedding passphrase" });
    await evaluate("document.querySelector('form').requestSubmit()");
    await waitFor("document.querySelector('[role=status]').textContent.includes('Invalid email or password')");
    await fill({ password: "A changed browser wedding passphrase" });
    await evaluate("document.querySelector('form').requestSubmit()");
    await waitFor("location.pathname === '/onboarding/create-wedding'");
    await navigate("/reset-password");
    assert.equal(await evaluate("document.querySelector('[name=password]') === null"), true);
    assert.equal(await evaluate("document.body.textContent.includes('This reset link is invalid or expired')"), true);
    await navigate("/reset-password#token=invalid");
    assert.equal(await evaluate("document.querySelector('[name=password]') === null"), true);
    const expired = "a".repeat(43);
    await navigate(`/reset-password#token=${expired}`);
    await fill({ password: "A reset link test passphrase" });
    await evaluate("document.querySelector('form').requestSubmit()");
    await waitFor("document.body.textContent.includes('This reset link is invalid or expired')");
    assert.equal(await evaluate("document.querySelector('[name=password]') === null"), true);
    await evaluate("fetch('/api/auth/logout', {method:'POST'})");
    await call("Emulation.setScriptExecutionDisabled", { value: true });
    await navigate("/login");
    assert.equal(await evaluate("Array.from(document.querySelectorAll('input,button[type=submit]')).every(el=>el.disabled)"), true);
    assert.equal(await evaluate("Array.from(new FormData(document.querySelector('form'))).length"), 0);
  } finally {
    socket?.close(); chrome.kill("SIGTERM");
    await sleep(300);
    await rm(profile, { recursive: true, force: true, maxRetries: 3 });
  }
});
