import Link from "next/link";

export function FeaturePlaceholder({ title }: { title: string }) {
  return <main className="container"><p className="eyebrow">Workspace preview</p><h1>{title}</h1><p>This feature has not been implemented yet.</p><Link href="/app">Back to workspace preview</Link></main>;
}
