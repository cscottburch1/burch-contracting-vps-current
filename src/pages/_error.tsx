import type { NextPageContext } from 'next';

type ErrorPageProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center' }}>
      <div>
        <p style={{ marginBottom: '0.75rem', color: '#1d4ed8', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Site Error
        </p>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.25rem', fontWeight: 700, color: '#111827' }}>
          {statusCode ? `Request failed with status ${statusCode}` : 'An unexpected error occurred.'}
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#4b5563', fontSize: '1.125rem' }}>
          Please return to the homepage or contact Burch Contracting if you need immediate project help.
        </p>
        <a href="/" style={{ display: 'inline-block', borderRadius: '0.5rem', background: '#1d4ed8', color: '#fff', padding: '0.875rem 1.25rem', fontWeight: 600, textDecoration: 'none' }}>
          Back to Home
        </a>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;
