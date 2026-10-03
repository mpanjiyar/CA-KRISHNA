export type VaultAccountType = 'super_admin' | 'staff' | 'client' | 'custom';

export type VaultAccountStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Expired';

export interface SectionPermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  upload: boolean;
  download: boolean;
  share: boolean;
}

export type VaultSectionName =
  | 'Dashboard'
  | 'My Profile'
  | 'Projects'
  | 'Documents'
  | 'Files'
  | 'Photos'
  | 'Videos'
  | 'Gallery'
  | 'Invoices'
  | 'Reports'
  | 'Messages'
  | 'Notifications'
  | 'Downloads'
  | 'Support'
  | 'Settings';

export interface UserPermissions {
  [section: string]: SectionPermission;
}

export interface VaultUser {
  id: string; // e.g. "USR-1082"
  fullName: string;
  company: string;
  email: string;
  phone: string;
  username: string;
  passwordMasked?: string;
  accountType: VaultAccountType;
  role: string;
  profilePhoto?: string;
  status: VaultAccountStatus;
  assignedProjects: string[]; // Project IDs
  assignedClientIds?: string[]; // Staff specific: which client vaults they can manage
  notes?: string;
  createdAt: string;
  lastLogin: string;
  forcePasswordChange: boolean;
  loginDisabled: boolean;
  twoFactorEnabled: boolean;
  canSelfManageCredentials?: boolean; // When false, only Admin can manage credentials
  passwordHash?: string; // PBKDF2 WebCrypto hash
  passwordSalt?: string; // Salt for PBKDF2
  lastPasswordChange?: string;
  permissions: UserPermissions;
  sectionAccess: VaultSectionName[];
  activeSessionsCount: number;
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

export interface VaultFileItem {
  id: string;
  title: string;
  fileName: string;
  fileType: 'document' | 'photo' | 'video' | 'invoice' | 'report' | 'contract';
  fileSize: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  folder: 'Documents' | 'Photos' | 'Videos' | 'Invoices' | 'Reports' | 'Contracts';
  uploadDate: string;
  uploadedBy: string;
  sha256Hash: string;
  encryptionStandard: string;
  verificationStatus?: 'Verified' | 'Under Review' | 'Action Required';
  reviewedBy?: string;
  previewContent?: string;
  tags?: string[];
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
  fileUrl?: string;
}

export interface VaultFolder {
  id: string;
  name: VaultFileItem['folder'];
  displayName: string;
  description: string;
  color: string;
  iconName: string;
  itemCount?: number;
  totalSize?: string;
}

export interface VaultSession {
  user: VaultUser;
  token: string;
  loginTime: string;
  expiresAt: string;
  ipAddress: string;
  deviceInfo: string;
  twoFactorVerified: boolean;
}

export interface VaultInvitation {
  id: string;
  recipientName: string;
  recipientEmail: string;
  company: string;
  accountType: VaultAccountType;
  role: string;
  invitedAt: string;
  expiresAt: string;
  status: 'Pending' | 'Accepted' | 'Expired' | 'Cancelled';
  setupLink: string;
  assignedProject?: string;
}

export interface VaultAuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  category: 'Auth' | 'Permission' | 'File' | 'User' | 'Project' | 'Security';
  status: 'Success' | 'Denied' | 'Warning';
  details: string;
  ipAddress: string;
}

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  accountType: VaultAccountType;
  sectionAccess: VaultSectionName[];
  permissions: UserPermissions;
}

export interface VaultSecurityConfig {
  sessionTimeoutMinutes: number;
  maxFailedLoginsBeforeLock: number;
  enforceTwoFactor: boolean;
  enforcePasswordComplexity: boolean;
  passwordExpiryDays: number;
  ipWhitelistEnabled: boolean;
  notifyOnNewLogin: boolean;
}
