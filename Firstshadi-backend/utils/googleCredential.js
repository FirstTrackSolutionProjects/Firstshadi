import { createPublicKey, verify as verifySignature } from 'node:crypto';

const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
let cachedKeys = new Map();
let keysExpireAt = 0;

async function getGoogleKeys() {
  if (Date.now() < keysExpireAt && cachedKeys.size) return cachedKeys;
  const response = await fetch(GOOGLE_CERTS_URL);
  if (!response.ok) throw new Error('Could not load Google signing keys');
  const { keys = [] } = await response.json();
  cachedKeys = new Map(keys.map((key) => [key.kid, key]));
  const maxAge = Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1] || 3600);
  keysExpireAt = Date.now() + maxAge * 1000;
  return cachedKeys;
}

export async function verifyGoogleCredential(token) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('GOOGLE_CLIENT_ID is not configured');

  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed Google credential');
  const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  if (header.alg !== 'RS256' || !header.kid) throw new Error('Unsupported Google credential signature');

  let jwk = (await getGoogleKeys()).get(header.kid);
  if (!jwk) {
    keysExpireAt = 0;
    jwk = (await getGoogleKeys()).get(header.kid);
  }
  if (!jwk) throw new Error('Unknown Google signing key');

  const signingInput = `${parts[0]}.${parts[1]}`;
  const validSignature = verifySignature(
    'RSA-SHA256',
    Buffer.from(signingInput),
    createPublicKey({ key: jwk, format: 'jwk' }),
    Buffer.from(parts[2], 'base64url')
  );
  const now = Math.floor(Date.now() / 1000);
  const validIssuer = ['accounts.google.com', 'https://accounts.google.com'].includes(claims.iss);
  const validAudience = Array.isArray(claims.aud) ? claims.aud.includes(clientId) : claims.aud === clientId;
  if (!validSignature || !validIssuer || !validAudience || !claims.exp || claims.exp <= now || !claims.email_verified || !claims.email) {
    throw new Error('Invalid or expired Google credential');
  }
  return claims;
}
