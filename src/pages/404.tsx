export default function NotFoundPage() {
  return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center' }}>
      <div>
        <p style={{ marginBottom: '0.75rem', color: '#1d4ed8', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          404
        </p>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.25rem', fontWeight: 700, color: '#111827' }}>
          We could not find that page.
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#4b5563', fontSize: '1.125rem' }}>
          Visit the main service pages or contact Burch Contracting to talk through your project.
        </p>
        <a href="/services" style={{ display: 'inline-block', borderRadius: '0.5rem', background: '#1d4ed8', color: '#fff', padding: '0.875rem 1.25rem', fontWeight: 600, textDecoration: 'none' }}>
          Browse Services
        </a>
      </div>
    </main>
  );
}
