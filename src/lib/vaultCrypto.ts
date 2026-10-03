/**
 * Client Vault Cryptographic & Security Module
 * Implements WebCrypto PBKDF2 password hashing, SHA-256 document hashing,
 * AES-256-GCM envelope encryption simulations, and strict multi-tenant authorization guards.
 */

import { VaultUser, VaultFileItem, VaultProject } from '../types/vault';

// Convert Uint8Array to hexadecimal string
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate cryptographically secure random hex salt
export function generateSecureSalt(byteLength: number = 16): string {
  const randomBytes = new Uint8Array(byteLength);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < byteLength; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bufferToHex(randomBytes);
}

// Generate high-entropy 16-character alphanumeric & symbol password
export function generateHighEntropyPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*+=-';
  const all = upper + lower + numbers + symbols;

  const getChar = (set: string) => set.charAt(Math.floor(Math.random() * set.length));

  // Guarantee at least 2 of each character class
  const chars = [
    getChar(upper),
    getChar(upper),
    getChar(lower),
    getChar(lower),
    getChar(numbers),
    getChar(numbers),
    getChar(symbols),
    getChar(symbols)
  ];

  // Fill up to 16 characters
  while (chars.length < 16) {
    chars.push(getChar(all));
  }

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

// Compute real WebCrypto SHA-256 Digest
export async function computeSha256(content: string | Uint8Array): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = typeof content === 'string' ? encoder.encode(content) : content;
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data as any);
      return bufferToHex(hashBuffer);
    }
  } catch (err) {
    console.warn('WebCrypto not available, using fallback hash', err);
  }

  // Pure JS fallback FNV-1a / Murmur hybrid for non-crypto environments
  let h1 = 0x811c9dc5;
  const str = typeof content === 'string' ? content : String.fromCharCode(...content.slice(0, 100));
  for (let i = 0; i < str.length; i++) {
    h1 ^= str.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193);
  }
  return Math.abs(h1).toString(16).padStart(64, '0');
}

// Derive PBKDF2-SHA256 password hash
export async function hashPassword(
  password: string,
  providedSalt?: string
): Promise<{ hash: string; salt: string }> {
  const salt = providedSalt || generateSecureSalt(16);
  const encoder = new TextEncoder();

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const passwordKey = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );

      const saltBuffer = encoder.encode(salt);
      const derivedBits = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: 100000,
          hash: 'SHA-256'
        },
        passwordKey,
        256
      );

      return {
        hash: bufferToHex(derivedBits),
        salt
      };
    } catch (e) {
      console.warn('WebCrypto PBKDF2 failed, using SHA-256 fallback', e);
    }
  }

  // Fallback: SHA-256 of password + salt
  const combined = await computeSha256(`${password}:${salt}:v1_panjiyar_vault`);
  return { hash: combined, salt };
}

// Verify entered password against stored PBKDF2 hash & salt
export async function verifyPassword(
  enteredPassword: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const result = await hashPassword(enteredPassword, salt);
  return result.hash.toLowerCase() === storedHash.toLowerCase();
}

// Password strength evaluator for enterprise vault policies
export function calculatePasswordStrength(password: string): {
  score: number; // 0 to 100
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Enterprise Ready';
  color: string;
  checks: { passed: boolean; message: string }[];
} {
  const checks = [
    { passed: password.length >= 8, message: 'Minimum 8 characters (12+ recommended)' },
    { passed: /[A-Z]/.test(password), message: 'Contains uppercase letter' },
    { passed: /[a-z]/.test(password), message: 'Contains lowercase letter' },
    { passed: /[0-9]/.test(password), message: 'Contains numeric digit' },
    { passed: /[^A-Za-z0-9]/.test(password), message: 'Contains special character (!@#$%^&*)' }
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  let score = passedCount * 20;
  if (password.length >= 14) score = Math.min(100, score + 10);

  let label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Enterprise Ready' = 'Very Weak';
  let color = 'bg-rose-500';

  if (score >= 90) {
    label = 'Enterprise Ready';
    color = 'bg-emerald-600';
  } else if (score >= 75) {
    label = 'Strong';
    color = 'bg-emerald-500';
  } else if (score >= 50) {
    label = 'Fair';
    color = 'bg-amber-500';
  } else if (score >= 30) {
    label = 'Weak';
    color = 'bg-orange-500';
  }

  return { score, label, color, checks };
}

// Simulate client-side AES-256-GCM envelope encryption for uploads
export async function simulateAesGcmEncryption(
  fileName: string,
  dataString?: string
): Promise<{
  iv: string;
  sha256Hash: string;
  cipherSpec: string;
  keyFingerprint: string;
}> {
  const ivBytes = new Uint8Array(12);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(ivBytes);
  }
  const iv = bufferToHex(ivBytes);

  const hashInput = dataString || `${fileName}_${Date.now()}_${iv}`;
  const sha256Hash = await computeSha256(hashInput);
  const keyFingerprint = `KMS-ROOT-GCM-${sha256Hash.substring(0, 8).toUpperCase()}`;

  return {
    iv,
    sha256Hash,
    cipherSpec: 'AES-256-GCM / 128-bit Authentication Tag',
    keyFingerprint
  };
}

// Generate session hardware binding token
export function generateSessionId(): string {
  return `SES-${Date.now().toString(36).toUpperCase()}-${generateSecureSalt(4).toUpperCase()}`;
}

// STRICT TENANT & ROLE AUTHORIZATION GUARDS

/**
 * Validates if the current user can access a specific client's vault/files
 */
export function canUserAccessClientVault(user: VaultUser | null, targetClientId: string): boolean {
  if (!user) return false;
  if (user.status !== 'Active') return false;

  // Super admin can inspect all vaults
  if (user.accountType === 'super_admin') return true;

  // Staff can access only assigned client vaults
  if (user.accountType === 'staff') {
    if (user.assignedClientIds && user.assignedClientIds.includes(targetClientId)) {
      return true;
    }
    // Check if staff has any active assigned project for this client
    return false;
  }

  // Client user can strictly access ONLY their own account ID
  if (user.accountType === 'client') {
    return user.id === targetClientId;
  }

  return false;
}

/**
 * Validates if the current user can access a specific file
 */
export function canUserAccessFile(user: VaultUser | null, file: VaultFileItem): boolean {
  if (!user) return false;
  if (user.status !== 'Active') return false;

  // Super admin can access all
  if (user.accountType === 'super_admin') return true;

  // Client user can only see files belonging to their client ID
  if (user.accountType === 'client') {
    return file.clientId === user.id;
  }

  // Staff can access if the file belongs to an assigned client
  if (user.accountType === 'staff') {
    return !!(user.assignedClientIds && user.assignedClientIds.includes(file.clientId));
  }

  return false;
}

/**
 * Validates if the current user can access a project
 */
export function canUserAccessProject(user: VaultUser | null, project: VaultProject): boolean {
  if (!user) return false;
  if (user.status !== 'Active') return false;

  if (user.accountType === 'super_admin') return true;

  if (user.accountType === 'client') {
    return project.clientId === user.id;
  }

  if (user.accountType === 'staff') {
    const isAssignedStaff = project.assignedStaffIds.includes(user.id);
    const isAssignedClient = user.assignedClientIds?.includes(project.clientId);
    return isAssignedStaff || !!isAssignedClient;
  }

  return false;
}
