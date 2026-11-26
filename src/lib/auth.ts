import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'vv_timetable_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || 'velammal-vidyalaya-timetable-2026-secret-key';
}

export function getConfiguredCredentials(): { username: string; password: string } {
  return {
    username: process.env.APP_USERNAME || 'admin',
    password: process.env.APP_PASSWORD || 'velammal@2026',
  };
}

function sha256(value: string): Buffer {
  return crypto.createHash('sha256').update(value, 'utf8').digest();
}

export function verifyCredentials(username: string, password: string): boolean {
  const expected = getConfiguredCredentials();
  const userMatch = crypto.timingSafeEqual(sha256(username), sha256(expected.username));
  const passMatch = crypto.timingSafeEqual(sha256(password), sha256(expected.password));
  return userMatch && passMatch;
}

export function createSessionToken(username: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ username, exp }), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getAuthSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): { username: string } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, providedSig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getAuthSecret())
    .update(payload)
    .digest('base64url');

  const sigMatch = crypto.timingSafeEqual(sha256(providedSig), sha256(expectedSig));
  if (!sigMatch) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      username?: string;
      exp?: number;
    };
    if (!parsed.username || !parsed.exp) return null;
    if (Math.floor(Date.now() / 1000) > parsed.exp) return null;
    return { username: parsed.username };
  } catch {
    return null;
  }
}
