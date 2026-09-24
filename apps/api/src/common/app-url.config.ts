/** Public URL and CORS helpers (self-hosted / direct iDRAC). */
export function publicAppUrl(): string {
  const raw =
    process.env.PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.PUBLIC_API_URL ??
    'http://localhost:3000';
  return raw.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

export function corsOrigins(): string[] {
  const extra = process.env.CORS_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000', publicAppUrl()];
  return [...new Set([...defaults, ...extra])];
}
