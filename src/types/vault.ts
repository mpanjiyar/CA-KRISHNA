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

export interface VaultFolder {
  id: string; // e.g. "FLD-DOCS", "FLD-INV", etc.
  name: string; // e.g. "Documents & Certificates"
  slug: string;
  clientId: string; // "all" for global firm-wide folders, or specific client ID e.g. "USR-CL-101"
  description?: string;
  color?: string; // e.g. "blue", "emerald", "amber", "purple", "rose", "cyan"
  icon?: string; // "Folder" | "FileText" | "FileSpreadsheet" | "Image" | "Video" | "Shield" | "Briefcase"
  createdAt: string;
  createdBy: string;
  isSystem?: boolean;
  permissions?: {
    canView: boolean;
    canUpload: boolean;
    canDownload: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

export interface VaultFileItem {
  id: string;
  title: string;
  fileName: string;
  fileType: 'document' | 'photo' | 'video' | 'invoice' | 'report' | 'contract' | 'spreadsheet' | 'archive';
  fileSize: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  folderId?: string; // References VaultFolder.id
  folder: string; // Folder name for display & categorization
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
  fileUrl?: string;
  previewContent?: string;
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
