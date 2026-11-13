// Loaded only by the test child process. Application code has no test email endpoint.
const realFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (url === 'https://api.resend.com/emails') {
    if (!process.env.AUTH_TEST_MAILBOX_URL) throw new Error('Test mailbox is required.');
    return realFetch(process.env.AUTH_TEST_MAILBOX_URL, init);
  }
  return realFetch(input, init);
};
