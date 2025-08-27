import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="py-20">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Playful Pastel Web Builder</h1>
          <p className="mt-3 text-slate-700">Drag, drop, customize. Build pages with reusable components.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/builder" className="btn btn-primary">Open Web Builder →</Link>
            <Link href="/about" className="btn btn-ghost">About</Link>
            <Link href="/flow" className="btn btn-ghost">Flow (reactflow)</Link>
            <Link href="/xyflow" className="btn btn-ghost">Flow (@xyflow/react)</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
