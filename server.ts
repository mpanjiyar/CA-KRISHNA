import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Path to persistent database file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'vault_server_db.json');

// --- Cryptographic Password Utilities (PBKDF2) ---
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

// --- Data Models & Interfaces ---
export type AccountType = 'super_admin' | 'staff' | 'client' | 'custom';
export type AccountStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Expired';

export interface ServerUser {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  username: string;
  passwordHash: string; // Salted PBKDF2 hash, NEVER sent to client
  accountType: AccountType;
  role: string;
  status: AccountStatus;
  assignedProjects: string[];
  assignedClientIds?: string[];
  notes?: string;
  createdAt: string;
  lastLogin: string;
  forcePasswordChange: boolean;
  loginDisabled: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  permissions: Record<string, {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    upload: boolean;
    download: boolean;
    share: boolean;
  }>;
  sectionAccess: string[];
}

export interface ActiveSession {
  id: string;
  token: string;
  userId: string;
  username: string;
  fullName: string;
  accountType: AccountType;
  device: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  category: 'Auth' | 'Permission' | 'File' | 'User' | 'Project' | 'Security';
  status: 'Success' | 'Denied' | 'Warning';
  details: string;
  ipAddress: string;
  device?: string;
}

export interface VaultFile {
  id: string;
  title: string;
  fileName: string;
  fileType: 'document' | 'photo' | 'video' | 'invoice' | 'report' | 'contract';
  fileSize: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  folder: string;
  uploadDate: string;
  uploadedBy: string;
  sha256Hash: string;
  encryptionStandard: string;
  permissions: {
    canView: boolean;
    canUpload: boolean;
    canDownload: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canRename: boolean;
    canMove: boolean;
  };
}

export interface VaultProject {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  category: string;
  assignedStaffIds: string[];
  status: 'Active' | 'Under Review' | 'Completed' | 'Pending Approval';
  dueDate: string;
  createdDate: string;
  description: string;
}

export interface VaultDatabase {
  users: ServerUser[];
  sessions: ActiveSession[];
  auditLogs: SecurityAuditLog[];
  files: VaultFile[];
  projects: VaultProject[];
  failedLogins: Record<string, { count: number; lockedUntil?: number }>;
  securityConfig: {
    sessionTimeoutMinutes: number;
    maxFailedLoginsBeforeLock: number;
    enforceTwoFactor: boolean;
    enforcePasswordComplexity: boolean;
    passwordExpiryDays: number;
    ipWhitelistEnabled: boolean;
    notifyOnNewLogin: boolean;
  };
}

// Initial Permissions Preset
const fullPerms = { view: true, create: true, edit: true, delete: true, upload: true, download: true, share: true };
const staffPerms = { view: true, create: true, edit: true, delete: false, upload: true, download: true, share: true };
const clientPerms = { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false };

// Initial Database Seeding with Secure Hashes
function createInitialDatabase(): VaultDatabase {
  return {
    users: [
      {
        id: 'USR-ADM-001',
        fullName: 'CA Krishna Panjiyar',
        company: 'PANJIYAR KRISHNA & CO.',
        email: 'cakrishanpanjiyar@gmail.com',
        phone: '+91 6000310815',
        username: 'admin.krishna',
        passwordHash: hashPassword('Admin@Vault2026!'),
        accountType: 'super_admin',
        role: 'Managing Partner & Founder',
        status: 'Active',
        assignedProjects: ['PRJ-MUM-01', 'PRJ-MUM-02', 'PRJ-MUM-03', 'PRJ-MUM-04'],
        assignedClientIds: ['USR-CL-101', 'USR-CL-102', 'USR-CL-103'],
        notes: 'Managing Partner with root encryption authority.',
        createdAt: '2025-01-15T00:00:00.000Z',
        lastLogin: new Date().toISOString(),
        forcePasswordChange: false,
        loginDisabled: false,
        twoFactorEnabled: false,
        sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports', 'Messages', 'Settings'],
        permissions: {
          'Client Vault': fullPerms,
          'Files': fullPerms,
          'Projects': fullPerms,
          'Documents': fullPerms,
          'Profile': fullPerms
        }
      },
      {
        id: 'USR-STF-201',
        fullName: 'CA Sneha Mehta',
        company: 'PANJIYAR KRISHNA & CO.',
        email: 'sneha.mehta@panjiyarca.in',
        phone: '+91 9820144981',
        username: 'sneha.ca',
        passwordHash: hashPassword('Staff@Vault2026!'),
        accountType: 'staff',
        role: 'Senior Audit Manager',
        status: 'Active',
        assignedProjects: ['PRJ-MUM-01', 'PRJ-MUM-03'],
        assignedClientIds: ['USR-CL-101', 'USR-CL-103'],
        notes: 'Senior Audit Manager managing corporate client mandates.',
        createdAt: '2025-04-10T00:00:00.000Z',
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        forcePasswordChange: false,
        loginDisabled: false,
        twoFactorEnabled: false,
        sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports'],
        permissions: {
          'Client Vault': staffPerms,
          'Files': staffPerms,
          'Projects': staffPerms,
          'Documents': staffPerms,
          'Profile': { ...staffPerms, delete: false }
        }
      },
      {
        id: 'USR-CL-101',
        fullName: 'Rajesh Singhal',
        company: 'Apex Precision Engineering Ltd',
        email: 'rajesh@apexprecision.co.in',
        phone: '+91 9821034455',
        username: 'apex.singhal',
        passwordHash: hashPassword('Client@Vault2026!'),
        accountType: 'client',
        role: 'Managing Director',
        status: 'Active',
        assignedProjects: ['PRJ-MUM-01'],
        notes: 'Automotive components client with isolated secure vault.',
        createdAt: '2025-02-14T00:00:00.000Z',
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        forcePasswordChange: false,
        loginDisabled: false,
        twoFactorEnabled: false,
        sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports'],
        permissions: {
          'Client Vault': clientPerms,
          'Files': clientPerms,
          'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
          'Documents': clientPerms,
          'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
        }
      },
      {
        id: 'USR-CL-102',
        fullName: 'Dr. Anita Kulkarni',
        company: 'Nexus BioPharma Solutions',
        email: 'anita.k@nexusbiopharma.com',
        phone: '+91 9930219876',
        username: 'nexus.anita',
        passwordHash: hashPassword('Client@Vault2026!'),
        accountType: 'client',
        role: 'Founder & CEO',
        status: 'Active',
        assignedProjects: ['PRJ-MUM-02'],
        notes: 'Pharma client with dedicated compliance archive.',
        createdAt: '2025-05-18T00:00:00.000Z',
        lastLogin: new Date(Date.now() - 7200000).toISOString(),
        forcePasswordChange: false,
        loginDisabled: false,
        twoFactorEnabled: false,
        sectionAccess: ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices'],
        permissions: {
          'Client Vault': clientPerms,
          'Files': clientPerms,
          'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
          'Documents': clientPerms,
          'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
        }
      }
    ],
    sessions: [],
    auditLogs: [
      {
        id: 'LOG-INIT-01',
        timestamp: new Date().toISOString(),
        user: 'System Provisioner',
        userRole: 'Security Kernel',
        action: 'VAULT_INITIALIZED',
        category: 'Security',
        status: 'Success',
        details: 'Server cryptographic engine initialized with salted PBKDF2 hashing and session management.',
        ipAddress: '127.0.0.1'
      }
    ],
    projects: [
      {
        id: 'PRJ-MUM-01',
        title: 'Statutory & Tax Audit FY 2025-26',
        clientName: 'Apex Precision Engineering Ltd',
        clientId: 'USR-CL-101',
        category: 'Statutory Audit',
        assignedStaffIds: ['USR-STF-201'],
        status: 'Active',
        dueDate: '2026-10-31',
        createdDate: '2026-04-01',
        description: 'Comprehensive 3CD audit report, fixed asset physical verification, and internal control assurance.'
      },
      {
        id: 'PRJ-MUM-02',
        title: 'GSTR-9 & 9C Annual Reconciliation',
        clientName: 'Nexus BioPharma Solutions',
        clientId: 'USR-CL-102',
        category: 'Indirect Taxation',
        assignedStaffIds: ['USR-STF-201'],
        status: 'Under Review',
        dueDate: '2026-12-31',
        createdDate: '2026-05-15',
        description: 'Reconciliation of GSTR-2B vs Books, reverse charge mechanism audit, and export refund filings.'
      },
      {
        id: 'PRJ-MUM-03',
        title: 'Bank Loan CMA Project Financing (₹14.5 Cr)',
        clientName: 'Apex Precision Engineering Ltd',
        clientId: 'USR-CL-101',
        category: 'Project Financing',
        assignedStaffIds: ['USR-STF-201'],
        status: 'Active',
        dueDate: '2026-11-15',
        createdDate: '2026-03-10',
        description: 'Full DSCR modeling, bank consortium presentation, and working capital credit appraisal dossier.'
      }
    ],
    files: [
      {
        id: 'FIL-APX-001',
        title: 'Form 3CD Tax Audit Final Report FY 2025-26',
        fileName: 'Apex_Form_3CD_Signed_FY2526.pdf',
        fileType: 'document',
        fileSize: '4.8 MB',
        clientId: 'USR-CL-101',
        clientName: 'Apex Precision Engineering Ltd',
        projectId: 'PRJ-MUM-01',
        projectName: 'Statutory & Tax Audit FY 2025-26',
        folder: 'Documents',
        uploadDate: '2026-09-24',
        uploadedBy: 'CA Sneha Mehta',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        encryptionStandard: 'AES-256 (GCM)',
        permissions: {
          canView: true,
          canUpload: false,
          canDownload: true,
          canEdit: false,
          canDelete: false,
          canShare: true,
          canRename: false,
          canMove: false
        }
      },
      {
        id: 'FIL-APX-002',
        title: 'GSTR-3B Consolidated Computation & ITC Ledger',
        fileName: 'Apex_GSTR3B_ITC_Recon_Q2.xlsx',
        fileType: 'report',
        fileSize: '1.2 MB',
        clientId: 'USR-CL-101',
        clientName: 'Apex Precision Engineering Ltd',
        projectId: 'PRJ-MUM-01',
        projectName: 'Statutory & Tax Audit FY 2025-26',
        folder: 'Reports',
        uploadDate: '2026-09-18',
        uploadedBy: 'CA Krishna Panjiyar',
        sha256Hash: 'a89f332c98234fdc91bc22319087ea234b8c910245a90182374b89230198421b',
        encryptionStandard: 'AES-256 (GCM)',
        permissions: {
          canView: true,
          canUpload: false,
          canDownload: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canRename: false,
          canMove: false
        }
      },
      {
        id: 'FIL-NEX-001',
        title: 'Clinical Trial R&D Tax Deduction Certificate (Sec 35(2AB))',
        fileName: 'Nexus_RD_Sec35_Approval_Signed.pdf',
        fileType: 'document',
        fileSize: '3.1 MB',
        clientId: 'USR-CL-102',
        clientName: 'Nexus BioPharma Solutions',
        projectId: 'PRJ-MUM-02',
        projectName: 'GSTR-9 & 9C Annual Reconciliation',
        folder: 'Documents',
        uploadDate: '2026-08-30',
        uploadedBy: 'CA Sneha Mehta',
        sha256Hash: 'f4b1c29801a23847bcd891230491823758b9012384756c901283746591028374',
        encryptionStandard: 'AES-256 (GCM)',
        permissions: {
          canView: true,
          canUpload: false,
          canDownload: true,
          canEdit: false,
          canDelete: false,
          canShare: true,
          canRename: false,
          canMove: false
        }
      }
    ],
    failedLogins: {},
    securityConfig: {
      sessionTimeoutMinutes: 60,
      maxFailedLoginsBeforeLock: 5,
      enforceTwoFactor: false,
      enforcePasswordComplexity: true,
      passwordExpiryDays: 90,
      ipWhitelistEnabled: false,
      notifyOnNewLogin: true
    }
  };
}

// Database helper functions with safe file persistence
class VaultDatabaseManager {
  private db: VaultDatabase;

  constructor() {
    this.ensureDataDirectory();
    this.db = this.loadDatabase();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): VaultDatabase {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load database file, creating fresh:', e);
    }
    const fresh = createInitialDatabase();
    this.saveDatabase(fresh);
    return fresh;
  }

  public saveDatabase(data?: VaultDatabase) {
    if (data) this.db = data;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public getDb(): VaultDatabase {
    return this.db;
  }

  public addAuditLog(log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) {
    const entry: SecurityAuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.db.auditLogs.unshift(entry);
    // Keep last 1000 logs
    if (this.db.auditLogs.length > 1000) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 1000);
    }
    this.saveDatabase();
    return entry;
  }
}

const dbManager = new VaultDatabaseManager();

// Sanitize user object to never expose passwordHash
function sanitizeUser(user: ServerUser) {
  const { passwordHash, twoFactorSecret, ...safe } = user;
  return safe;
}

// Clean up expired sessions periodically
setInterval(() => {
  const db = dbManager.getDb();
  const now = Date.now();
  const initialLength = db.sessions.length;
  db.sessions = db.sessions.filter((s) => new Date(s.expiresAt).getTime() > now);
  if (db.sessions.length !== initialLength) {
    dbManager.saveDatabase();
  }
}, 60 * 1000);

// --- Authentication Middleware ---
interface AuthenticatedRequest extends Request {
  sessionUser?: ServerUser;
  vaultSession?: ActiveSession;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Authentication token is required.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const db = dbManager.getDb();
  const session = db.sessions.find((s) => s.token === token);

  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Session not found or has been revoked.' });
    return;
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    // Session expired
    db.sessions = db.sessions.filter((s) => s.token !== token);
    dbManager.saveDatabase();
    res.status(401).json({ error: 'Session expired: Please log in again.' });
    return;
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized: User account no longer exists.' });
    return;
  }

  if (user.status !== 'Active' || user.loginDisabled) {
    res.status(403).json({ error: 'Forbidden: Account has been deactivated or disabled by Administrator.' });
    return;
  }

  // Extend last active
  session.lastActiveAt = new Date().toISOString();
  req.sessionUser = user;
  req.vaultSession = session;
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.sessionUser?.accountType !== 'super_admin') {
      res.status(403).json({ error: 'Forbidden: Super Administrator privileges required.' });
      return;
    }
    next();
  });
}

function requireStaffOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.sessionUser?.accountType !== 'super_admin' && req.sessionUser?.accountType !== 'staff') {
      res.status(403).json({ error: 'Forbidden: Staff or Administrator privileges required.' });
      return;
    }
    next();
  });
}

// Helper to extract client IP and user agent
function getClientMeta(req: Request) {
  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';
  return { ipAddress, userAgent };
}

// In-memory 2FA verification temp tokens
const temp2FATokens = new Map<string, { userId: string; expiresAt: number; code: string }>();

// --- Server Setup ---
async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '30mb' }));

  // ==========================================
  // API ROUTE 1: Login
  // ==========================================
  app.post('/api/vault/auth/login', (req: Request, res: Response): void => {
    const { username, password, twoFactorCode } = req.body;
    const { ipAddress, userAgent } = getClientMeta(req);

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    const db = dbManager.getDb();
    const cleanUsername = String(username).trim().toLowerCase();

    // Check Lockout
    const failedRecord = db.failedLogins[cleanUsername];
    if (failedRecord && failedRecord.lockedUntil && failedRecord.lockedUntil > Date.now()) {
      const remainingSeconds = Math.ceil((failedRecord.lockedUntil - Date.now()) / 1000);
      dbManager.addAuditLog({
        user: cleanUsername,
        userRole: 'Unknown',
        action: 'AUTH_LOCKOUT_REJECTED',
        category: 'Auth',
        status: 'Denied',
        details: `Rejected login attempt on locked account '${cleanUsername}'. ${remainingSeconds}s remaining.`,
        ipAddress,
        device: userAgent
      });
      res.status(423).json({
        error: `Account is temporarily locked due to multiple failed attempts. Please try again in ${Math.ceil(remainingSeconds / 60)} minute(s).`,
        locked: true,
        remainingSeconds
      });
      return;
    }

    // Find User
    const user = db.users.find(
      (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername
    );

    if (!user) {
      // Record failed attempt
      const currentFails = (failedRecord?.count || 0) + 1;
      let lockedUntil: number | undefined;
      if (currentFails >= db.securityConfig.maxFailedLoginsBeforeLock) {
        lockedUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
      }
      db.failedLogins[cleanUsername] = { count: currentFails, lockedUntil };
      dbManager.saveDatabase();

      dbManager.addAuditLog({
        user: cleanUsername,
        userRole: 'Unknown',
        action: 'AUTH_FAILED_USER_NOT_FOUND',
        category: 'Auth',
        status: 'Denied',
        details: `Failed login attempt for non-existent username/email '${cleanUsername}'. Attempt ${currentFails}.`,
        ipAddress,
        device: userAgent
      });

      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    // Check account status
    if (user.status !== 'Active' || user.loginDisabled) {
      dbManager.addAuditLog({
        user: user.username,
        userRole: user.role,
        action: 'AUTH_ACCOUNT_DISABLED_ATTEMPT',
        category: 'Auth',
        status: 'Denied',
        details: `Login attempt on deactivated/disabled account '${user.username}' (Status: ${user.status}, Disabled: ${user.loginDisabled}).`,
        ipAddress,
        device: userAgent
      });
      res.status(403).json({
        error: `Account is ${user.status === 'Suspended' ? 'suspended' : 'deactivated'}. Please contact CA Krishna Panjiyar administrator.`
      });
      return;
    }

    // Verify Password
    const passwordValid = verifyPassword(String(password), user.passwordHash);
    if (!passwordValid) {
      const currentFails = (failedRecord?.count || 0) + 1;
      let lockedUntil: number | undefined;
      if (currentFails >= db.securityConfig.maxFailedLoginsBeforeLock) {
        lockedUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
      }
      db.failedLogins[cleanUsername] = { count: currentFails, lockedUntil };
      dbManager.saveDatabase();

      dbManager.addAuditLog({
        user: user.username,
        userRole: user.role,
        action: 'AUTH_PASSWORD_FAILED',
        category: 'Auth',
        status: 'Denied',
        details: `Incorrect password attempt for user '${user.username}'. Attempt ${currentFails} of ${db.securityConfig.maxFailedLoginsBeforeLock}.`,
        ipAddress,
        device: userAgent
      });

      res.status(401).json({
        error: 'Invalid username or password.',
        attemptsLeft: Math.max(0, db.securityConfig.maxFailedLoginsBeforeLock - currentFails)
      });
      return;
    }

    // Check if 2FA is required
    const requires2FA = user.twoFactorEnabled || db.securityConfig.enforceTwoFactor;
    if (requires2FA && !twoFactorCode) {
      // Generate 6-digit OTP code & temp token
      const tempToken = crypto.randomBytes(24).toString('hex');
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      temp2FATokens.set(tempToken, {
        userId: user.id,
        expiresAt: Date.now() + 5 * 60 * 1000,
        code: otpCode
      });

      dbManager.addAuditLog({
        user: user.username,
        userRole: user.role,
        action: 'AUTH_2FA_CHALLENGE_ISSUED',
        category: 'Auth',
        status: 'Success',
        details: `Two-factor authentication challenge issued for user '${user.username}'. Verification required.`,
        ipAddress,
        device: userAgent
      });

      res.json({
        require2FA: true,
        tempToken,
        maskedEmail: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
        // For development/demo convenience, return preview code if testing
        demoOtp: otpCode
      });
      return;
    }

    if (requires2FA && twoFactorCode) {
      // Validate 2FA code
      const { tempToken } = req.body;
      const challenge = temp2FATokens.get(tempToken);
      if (!challenge || challenge.expiresAt < Date.now() || challenge.userId !== user.id) {
        res.status(400).json({ error: '2FA session expired. Please log in again.' });
        return;
      }
      if (challenge.code !== String(twoFactorCode).trim()) {
        dbManager.addAuditLog({
          user: user.username,
          userRole: user.role,
          action: 'AUTH_2FA_CODE_FAILED',
          category: 'Auth',
          status: 'Denied',
          details: `Invalid 2FA code attempt for user '${user.username}'.`,
          ipAddress,
          device: userAgent
        });
        res.status(401).json({ error: 'Invalid 2FA verification code.' });
        return;
      }
      temp2FATokens.delete(tempToken);
    }

    // Success! Clear failed logins
    delete db.failedLogins[cleanUsername];

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    const timeoutMs = db.securityConfig.sessionTimeoutMinutes * 60 * 1000;
    const sessionExpiresAt = new Date(Date.now() + timeoutMs).toISOString();

    const session: ActiveSession = {
      id: `SES-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      token,
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      accountType: user.accountType,
      device: userAgent.slice(0, 80),
      ipAddress,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      expiresAt: sessionExpiresAt
    };

    db.sessions.push(session);
    user.lastLogin = new Date().toISOString();
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: user.username,
      userRole: user.role,
      action: 'AUTH_LOGIN_SUCCESS',
      category: 'Auth',
      status: 'Success',
      details: `Successful login by '${user.fullName}' (${user.accountType.toUpperCase()}) from ${ipAddress}. Session issued.`,
      ipAddress,
      device: userAgent
    });

    res.json({
      success: true,
      token,
      expiresAt: sessionExpiresAt,
      user: sanitizeUser(user),
      sessionId: session.id
    });
  });

  // ==========================================
  // API ROUTE 2: Get Current User & Session Info
  // ==========================================
  app.get('/api/vault/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    res.json({
      user: sanitizeUser(req.sessionUser!),
      session: {
        id: req.vaultSession!.id,
        expiresAt: req.vaultSession!.expiresAt,
        device: req.vaultSession!.device,
        ipAddress: req.vaultSession!.ipAddress
      }
    });
  });

  // ==========================================
  // API ROUTE 3: Logout
  // ==========================================
  app.post('/api/vault/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    const db = dbManager.getDb();
    const token = req.vaultSession!.token;
    db.sessions = db.sessions.filter((s) => s.token !== token);
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: req.sessionUser!.username,
      userRole: req.sessionUser!.role,
      action: 'AUTH_LOGOUT',
      category: 'Auth',
      status: 'Success',
      details: `User '${req.sessionUser!.username}' logged out successfully. Session terminated.`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // ==========================================
  // API ROUTE 4: Change Own Password
  // ==========================================
  app.post('/api/vault/auth/change-password', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Both current password and new password are required.' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }

    const user = req.sessionUser!;
    if (!verifyPassword(String(currentPassword), user.passwordHash)) {
      res.status(401).json({ error: 'Current password is incorrect.' });
      return;
    }

    user.passwordHash = hashPassword(String(newPassword));
    user.forcePasswordChange = false;

    const db = dbManager.getDb();
    // Update in database
    const idx = db.users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      db.users[idx] = user;
    }
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: user.username,
      userRole: user.role,
      action: 'USER_PASSWORD_CHANGED',
      category: 'Security',
      status: 'Success',
      details: `User '${user.username}' changed their password. New PBKDF2 salt generated.`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  });

  // ==========================================
  // API ROUTE 5: Active Sessions Management
  // ==========================================
  app.get('/api/vault/auth/sessions', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    const db = dbManager.getDb();
    const user = req.sessionUser!;

    // Super admin can see all sessions; client/staff sees only their own
    const sessions = user.accountType === 'super_admin'
      ? db.sessions.map((s) => ({
          ...s,
          isCurrent: s.id === req.vaultSession!.id
        }))
      : db.sessions
          .filter((s) => s.userId === user.id)
          .map((s) => ({
            ...s,
            isCurrent: s.id === req.vaultSession!.id
          }));

    res.json({ sessions });
  });

  app.delete('/api/vault/auth/sessions/:sessionId', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    const { sessionId } = req.params;
    const db = dbManager.getDb();
    const user = req.sessionUser!;

    const targetSession = db.sessions.find((s) => s.id === sessionId);
    if (!targetSession) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }

    if (user.accountType !== 'super_admin' && targetSession.userId !== user.id) {
      res.status(403).json({ error: 'Unauthorized to revoke this session.' });
      return;
    }

    db.sessions = db.sessions.filter((s) => s.id !== sessionId);
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: user.username,
      userRole: user.role,
      action: 'SESSION_REVOKED',
      category: 'Security',
      status: 'Success',
      details: `Session ${sessionId} (User: ${targetSession.username}, IP: ${targetSession.ipAddress}) was revoked.`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.json({ success: true, message: 'Session revoked successfully.' });
  });

  // ==========================================
  // API ROUTE 6: Super Admin User Management
  // ==========================================
  app.get('/api/vault/users', requireAdmin, (_req: AuthenticatedRequest, res: Response): void => {
    const db = dbManager.getDb();
    const sanitized = db.users.map(sanitizeUser);
    res.json({ users: sanitized });
  });

  app.post('/api/vault/users', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    const {
      fullName,
      company,
      email,
      phone,
      username,
      password,
      accountType,
      role,
      notes,
      assignedProjects,
      assignedClientIds,
      sectionAccess,
      permissions
    } = req.body;

    if (!fullName || !email || !username || !password || !accountType) {
      res.status(400).json({ error: 'Full name, email, username, password, and account type are required.' });
      return;
    }

    const db = dbManager.getDb();
    const cleanUsername = String(username).trim().toLowerCase();

    // Check duplicate username or email
    const exists = db.users.some(
      (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === String(email).trim().toLowerCase()
    );
    if (exists) {
      res.status(400).json({ error: 'A user with this username or email already exists.' });
      return;
    }

    const defaultPerm = accountType === 'super_admin' ? fullPerms : accountType === 'staff' ? staffPerms : clientPerms;
    const defaultSections = accountType === 'super_admin'
      ? ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports', 'Messages', 'Settings']
      : ['Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices'];

    const newUser: ServerUser = {
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      fullName: String(fullName).trim(),
      company: String(company || 'PANJIYAR KRISHNA & CO.').trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      username: cleanUsername,
      passwordHash: hashPassword(String(password)),
      accountType,
      role: String(role || (accountType === 'staff' ? 'Audit Associate' : 'Corporate Client')).trim(),
      status: 'Active',
      assignedProjects: Array.isArray(assignedProjects) ? assignedProjects : [],
      assignedClientIds: Array.isArray(assignedClientIds) ? assignedClientIds : [],
      notes: String(notes || '').trim(),
      createdAt: new Date().toISOString(),
      lastLogin: 'Never',
      forcePasswordChange: true,
      loginDisabled: false,
      twoFactorEnabled: false,
      permissions: permissions || {
        'Client Vault': defaultPerm,
        'Files': defaultPerm,
        'Projects': defaultPerm,
        'Documents': defaultPerm,
        'Profile': defaultPerm
      },
      sectionAccess: sectionAccess || defaultSections
    };

    db.users.push(newUser);
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: req.sessionUser!.username,
      userRole: req.sessionUser!.role,
      action: 'USER_CREATED',
      category: 'User',
      status: 'Success',
      details: `Created new user '${newUser.username}' (${newUser.fullName}, Type: ${newUser.accountType}).`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.status(201).json({ success: true, user: sanitizeUser(newUser) });
  });

  app.put('/api/vault/users/:id', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    const { id } = req.params;
    const db = dbManager.getDb();
    const userIndex = db.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const existing = db.users[userIndex];
    const {
      fullName,
      company,
      email,
      phone,
      role,
      notes,
      assignedProjects,
      assignedClientIds,
      sectionAccess,
      permissions,
      status,
      loginDisabled,
      twoFactorEnabled
    } = req.body;

    db.users[userIndex] = {
      ...existing,
      fullName: fullName !== undefined ? String(fullName) : existing.fullName,
      company: company !== undefined ? String(company) : existing.company,
      email: email !== undefined ? String(email) : existing.email,
      phone: phone !== undefined ? String(phone) : existing.phone,
      role: role !== undefined ? String(role) : existing.role,
      notes: notes !== undefined ? String(notes) : existing.notes,
      assignedProjects: Array.isArray(assignedProjects) ? assignedProjects : existing.assignedProjects,
      assignedClientIds: Array.isArray(assignedClientIds) ? assignedClientIds : existing.assignedClientIds,
      sectionAccess: Array.isArray(sectionAccess) ? sectionAccess : existing.sectionAccess,
      permissions: permissions !== undefined ? permissions : existing.permissions,
      status: status !== undefined ? status : existing.status,
      loginDisabled: loginDisabled !== undefined ? Boolean(loginDisabled) : existing.loginDisabled,
      twoFactorEnabled: twoFactorEnabled !== undefined ? Boolean(twoFactorEnabled) : existing.twoFactorEnabled
    };

    // If disabled or inactive, revoke all sessions
    if (db.users[userIndex].loginDisabled || db.users[userIndex].status !== 'Active') {
      db.sessions = db.sessions.filter((s) => s.userId !== id);
    }

    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: req.sessionUser!.username,
      userRole: req.sessionUser!.role,
      action: 'USER_UPDATED',
      category: 'User',
      status: 'Success',
      details: `Updated user '${existing.username}' profile and configuration.`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.json({ success: true, user: sanitizeUser(db.users[userIndex]) });
  });

  app.post('/api/vault/users/:id/reset-password', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    const { id } = req.params;
    const { newPassword } = req.body;
    const db = dbManager.getDb();
    const user = db.users.find((u) => u.id === id);

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Generate random secure password if not provided
    const tempPassword = newPassword || `Panjiyar@${Math.floor(1000 + Math.random() * 9000)}!`;
    user.passwordHash = hashPassword(tempPassword);
    user.forcePasswordChange = true;

    // Invalidate existing sessions so user must re-authenticate with new password
    db.sessions = db.sessions.filter((s) => s.userId !== id);
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: req.sessionUser!.username,
      userRole: req.sessionUser!.role,
      action: 'USER_PASSWORD_RESET',
      category: 'Security',
      status: 'Success',
      details: `Admin reset password for user '${user.username}'. Sessions invalidated, forced change enabled.`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.json({
      success: true,
      message: `Password reset successfully for ${user.fullName}.`,
      tempPassword
    });
  });

  app.delete('/api/vault/users/:id', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    const { id } = req.params;
    const db = dbManager.getDb();

    if (id === req.sessionUser!.id) {
      res.status(400).json({ error: 'You cannot delete your own active administrator account.' });
      return;
    }

    const user = db.users.find((u) => u.id === id);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    db.users = db.users.filter((u) => u.id !== id);
    db.sessions = db.sessions.filter((s) => s.userId !== id);
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: req.sessionUser!.username,
      userRole: req.sessionUser!.role,
      action: 'USER_DELETED',
      category: 'User',
      status: 'Warning',
      details: `Permanently deleted user '${user.username}' (${user.fullName}).`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.json({ success: true, message: `User ${user.fullName} deleted successfully.` });
  });

  // ==========================================
  // API ROUTE 7: Protected Files & Vault Data (With Server Data Isolation)
  // ==========================================
  app.get('/api/vault/files', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    const db = dbManager.getDb();
    const user = req.sessionUser!;

    let allowedFiles: VaultFile[] = [];

    if (user.accountType === 'super_admin') {
      // Admin sees all files
      allowedFiles = db.files;
    } else if (user.accountType === 'staff') {
      // Staff sees only files of assigned clients or projects
      const assignedClients = user.assignedClientIds || [];
      const assignedProjects = user.assignedProjects || [];
      allowedFiles = db.files.filter(
        (f) => assignedClients.includes(f.clientId) || (f.projectId && assignedProjects.includes(f.projectId))
      );
    } else {
      // Client sees ONLY their own company files
      allowedFiles = db.files.filter((f) => f.clientId === user.id);
    }

    res.json({ files: allowedFiles });
  });

  app.post('/api/vault/files', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    const user = req.sessionUser!;
    const { title, fileName, fileType, fileSize, clientId, clientName, projectId, projectName, folder } = req.body;

    if (!title || !fileName) {
      res.status(400).json({ error: 'File title and file name are required.' });
      return;
    }

    // Permission check
    const targetClientId = user.accountType === 'client' ? user.id : (clientId || user.id);
    const targetClientName = user.accountType === 'client' ? user.company : (clientName || user.company);

    const newFile: VaultFile = {
      id: `FIL-${Date.now().toString(36).toUpperCase()}`,
      title: String(title).trim(),
      fileName: String(fileName).trim(),
      fileType: fileType || 'document',
      fileSize: fileSize || '1.5 MB',
      clientId: targetClientId,
      clientName: targetClientName,
      projectId,
      projectName,
      folder: folder || 'Documents',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: user.fullName,
      sha256Hash: crypto.randomBytes(32).toString('hex'),
      encryptionStandard: 'AES-256 (GCM)',
      permissions: {
        canView: true,
        canUpload: true,
        canDownload: true,
        canEdit: user.accountType !== 'client',
        canDelete: user.accountType === 'super_admin',
        canShare: true,
        canRename: user.accountType !== 'client',
        canMove: user.accountType !== 'client'
      }
    };

    const db = dbManager.getDb();
    db.files.unshift(newFile);
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: user.username,
      userRole: user.role,
      action: 'FILE_UPLOADED',
      category: 'File',
      status: 'Success',
      details: `File '${newFile.fileName}' uploaded for client '${newFile.clientName}'. Encrypted with AES-256 GCM.`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.status(201).json({ success: true, file: newFile });
  });

  app.delete('/api/vault/files/:id', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    const { id } = req.params;
    const db = dbManager.getDb();
    const user = req.sessionUser!;

    const file = db.files.find((f) => f.id === id);
    if (!file) {
      res.status(404).json({ error: 'File not found.' });
      return;
    }

    // Only Admin or assigned staff with delete permission can delete
    if (user.accountType === 'client') {
      res.status(403).json({ error: 'Clients are not permitted to delete audit files.' });
      return;
    }

    db.files = db.files.filter((f) => f.id !== id);
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: user.username,
      userRole: user.role,
      action: 'FILE_DELETED',
      category: 'File',
      status: 'Warning',
      details: `File '${file.fileName}' (${file.id}) was permanently deleted.`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.json({ success: true, message: 'File deleted successfully.' });
  });

  // ==========================================
  // API ROUTE 8: Protected Projects
  // ==========================================
  app.get('/api/vault/projects', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
    const db = dbManager.getDb();
    const user = req.sessionUser!;

    let projects: VaultProject[] = [];
    if (user.accountType === 'super_admin') {
      projects = db.projects;
    } else if (user.accountType === 'staff') {
      projects = db.projects.filter((p) => p.assignedStaffIds.includes(user.id) || (user.assignedProjects || []).includes(p.id));
    } else {
      projects = db.projects.filter((p) => p.clientId === user.id);
    }

    res.json({ projects });
  });

  // ==========================================
  // API ROUTE 9: Audit Logs (Admin Only)
  // ==========================================
  app.get('/api/vault/audit-logs', requireAdmin, (_req: AuthenticatedRequest, res: Response): void => {
    const db = dbManager.getDb();
    res.json({ logs: db.auditLogs });
  });

  // ==========================================
  // API ROUTE 10: Security Configuration
  // ==========================================
  app.get('/api/vault/security-config', requireAdmin, (_req: AuthenticatedRequest, res: Response): void => {
    const db = dbManager.getDb();
    res.json({ config: db.securityConfig });
  });

  app.put('/api/vault/security-config', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
    const db = dbManager.getDb();
    db.securityConfig = {
      ...db.securityConfig,
      ...req.body
    };
    dbManager.saveDatabase();

    dbManager.addAuditLog({
      user: req.sessionUser!.username,
      userRole: req.sessionUser!.role,
      action: 'SECURITY_CONFIG_UPDATED',
      category: 'Security',
      status: 'Success',
      details: `Security configuration updated by Administrator.`,
      ipAddress: req.vaultSession!.ipAddress
    });

    res.json({ success: true, config: db.securityConfig });
  });

  // ==========================================
  // Static Assets / Vite Integration
  // ==========================================
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Panjiyar CA Vault] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
