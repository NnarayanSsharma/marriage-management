"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="container"><h1>Something went wrong</h1><p>Please try again.</p><button className="button" onClick={reset}>Try again</button></main>;
}
