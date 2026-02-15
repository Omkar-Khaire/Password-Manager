const crypto = require('crypto');

// AES-256-GCM encryption utility
// The AES secret should be 32 bytes (256 bits). Store it securely in env.
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // recommended for GCM

function getKey() {
  const secret = process.env.AES_SECRET;
  if (!secret) throw new Error('AES_SECRET is not set');
  
  // If it's already 32 bytes (64 hex chars), use as-is
  if (secret.length === 64 && /^[0-9a-fA-F]+$/.test(secret)) {
    return Buffer.from(secret, 'hex');
  }
  
  // If it's valid base64 and decodes to 32 bytes, use it
  try {
    const buf = Buffer.from(secret, 'base64');
    if (buf.length === 32) {
      return buf;
    }
  } catch (e) {}
  
  // Otherwise, derive 32 bytes from the secret using SHA-256
  return crypto.createHash('sha256').update(secret).digest();
}

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // return iv:tag:encrypted (base64)
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

function decrypt(payload) {
  if (!payload) return '';
  const [ivB64, tagB64, encB64] = payload.split(':');
  if (!ivB64 || !tagB64 || !encB64) throw new Error('Invalid payload');
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const encrypted = Buffer.from(encB64, 'base64');
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };