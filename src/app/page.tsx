import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <p className="eyebrow">Marriage Management V1</p>
      <h1>A shared space for your wedding.</h1>
      <p>Plan, coordinate, celebrate, and preserve your wedding memories.</p>
      <p className="notice">Project foundation is ready. Wedding features are coming next.</p>
      <Link className="button" href="/app">View workspace preview</Link>
    </main>
  );
}
