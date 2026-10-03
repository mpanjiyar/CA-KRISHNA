import { VaultAuthUser } from '../context/VaultAuthContext';

// Salted PBKDF2 Password Hashes matching server.ts & vault_server_db.json
// Master Credentials:
// - Super Admin: admin.krishna / cakrishanpanjiyar@gmail.com -> Admin@Vault2026!
// - Staff Auditor: sneha.ca / sneha.mehta@panjiyarca.in -> Staff@Vault2026!
// - Staff Compliance: rohan.verma / rohan.verma@panjiyarca.in -> Staff@Vault2026!
// - Client Apex: apex.singhal / rajesh@apexprecision.co.in -> Client@Vault2026!
// - Client Nexus: nexus.anita / nexus.pharma / anita.k@nexusbiopharma.com -> Client@Vault2026!
// - Client Bluecrest: bluecrest.harpreet / bluecrest.cfo / harpreet@bluecrestlogistics.in -> Client@Vault2026!
// - Client Vertex: vertex.fin / amit@vertexfintech.in -> Client@Vault2026!
// - Client Sunburst: sunburst.meera / meera@sunburststores.com -> Client@Vault2026!

export interface VaultAccountRecord {
  user: VaultAuthUser;
  passwordHash: string;
}

// Built-in verified account credentials
export const DEFAULT_VAULT_ACCOUNTS: VaultAccountRecord[] = [
  {
    user: {
      id: 'USR-ADM-001',
      fullName: 'CA Krishna Panjiyar',
      company: 'PANJIYAR KRISHNA & CO.',
      email: 'cakrishanpanjiyar@gmail.com',
      phone: '+91 6000310815',
      username: 'admin.krishna',
      accountType: 'super_admin',
      role: 'Managing Partner & Founder',
      status: 'Active',
      assignedProjects: ['PRJ-MUM-01', 'PRJ-MUM-02', 'PRJ-MUM-03', 'PRJ-MUM-04'],
      assignedClientIds: ['USR-CL-101', 'USR-CL-102', 'USR-CL-103', 'USR-CL-104'],
      notes: 'Managing Partner with root encryption authority.',
      createdAt: '2025-01-15T00:00:00.000Z',
      lastLogin: new Date().toISOString(),
      forcePasswordChange: false,
      loginDisabled: false,
      twoFactorEnabled: false,
      sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports', 'Messages', 'Settings'],
      permissions: {
        'Client Vault': { view: true, create: true, edit: true, delete: true, upload: true, download: true, share: true },
        'Files': { view: true, create: true, edit: true, delete: true, upload: true, download: true, share: true },
        'Projects': { view: true, create: true, edit: true, delete: true, upload: true, download: true, share: true },
        'Documents': { view: true, create: true, edit: true, delete: true, upload: true, download: true, share: true },
        'Profile': { view: true, create: true, edit: true, delete: true, upload: true, download: true, share: true }
      }
    },
    // Admin@Vault2026!
    passwordHash: '8b2855beb4087fbf141aa88b22705e42:a9041babab53caccebf203e1100e53799009168158c3b782e4e85691946346f5419cb891f314831867afa78a89cb311924fedf8c1348f864f51afed4cd711dd6'
  },
  {
    user: {
      id: 'USR-STF-201',
      fullName: 'CA Sneha Mehta',
      company: 'PANJIYAR KRISHNA & CO.',
      email: 'sneha.mehta@panjiyarca.in',
      phone: '+91 9820144981',
      username: 'sneha.ca',
      accountType: 'staff',
      role: 'Senior Audit Manager',
      status: 'Active',
      assignedProjects: ['PRJ-MUM-01', 'PRJ-MUM-03'],
      assignedClientIds: ['USR-CL-101', 'USR-CL-103', 'USR-CL-104'],
      notes: 'Senior Audit Manager managing corporate client mandates.',
      createdAt: '2025-04-10T00:00:00.000Z',
      lastLogin: new Date().toISOString(),
      forcePasswordChange: false,
      loginDisabled: false,
      twoFactorEnabled: false,
      sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports'],
      permissions: {
        'Client Vault': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true },
        'Files': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true },
        'Projects': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true },
        'Documents': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true },
        'Profile': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true }
      }
    },
    // Staff@Vault2026!
    passwordHash: 'ba2e8eb13113ce99fea6c8a9fd61e0e9:3800ff87c14cdc23b0e788d04ca633eba0de3550e637dcafc5a38b53595f82e387676234452514d39eb1ad851ef5f355dafa7bb5c3ba8117b0377845a2067d84'
  },
  {
    user: {
      id: 'USR-STF-202',
      fullName: 'Rohan Verma',
      company: 'PANJIYAR KRISHNA & CO.',
      email: 'rohan.verma@panjiyarca.in',
      phone: '+91 9769018442',
      username: 'rohan.verma',
      accountType: 'staff',
      role: 'Tax Compliance Lead',
      status: 'Active',
      assignedProjects: ['PRJ-MUM-01', 'PRJ-MUM-02', 'PRJ-MUM-04'],
      assignedClientIds: ['USR-CL-101', 'USR-CL-102', 'USR-CL-104'],
      notes: 'Tax Compliance Lead handling GST & ROC compliance.',
      createdAt: '2025-06-20T00:00:00.000Z',
      lastLogin: new Date().toISOString(),
      forcePasswordChange: false,
      loginDisabled: false,
      twoFactorEnabled: false,
      sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Reports'],
      permissions: {
        'Client Vault': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true },
        'Files': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true },
        'Projects': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true },
        'Documents': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true },
        'Profile': { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true }
      }
    },
    // Staff@Vault2026!
    passwordHash: 'ba2e8eb13113ce99fea6c8a9fd61e0e9:3800ff87c14cdc23b0e788d04ca633eba0de3550e637dcafc5a38b53595f82e387676234452514d39eb1ad851ef5f355dafa7bb5c3ba8117b0377845a2067d84'
  },
  {
    user: {
      id: 'USR-CL-101',
      fullName: 'Rajesh Singhal',
      company: 'Apex Precision Engineering Ltd',
      email: 'rajesh@apexprecision.co.in',
      phone: '+91 9821034455',
      username: 'apex.singhal',
      accountType: 'client',
      role: 'Managing Director',
      status: 'Active',
      assignedProjects: ['PRJ-MUM-01'],
      notes: 'Automotive components client with isolated secure vault.',
      createdAt: '2025-02-14T00:00:00.000Z',
      lastLogin: new Date().toISOString(),
      forcePasswordChange: false,
      loginDisabled: false,
      twoFactorEnabled: false,
      sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports'],
      permissions: {
        'Client Vault': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Files': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
        'Documents': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
      }
    },
    // Client@Vault2026!
    passwordHash: 'a55875f4d8d81322958bfb59cdb5a2dc:acd9982e32e94ae69556abc48d0bf8ae124acfc174be9b9862e0e8cc5553800f5ffd05217bb420fb0823b967157c8883e575dcb1bc615e7a92c8f5663d0a4fc6'
  },
  {
    user: {
      id: 'USR-CL-102',
      fullName: 'Dr. Anita Kulkarni',
      company: 'Nexus BioPharma Solutions',
      email: 'anita.k@nexusbiopharma.com',
      phone: '+91 9930219876',
      username: 'nexus.anita',
      accountType: 'client',
      role: 'Founder & CEO',
      status: 'Active',
      assignedProjects: ['PRJ-MUM-02'],
      notes: 'Pharma client with dedicated compliance archive.',
      createdAt: '2025-05-18T00:00:00.000Z',
      lastLogin: new Date().toISOString(),
      forcePasswordChange: false,
      loginDisabled: false,
      twoFactorEnabled: false,
      sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices'],
      permissions: {
        'Client Vault': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Files': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
        'Documents': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
      }
    },
    // Client@Vault2026!
    passwordHash: '76a3d1fefb7c9cae304991a94f93f75c:342933ab7b74ad20a4e787486cd904fc3c1039e74ddc22b86b0a995b1bc795f7404d6d02eaa4330a4009e63bd12f41defa056e20f9557e61c2399cc143e105a6'
  },
  {
    user: {
      id: 'USR-CL-103',
      fullName: 'Harpreet Singh',
      company: 'Bluecrest Logistics & Cold Storage',
      email: 'harpreet@bluecrestlogistics.in',
      phone: '+91 9819056231',
      username: 'bluecrest.harpreet',
      accountType: 'client',
      role: 'Chief Financial Officer',
      status: 'Active',
      assignedProjects: ['PRJ-MUM-03'],
      notes: 'Cold chain logistics client with project debt dossier.',
      createdAt: '2025-03-12T00:00:00.000Z',
      lastLogin: new Date().toISOString(),
      forcePasswordChange: false,
      loginDisabled: false,
      twoFactorEnabled: false,
      sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices'],
      permissions: {
        'Client Vault': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Files': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
        'Documents': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
      }
    },
    // Client@Vault2026!
    passwordHash: 'a55875f4d8d81322958bfb59cdb5a2dc:acd9982e32e94ae69556abc48d0bf8ae124acfc174be9b9862e0e8cc5553800f5ffd05217bb420fb0823b967157c8883e575dcb1bc615e7a92c8f5663d0a4fc6'
  },
  {
    user: {
      id: 'USR-CL-104',
      fullName: 'Amitabh Sen',
      company: 'Vertex FinTech Pvt Ltd',
      email: 'amit@vertexfintech.in',
      phone: '+91 9920198765',
      username: 'vertex.fin',
      accountType: 'client',
      role: 'Head of Finance',
      status: 'Pending',
      assignedProjects: ['PRJ-MUM-04'],
      notes: 'Cross-border SaaS export client.',
      createdAt: '2026-09-28T00:00:00.000Z',
      lastLogin: 'Never',
      forcePasswordChange: false,
      loginDisabled: false,
      twoFactorEnabled: false,
      sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Reports'],
      permissions: {
        'Client Vault': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Files': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
        'Documents': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
        'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
      }
    },
    // Client@Vault2026!
    passwordHash: 'a55875f4d8d81322958bfb59cdb5a2dc:acd9982e32e94ae69556abc48d0bf8ae124acfc174be9b9862e0e8cc5553800f5ffd05217bb420fb0823b967157c8883e575dcb1bc615e7a92c8f5663d0a4fc6'
  }
];

// Helper: Convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Helper: Convert Uint8Array to hex string
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * High-security client-side PBKDF2 verification using Web Crypto API.
 * Exactly mirrors Node.js crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').
 */
export async function verifyPasswordClient(password: string, storedHash: string): Promise<boolean> {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, originalHashHex] = parts;

    // Salt is string encoded in UTF-8 matching Node.js pbkdf2Sync
    const enc = new TextEncoder();
    const saltBuf = enc.encode(salt);
    const passBuf = enc.encode(password);

    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        passBuf,
        'PBKDF2',
        false,
        ['deriveBits']
      );

      const derivedBits = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuf,
          iterations: 100000,
          hash: 'SHA-512'
        },
        keyMaterial,
        512 // 64 bytes
      );

      const computedHex = bytesToHex(new Uint8Array(derivedBits));
      return computedHex.toLowerCase() === originalHashHex.toLowerCase();
    }

    return false;
  } catch (e) {
    console.error('PBKDF2 verification error:', e);
    return false;
  }
}

/**
 * Generate a salted PBKDF2 hash using Web Crypto API
 */
export async function hashPasswordClient(password: string): Promise<string> {
  const saltBytes = new Uint8Array(16);
  window.crypto.getRandomValues(saltBytes);
  const salt = bytesToHex(saltBytes);

  const enc = new TextEncoder();
  const saltBuf = enc.encode(salt);
  const passBuf = enc.encode(password);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passBuf,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuf,
      iterations: 100000,
      hash: 'SHA-512'
    },
    keyMaterial,
    512
  );

  const hashHex = bytesToHex(new Uint8Array(derivedBits));
  return `${salt}:${hashHex}`;
}

/**
 * Generate a 256-bit cryptographically secure session token
 */
export function generateSessionToken(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Find user record by username, email, or alternative alias
 */
export function findVaultAccount(loginIdentifier: string): VaultAccountRecord | null {
  const clean = loginIdentifier.trim().toLowerCase();
  if (!clean) return null;

  // 1. Check custom users saved in localStorage by admin
  try {
    const saved = localStorage.getItem('panjiyar_client_vault_users');
    if (saved) {
      const parsedUsers = JSON.parse(saved);
      const match = parsedUsers.find((u: any) =>
        (u.username && u.username.toLowerCase() === clean) ||
        (u.email && u.email.toLowerCase() === clean)
      );
      if (match) {
        // Find existing record or fallback to corresponding role template
        const baseRecord = DEFAULT_VAULT_ACCOUNTS.find((a) => a.user.id === match.id);
        return {
          user: {
            ...match,
            accountType: match.accountType || 'client'
          },
          passwordHash: baseRecord?.passwordHash || (
            match.accountType === 'super_admin' ? DEFAULT_VAULT_ACCOUNTS[0].passwordHash :
            match.accountType === 'staff' ? DEFAULT_VAULT_ACCOUNTS[1].passwordHash :
            DEFAULT_VAULT_ACCOUNTS[3].passwordHash
          )
        };
      }
    }
  } catch {
    // ignore
  }

  // 2. Check built-in accounts
  const match = DEFAULT_VAULT_ACCOUNTS.find((a) =>
    a.user.username.toLowerCase() === clean ||
    a.user.email.toLowerCase() === clean ||
    (clean === 'nexus.pharma' && a.user.username === 'nexus.anita') ||
    (clean === 'bluecrest.cfo' && a.user.username === 'bluecrest.harpreet')
  );

  return match || null;
}

// Failed logins lockout tracker in localStorage
const FAILED_LOGINS_KEY = 'panjiyar_vault_failed_logins_v3';

export function getFailedAttempts(username: string): { count: number; lockedUntil?: number } {
  try {
    const raw = localStorage.getItem(FAILED_LOGINS_KEY);
    if (!raw) return { count: 0 };
    const parsed = JSON.parse(raw);
    return parsed[username.toLowerCase()] || { count: 0 };
  } catch {
    return { count: 0 };
  }
}

export function recordFailedAttempt(username: string, maxAttempts = 5): { count: number; locked: boolean; remainingSeconds?: number } {
  try {
    const key = username.toLowerCase();
    const raw = localStorage.getItem(FAILED_LOGINS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const record = parsed[key] || { count: 0 };
    record.count += 1;

    let locked = false;
    let remainingSeconds: number | undefined;

    if (record.count >= maxAttempts) {
      record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins
      locked = true;
      remainingSeconds = 15 * 60;
    }

    parsed[key] = record;
    localStorage.setItem(FAILED_LOGINS_KEY, JSON.stringify(parsed));
    return { count: record.count, locked, remainingSeconds };
  } catch {
    return { count: 1, locked: false };
  }
}

export function clearFailedAttempts(username: string): void {
  try {
    const key = username.toLowerCase();
    const raw = localStorage.getItem(FAILED_LOGINS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    delete parsed[key];
    localStorage.setItem(FAILED_LOGINS_KEY, JSON.stringify(parsed));
  } catch {
    // ignore
  }
}
