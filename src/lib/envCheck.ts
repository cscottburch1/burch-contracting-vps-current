const REQUIRED_ENV = [
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
  'ADMIN_SESSION_SECRET',
];

const REQUIRED_FOR_EMAIL = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];

export function getMissingEnv(required: string[]): string[] {
  return required.filter((name) => !process.env[name] || String(process.env[name]).trim().length === 0);
}

export function assertCriticalEnv(): void {
  const missing = getMissingEnv(REQUIRED_ENV);
  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(message);
    throw new Error(message);
  }
}

export function getEmailEnvHealth(): { ready: boolean; missing: string[] } {
  const missing = getMissingEnv(REQUIRED_FOR_EMAIL);
  return { ready: missing.length === 0, missing };
}

export function listRequiredEnv(): { critical: string[]; email: string[] } {
  return {
    critical: [...REQUIRED_ENV],
    email: [...REQUIRED_FOR_EMAIL],
  };
}
