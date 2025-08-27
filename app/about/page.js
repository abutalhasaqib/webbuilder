import Link from 'next/link';

export const metadata = { title: 'About • Webbuilder' };

export default function AboutPage() {
  return (
    <main style={{ padding: '4rem 1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About</h1>
      <p>This is a minimal Next.js App Router app using JavaScript.</p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link href="/" style={{ color: '#2563eb' }}>← Back home</Link>
      </p>
    </main>
  );
}
