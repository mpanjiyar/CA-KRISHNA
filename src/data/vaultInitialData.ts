import {
  VaultUser,
  VaultProject,
  VaultFolder,
  VaultFileItem,
  VaultInvitation,
  VaultAuditLogEntry,
  RoleTemplate,
  VaultSecurityConfig,
  SectionPermission
} from '../types/vault';

const fullPermissions: SectionPermission = {
  view: true,
  create: true,
  edit: true,
  delete: true,
  upload: true,
  download: true,
  share: true
};

const clientDefaultPermissions: SectionPermission = {
  view: true,
  create: false,
  edit: false,
  delete: false,
  upload: true,
  download: true,
  share: false
};

const staffDefaultPermissions: SectionPermission = {
  view: true,
  create: true,
  edit: true,
  delete: false,
  upload: true,
  download: true,
  share: true
};

export const INITIAL_ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'tmpl-super-admin',
    name: 'Super Admin',
    description: 'Full unconstrained administrative rights across all vaults, files, users, and security settings.',
    accountType: 'super_admin',
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Photos', 'Videos',
      'Gallery', 'Invoices', 'Reports', 'Messages', 'Notifications', 'Downloads', 'Support', 'Settings'
    ],
    permissions: {
      'Client Vault': fullPermissions,
      'Files': fullPermissions,
      'Projects': fullPermissions,
      'Gallery': fullPermissions,
      'Documents': fullPermissions,
      'Messages': fullPermissions,
      'Profile': { ...fullPermissions, delete: false }
    }
  },
  {
    id: 'tmpl-project-manager',
    name: 'Project Manager',
    description: 'Manages assigned corporate client portfolios, reviews audit filings, schedules statutory deadlines.',
    accountType: 'staff',
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports', 'Messages', 'Notifications'
    ],
    permissions: {
      'Client Vault': staffDefaultPermissions,
      'Files': staffDefaultPermissions,
      'Projects': fullPermissions,
      'Gallery': { ...staffDefaultPermissions, create: false },
      'Documents': staffDefaultPermissions,
      'Messages': staffDefaultPermissions,
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    }
  },
  {
    id: 'tmpl-content-staff',
    name: 'Compliance & Audit Staff',
    description: 'Handles daily GST return ledgers, TDS reconciliation, and document upload verification.',
    accountType: 'staff',
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Reports', 'Messages', 'Notifications'
    ],
    permissions: {
      'Client Vault': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
      'Files': { view: true, create: false, edit: false, delete: false, upload: true, download: true, share: false },
      'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Gallery': { view: true, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Documents': { view: true, create: true, edit: false, delete: false, upload: true, download: true, share: false },
      'Messages': { view: true, create: true, edit: false, delete: false, upload: false, download: false, share: false },
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    }
  },
  {
    id: 'tmpl-client-standard',
    name: 'Corporate Client',
    description: 'Standard access for business owners to upload accounting documents, download signed certificates, and view invoices.',
    accountType: 'client',
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports', 'Messages', 'Notifications', 'Downloads'
    ],
    permissions: {
      'Client Vault': clientDefaultPermissions,
      'Files': clientDefaultPermissions,
      'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Gallery': { view: true, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Documents': clientDefaultPermissions,
      'Messages': { view: true, create: true, edit: false, delete: false, upload: false, download: false, share: false },
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    }
  }
];

export const INITIAL_PROJECTS: VaultProject[] = [
  {
    id: 'PRJ-MUM-01',
    title: 'Statutory & Tax Audit FY 2025-26',
    clientName: 'Apex Precision Engineering Ltd',
    clientId: 'USR-CL-101',
    category: 'Statutory Audit',
    assignedStaffIds: ['USR-STF-201', 'USR-STF-202'],
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
    assignedStaffIds: ['USR-STF-202'],
    status: 'Under Review',
    dueDate: '2026-12-31',
    createdDate: '2026-05-15',
    description: 'Reconciliation of GSTR-2B vs Books, reverse charge mechanism audit, and export refund filings.'
  },
  {
    id: 'PRJ-MUM-03',
    title: 'Bank Loan CMA Project Financing (₹14.5 Cr)',
    clientName: 'Bluecrest Logistics & Cold Storage',
    clientId: 'USR-CL-103',
    category: 'Project Financing',
    assignedStaffIds: ['USR-STF-201'],
    status: 'Completed',
    dueDate: '2026-06-30',
    createdDate: '2026-03-10',
    description: 'Full DSCR modeling, bank consortium presentation, and working capital credit appraisal dossier.'
  },
  {
    id: 'PRJ-MUM-04',
    title: 'Cross-Border SaaS Export 15CA/15CB Compliance',
    clientName: 'Vertex FinTech Pvt Ltd',
    clientId: 'USR-CL-104',
    category: 'International Tax',
    assignedStaffIds: ['USR-STF-201', 'USR-STF-202'],
    status: 'Active',
    dueDate: '2026-09-15',
    createdDate: '2026-07-01',
    description: 'DTAA withholding tax evaluation and chartered certification for foreign software outward remittances.'
  }
];

export const INITIAL_USERS: VaultUser[] = [
  {
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
    notes: 'Super administrator with master encryption keys and regulatory authorization rights.',
    createdAt: '2025-01-15',
    lastLogin: 'Today, 08:35 AM',
    forcePasswordChange: false,
    loginDisabled: false,
    twoFactorEnabled: true,
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Photos', 'Videos',
      'Gallery', 'Invoices', 'Reports', 'Messages', 'Notifications', 'Downloads', 'Support', 'Settings'
    ],
    permissions: {
      'Client Vault': fullPermissions,
      'Files': fullPermissions,
      'Projects': fullPermissions,
      'Gallery': fullPermissions,
      'Documents': fullPermissions,
      'Messages': fullPermissions,
      'Profile': fullPermissions
    },
    activeSessionsCount: 2
  },
  {
    id: 'USR-STF-201',
    fullName: 'CA Sneha Mehta',
    company: 'PANJIYAR KRISHNA & CO.',
    email: 'sneha.mehta@panjiyarca.in',
    phone: '+91 9820144981',
    username: 'sneha.ca',
    accountType: 'staff',
    role: 'Senior Audit Manager',
    status: 'Active',
    assignedProjects: ['PRJ-MUM-01', 'PRJ-MUM-03', 'PRJ-MUM-04'],
    assignedClientIds: ['USR-CL-101', 'USR-CL-103', 'USR-CL-104'],
    notes: 'Oversees statutory audit reviews and bank project models. Authorized to sign draft reports.',
    createdAt: '2025-04-10',
    lastLogin: 'Yesterday, 04:15 PM',
    forcePasswordChange: false,
    loginDisabled: false,
    twoFactorEnabled: true,
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports', 'Messages', 'Notifications'
    ],
    permissions: {
      'Client Vault': staffDefaultPermissions,
      'Files': staffDefaultPermissions,
      'Projects': staffDefaultPermissions,
      'Gallery': { ...staffDefaultPermissions, create: false },
      'Documents': staffDefaultPermissions,
      'Messages': staffDefaultPermissions,
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    },
    activeSessionsCount: 1
  },
  {
    id: 'USR-STF-202',
    fullName: 'Rohan Verma',
    company: 'PANJIYAR KRISHNA & CO.',
    email: 'rohan.verma@panjiyarca.in',
    phone: '+91 9769018442',
    username: 'rohan.gst',
    accountType: 'staff',
    role: 'Tax Compliance Lead',
    status: 'Active',
    assignedProjects: ['PRJ-MUM-01', 'PRJ-MUM-02', 'PRJ-MUM-04'],
    assignedClientIds: ['USR-CL-101', 'USR-CL-102', 'USR-CL-104'],
    notes: 'Handles GSTR-1, 3B, and ROC compliance. Uploads reconciliations for client review.',
    createdAt: '2025-06-20',
    lastLogin: '28 Sep 2026, 11:20 AM',
    forcePasswordChange: false,
    loginDisabled: false,
    twoFactorEnabled: false,
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Reports', 'Messages', 'Notifications'
    ],
    permissions: {
      'Client Vault': staffDefaultPermissions,
      'Files': staffDefaultPermissions,
      'Projects': staffDefaultPermissions,
      'Gallery': { view: true, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Documents': staffDefaultPermissions,
      'Messages': staffDefaultPermissions,
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    },
    activeSessionsCount: 1
  },
  {
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
    notes: 'Industrial automotive component manufacturer. Access restricted strictly to Apex vault.',
    createdAt: '2025-02-14',
    lastLogin: 'Today, 07:12 AM',
    forcePasswordChange: false,
    loginDisabled: false,
    twoFactorEnabled: true,
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports', 'Messages', 'Notifications', 'Downloads'
    ],
    permissions: {
      'Client Vault': clientDefaultPermissions,
      'Files': clientDefaultPermissions,
      'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Gallery': { view: true, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Documents': clientDefaultPermissions,
      'Messages': { view: true, create: true, edit: false, delete: false, upload: false, download: false, share: false },
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    },
    activeSessionsCount: 1
  },
  {
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
    notes: 'Clinical research organization requiring rigorous audit trails and NDA protections.',
    createdAt: '2025-05-18',
    lastLogin: '29 Sep 2026, 05:40 PM',
    forcePasswordChange: false,
    loginDisabled: false,
    twoFactorEnabled: true,
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports', 'Messages'
    ],
    permissions: {
      'Client Vault': clientDefaultPermissions,
      'Files': clientDefaultPermissions,
      'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Gallery': { view: false, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Documents': clientDefaultPermissions,
      'Messages': { view: true, create: true, edit: false, delete: false, upload: false, download: false, share: false },
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    },
    activeSessionsCount: 1
  },
  {
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
    notes: 'PAN India cold chain infrastructure. Manages CMA banking and project loan documentation.',
    createdAt: '2025-03-12',
    lastLogin: '25 Sep 2026, 02:22 PM',
    forcePasswordChange: false,
    loginDisabled: false,
    twoFactorEnabled: false,
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Invoices', 'Reports'
    ],
    permissions: {
      'Client Vault': clientDefaultPermissions,
      'Files': clientDefaultPermissions,
      'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Gallery': { view: false, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Documents': clientDefaultPermissions,
      'Messages': { view: true, create: true, edit: false, delete: false, upload: false, download: false, share: false },
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    },
    activeSessionsCount: 1
  },
  {
    id: 'USR-CL-104',
    fullName: 'Vikram Joshi',
    company: 'Vertex FinTech Pvt Ltd',
    email: 'vikram@vertexpay.io',
    phone: '+91 9820556789',
    username: 'vertex.vikram',
    accountType: 'client',
    role: 'VP Finance & Operations',
    status: 'Pending',
    assignedProjects: ['PRJ-MUM-04'],
    notes: 'Awaiting first login password setup. Invitation sent on 28 Sep 2026.',
    createdAt: '2026-09-28',
    lastLogin: 'Never logged in',
    forcePasswordChange: true,
    loginDisabled: false,
    twoFactorEnabled: true,
    sectionAccess: [
      'Dashboard', 'My Profile', 'Projects', 'Documents', 'Files', 'Reports', 'Messages'
    ],
    permissions: {
      'Client Vault': clientDefaultPermissions,
      'Files': clientDefaultPermissions,
      'Projects': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Gallery': { view: false, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Documents': clientDefaultPermissions,
      'Messages': { view: true, create: true, edit: false, delete: false, upload: false, download: false, share: false },
      'Profile': { view: true, create: false, edit: true, delete: false, upload: true, download: false, share: false }
    },
    activeSessionsCount: 0
  },
  {
    id: 'USR-CL-105',
    fullName: 'Meera Deshmukh',
    company: 'Sunburst Retail Ventures',
    email: 'meera@sunburststores.com',
    phone: '+91 9867012399',
    username: 'sunburst.meera',
    accountType: 'client',
    role: 'Director',
    status: 'Inactive',
    assignedProjects: [],
    notes: 'Fiscal year engagement concluded. Vault kept in read-only statutory archive state.',
    createdAt: '2024-11-01',
    lastLogin: '14 Aug 2026, 10:14 AM',
    forcePasswordChange: false,
    loginDisabled: true,
    twoFactorEnabled: false,
    sectionAccess: ['Dashboard', 'Documents'],
    permissions: {
      'Client Vault': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Files': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Projects': { view: false, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Gallery': { view: false, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Documents': { view: true, create: false, edit: false, delete: false, upload: false, download: true, share: false },
      'Messages': { view: false, create: false, edit: false, delete: false, upload: false, download: false, share: false },
      'Profile': { view: true, create: false, edit: false, delete: false, upload: false, download: false, share: false }
    },
    activeSessionsCount: 0
  }
];

export const INITIAL_FOLDERS: VaultFolder[] = [
  {
    id: 'FLD-DOCS',
    name: 'Documents & Certificates',
    slug: 'documents',
    clientId: 'all',
    description: 'Statutory audit reports, CA certified balance sheets, and formal tax declarations.',
    color: 'blue',
    icon: 'FileText',
    createdAt: '2026-01-01',
    createdBy: 'CA Krishna Panjiyar',
    isSystem: true,
    permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: false }
  },
  {
    id: 'FLD-REPORTS',
    name: 'Audit & Tax Reports',
    slug: 'reports',
    clientId: 'all',
    description: 'Detailed Form 3CD schedules, transfer pricing dossiers, and GSTR-9C certifications.',
    color: 'emerald',
    icon: 'FileSpreadsheet',
    createdAt: '2026-01-01',
    createdBy: 'CA Krishna Panjiyar',
    isSystem: true,
    permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: false }
  },
  {
    id: 'FLD-INVOICES',
    name: 'Invoices & Financing',
    slug: 'invoices',
    clientId: 'all',
    description: 'Bank CMA working capital dossiers, term loan appraisals, and commercial invoices.',
    color: 'amber',
    icon: 'FileSpreadsheet',
    createdAt: '2026-01-01',
    createdBy: 'CA Krishna Panjiyar',
    isSystem: true,
    permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: false }
  },
  {
    id: 'FLD-PHOTOS',
    name: 'Inspection & Site Photos',
    slug: 'photos',
    clientId: 'all',
    description: 'Physical inventory verification, plant inspection visuals, and registered office geotagged photos.',
    color: 'purple',
    icon: 'Image',
    createdAt: '2026-01-01',
    createdBy: 'CA Krishna Panjiyar',
    isSystem: true,
    permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: false }
  },
  {
    id: 'FLD-VIDEOS',
    name: 'Meeting & Audit Recordings',
    slug: 'videos',
    clientId: 'all',
    description: 'Board audit committee briefings, ROC compliance discussions, and video depositions.',
    color: 'indigo',
    icon: 'Video',
    createdAt: '2026-01-01',
    createdBy: 'CA Krishna Panjiyar',
    isSystem: true,
    permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: false }
  },
  {
    id: 'FLD-CONTRACTS',
    name: 'Agreements & NDAs',
    slug: 'contracts',
    clientId: 'all',
    description: 'Confidential corporate agreements, partner NDAs, and engagement engagement letters.',
    color: 'cyan',
    icon: 'Folder',
    createdAt: '2026-01-01',
    createdBy: 'CA Krishna Panjiyar',
    isSystem: true,
    permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: false }
  },
  {
    id: 'FLD-APX-TAX',
    name: 'FY 2025-26 Tax Workpapers',
    slug: 'apex-tax-workpapers',
    clientId: 'USR-CL-101',
    description: 'Exclusive working files for Apex Precision Engineering Ltd tax audit engagement.',
    color: 'blue',
    icon: 'Shield',
    createdAt: '2026-04-10',
    createdBy: 'CA Krishna Panjiyar',
    isSystem: false,
    permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: true }
  },
  {
    id: 'FLD-NEX-GST',
    name: 'GST Reconciliation Archive',
    slug: 'nexus-gst-archive',
    clientId: 'USR-CL-102',
    description: 'Exclusive monthly GSTR-2B vs ERP reconciliation worksheets for Nexus BioPharma.',
    color: 'emerald',
    icon: 'Briefcase',
    createdAt: '2026-05-20',
    createdBy: 'CA Sneha Mehta',
    isSystem: false,
    permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: true }
  }
];

export const INITIAL_FILES: VaultFileItem[] = [
  {
    id: 'FIL-1001',
    title: 'Signed Statutory Audit Report FY24-25',
    fileName: 'Audit_Report_Apex_FY25_Signed.pdf',
    fileType: 'document',
    fileSize: '4.8 MB',
    clientId: 'USR-CL-101',
    clientName: 'Apex Precision Engineering Ltd',
    projectId: 'PRJ-MUM-01',
    projectName: 'Statutory & Tax Audit FY 2025-26',
    folderId: 'FLD-DOCS',
    folder: 'Documents & Certificates',
    uploadDate: '2026-08-15',
    uploadedBy: 'CA Krishna Panjiyar',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    encryptionStandard: 'AES-256 GCM',
    permissions: {
      canView: true,
      canUpload: false,
      canDownload: true,
      canEdit: false,
      canDelete: false,
      canShare: true,
      canRename: true,
      canMove: true
    },
    previewContent: `PANJIYAR KRISHNA & CO.
CHARTERED ACCOUNTANTS
Firm Regn No: 035129N | Peer Reviewed Unit

INDEPENDENT AUDITOR'S REPORT
To the Members of Apex Precision Engineering Ltd

1. Opinion
We have audited the accompanying standalone financial statements of Apex Precision Engineering Ltd, which comprise the Balance Sheet as at March 31, 2025, and the Statement of Profit and Loss and Statement of Cash Flows for the year then ended.

In our opinion and to the best of our information and according to the explanations given to us, the aforesaid financial statements give the information required by the Companies Act, 2013 in the manner so required and give a true and fair view in conformity with the accounting principles generally accepted in India.`
  },
  {
    id: 'FIL-1002',
    title: 'Form 3CD Tax Audit Statement',
    fileName: 'Form_3CD_Tax_Audit_Statement_FY25.pdf',
    fileType: 'report',
    fileSize: '2.1 MB',
    clientId: 'USR-CL-101',
    clientName: 'Apex Precision Engineering Ltd',
    projectId: 'PRJ-MUM-01',
    projectName: 'Statutory & Tax Audit FY 2025-26',
    folderId: 'FLD-REPORTS',
    folder: 'Audit & Tax Reports',
    uploadDate: '2026-08-18',
    uploadedBy: 'CA Sneha Mehta',
    sha256Hash: 'a7c93e4b11f32890cdfa457788102aef649bc33198de7422bcde1029471abef1',
    encryptionStandard: 'AES-256 GCM',
    permissions: {
      canView: true,
      canUpload: false,
      canDownload: true,
      canEdit: false,
      canDelete: false,
      canShare: false,
      canRename: true,
      canMove: true
    },
    previewContent: `FORM NO. 3CD
[See rule 6G(2)]
Statement of particulars required to be furnished under section 44AB of the Income-tax Act, 1961

1. Name of the assessee: Apex Precision Engineering Ltd
2. Address: Plot 44-A, MIDC Industrial Area, Andheri (East), Mumbai 400093
3. Permanent Account Number (PAN): AAACA1234F
4. Status: Domestic Company
5. Previous year ended: 31st March, 2025
6. Assessment year: 2025-26

Clauses 13 to 44: Audited without qualification. Depreciation schedule conforms with Appendix I.`
  },
  {
    id: 'FIL-1003',
    title: 'GSTR-9C Annual Certification Dossier',
    fileName: 'Nexus_GSTR_9C_Reconciliation_Certified.pdf',
    fileType: 'report',
    fileSize: '3.6 MB',
    clientId: 'USR-CL-102',
    clientName: 'Nexus BioPharma Solutions',
    projectId: 'PRJ-MUM-02',
    projectName: 'GSTR-9 & 9C Annual Reconciliation',
    folderId: 'FLD-REPORTS',
    folder: 'Audit & Tax Reports',
    uploadDate: '2026-09-02',
    uploadedBy: 'Rohan Verma',
    sha256Hash: '98d5a1e2f8c7b3990412e8bcde219a55743b1239cdfe80447192aabbccddeeff',
    encryptionStandard: 'AES-256 GCM',
    permissions: {
      canView: true,
      canUpload: false,
      canDownload: true,
      canEdit: false,
      canDelete: false,
      canShare: true,
      canRename: true,
      canMove: true
    },
    previewContent: `FORM GSTR-9C
[See rule 80(3)]
PART A - RECONCILIATION STATEMENT

GSTIN: 27AABCN8890K1ZP
Legal Name: Nexus BioPharma Solutions Pvt Ltd
Financial Year: 2024-25

Gross Turnover as per audited financial statements: ₹48,22,50,000/-
Taxable Turnover: ₹46,80,00,000/-
Eligible Input Tax Credit reconciled with GSTR-2B: ₹5,41,20,000/-
No adverse tax leakage or reverse charge discrepancy identified.`
  },
  {
    id: 'FIL-1004',
    title: 'Bank CMA Model & 7-Year Cash Flows',
    fileName: 'Bluecrest_CMA_WorkingCapital_14Cr.xlsx',
    fileType: 'spreadsheet',
    fileSize: '8.4 MB',
    clientId: 'USR-CL-103',
    clientName: 'Bluecrest Logistics & Cold Storage',
    projectId: 'PRJ-MUM-03',
    projectName: 'Bank Loan CMA Project Financing',
    folderId: 'FLD-INVOICES',
    folder: 'Invoices & Financing',
    uploadDate: '2026-06-25',
    uploadedBy: 'CA Krishna Panjiyar',
    sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    encryptionStandard: 'AES-256 GCM',
    permissions: {
      canView: true,
      canUpload: false,
      canDownload: true,
      canEdit: false,
      canDelete: false,
      canShare: false,
      canRename: true,
      canMove: true
    },
    previewContent: `BANK CONSORTIUM CREDIT APPRAISAL DOSSIER
Borrower: Bluecrest Logistics & Cold Storage Ltd
Facility: ₹14.50 Crore Working Capital & Cold Chain Expansion

Summary of Financial Ratios:
- Current Ratio: 1.48 (Norm: > 1.33)
- Debt Service Coverage Ratio (DSCR): 2.14x (Average over 7 years)
- Fixed Asset Coverage Ratio: 1.85x
- Break-Even Capacity Utilization: 42.8%`
  },
  {
    id: 'FIL-1005',
    title: 'Form 15CB CA Undertaking Certificate',
    fileName: 'Vertex_15CB_Remittance_USD_450k.pdf',
    fileType: 'document',
    fileSize: '1.4 MB',
    clientId: 'USR-CL-104',
    clientName: 'Vertex FinTech Pvt Ltd',
    projectId: 'PRJ-MUM-04',
    projectName: 'Cross-Border SaaS Export 15CA/15CB Compliance',
    folderId: 'FLD-DOCS',
    folder: 'Documents & Certificates',
    uploadDate: '2026-09-10',
    uploadedBy: 'CA Sneha Mehta',
    sha256Hash: '4f5e6d7c8b9a0123456789abcdef0123456789abcdef0123456789abcdef0123',
    encryptionStandard: 'AES-256 GCM',
    permissions: {
      canView: true,
      canUpload: false,
      canDownload: true,
      canEdit: false,
      canDelete: false,
      canShare: true,
      canRename: true,
      canMove: true
    },
    previewContent: `CERTIFICATE UNDER SECTION 195(6) OF THE INCOME-TAX ACT, 1961
FORM NO. 15CB

Name of Remitter: Vertex FinTech Pvt Ltd
Name of Beneficiary: Cloud Infrastructure Inc, Delaware, USA
Amount: USD 450,000 (INR Equivalent ₹3,78,00,000)
Purpose: SaaS Cloud Hosting and API Gateway Services
Applicable DTAA: India-USA DTAA Article 12 (Royalties & FTS)
TDS Withholding Rate: 0% under Business Profits Article 7.`
  },
  {
    id: 'FIL-1006',
    title: 'Andheri West Office Facility Inspection Photo',
    fileName: 'Facility_Audit_Apex_Plant.jpg',
    fileType: 'photo',
    fileSize: '3.2 MB',
    clientId: 'USR-CL-101',
    clientName: 'Apex Precision Engineering Ltd',
    projectId: 'PRJ-MUM-01',
    projectName: 'Statutory & Tax Audit FY 2025-26',
    folderId: 'FLD-PHOTOS',
    folder: 'Inspection & Site Photos',
    uploadDate: '2026-07-20',
    uploadedBy: 'Rajesh Singhal',
    sha256Hash: '89abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567',
    encryptionStandard: 'AES-256 GCM',
    permissions: {
      canView: true,
      canUpload: true,
      canDownload: true,
      canEdit: false,
      canDelete: false,
      canShare: false,
      canRename: true,
      canMove: true
    },
    previewContent: `[GEOTAGGED INSPECTION IMAGE]
Timestamp: 2026-07-20T14:32:10 IST
Coordinates: 19.1136° N, 72.8697° E (MIDC Industrial Area, Andheri West, Mumbai)
Verification Item: CNC Multi-Axis Milling Unit (Asset ID: CNC-MUM-09)
Auditor Verification: CA Sneha Mehta (Physical asset tagged and matched with Block 3 Fixed Asset Register).`
  }
];

export const INITIAL_INVITATIONS: VaultInvitation[] = [
  {
    id: 'INV-2026-001',
    recipientName: 'Vikram Joshi',
    recipientEmail: 'vikram@vertexpay.io',
    company: 'Vertex FinTech Pvt Ltd',
    accountType: 'client',
    role: 'VP Finance & Operations',
    invitedAt: '2026-09-28 10:15 AM',
    expiresAt: '2026-10-05 10:15 AM',
    status: 'Pending',
    setupLink: 'https://panjiyarkrishna.com/portal/setup?token=vtx_98192a83bd78',
    assignedProject: 'PRJ-MUM-04'
  },
  {
    id: 'INV-2026-002',
    recipientName: 'Priya Nambiar',
    recipientEmail: 'priya.n@panjiyarca.in',
    company: 'PANJIYAR KRISHNA & CO.',
    accountType: 'staff',
    role: 'Junior Audit Associate',
    invitedAt: '2026-09-29 02:45 PM',
    expiresAt: '2026-10-06 02:45 PM',
    status: 'Pending',
    setupLink: 'https://panjiyarkrishna.com/portal/setup?token=stf_11928bc9910a',
    assignedProject: 'PRJ-MUM-01'
  },
  {
    id: 'INV-2026-003',
    recipientName: 'Harpreet Singh',
    recipientEmail: 'harpreet@bluecrestlogistics.in',
    company: 'Bluecrest Logistics & Cold Storage',
    accountType: 'client',
    role: 'Chief Financial Officer',
    invitedAt: '2026-03-12 11:00 AM',
    expiresAt: '2026-03-19 11:00 AM',
    status: 'Accepted',
    setupLink: 'https://panjiyarkrishna.com/portal/setup?token=blu_complete',
    assignedProject: 'PRJ-MUM-03'
  }
];

export const INITIAL_AUDIT_LOGS: VaultAuditLogEntry[] = [
  {
    id: 'LOG-8812',
    timestamp: '2026-09-30 08:35:12',
    user: 'CA Krishna Panjiyar',
    userRole: 'Super Admin',
    action: 'Session Authentication Succeeded',
    category: 'Auth',
    status: 'Success',
    details: 'Master admin signed in via secure 2FA credential token from Andheri West subnet.',
    ipAddress: '157.34.192.11'
  },
  {
    id: 'LOG-8811',
    timestamp: '2026-09-30 07:12:44',
    user: 'Rajesh Singhal',
    userRole: 'Corporate Client',
    action: 'File Download: Audit_Report_Apex_FY25_Signed.pdf',
    category: 'File',
    status: 'Success',
    details: 'Encrypted payload decrypted with client session ephemeral token. SHA256 verified.',
    ipAddress: '115.112.89.204'
  },
  {
    id: 'LOG-8810',
    timestamp: '2026-09-29 16:15:02',
    user: 'CA Sneha Mehta',
    userRole: 'Senior Audit Manager',
    action: 'Permissions Modified for USR-STF-202',
    category: 'Permission',
    status: 'Success',
    details: 'Added edit permission to GST Reconciliations folder under Project PRJ-MUM-02.',
    ipAddress: '157.34.192.14'
  },
  {
    id: 'LOG-8809',
    timestamp: '2026-09-29 14:45:18',
    user: 'CA Krishna Panjiyar',
    userRole: 'Super Admin',
    action: 'Staff Invitation Generated (Priya Nambiar)',
    category: 'User',
    status: 'Success',
    details: 'Token dispatch sent to priya.n@panjiyarca.in with 7-day expiration policy.',
    ipAddress: '157.34.192.11'
  },
  {
    id: 'LOG-8808',
    timestamp: '2026-09-28 11:20:00',
    user: 'System Guardian',
    userRole: 'Automated Daemon',
    action: 'Account State Transition: USR-CL-105 marked Inactive',
    category: 'User',
    status: 'Success',
    details: 'Sunburst Retail engagement closure finalized; vault locked to read-only compliance state.',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'LOG-8807',
    timestamp: '2026-09-28 09:14:32',
    user: 'Unknown Session',
    userRole: 'Guest',
    action: 'Failed Portal Login Attempt',
    category: 'Security',
    status: 'Denied',
    details: 'Invalid passphrase for user "vertex.vikram". Account locked pending admin password reset.',
    ipAddress: '49.36.128.77'
  }
];

export const INITIAL_SECURITY_CONFIG: VaultSecurityConfig = {
  sessionTimeoutMinutes: 30,
  maxFailedLoginsBeforeLock: 5,
  enforceTwoFactor: true,
  enforcePasswordComplexity: true,
  passwordExpiryDays: 90,
  ipWhitelistEnabled: false,
  notifyOnNewLogin: true
};
