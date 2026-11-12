import Link from "next/link";

export default function NotFound() {
  return <main className="container"><h1>Page unavailable</h1><p>This page could not be found.</p><Link href="/">Return home</Link></main>;
}
