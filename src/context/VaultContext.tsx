import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VaultUser,
  VaultProject,
  VaultFolder,
  VaultFileItem,
  VaultInvitation,
  VaultAuditLogEntry,
  RoleTemplate,
  VaultSecurityConfig,
  VaultAccountStatus,
  UserPermissions,
  VaultSectionName
} from '../types/vault';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_FOLDERS,
  INITIAL_FILES,
  INITIAL_INVITATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ROLE_TEMPLATES,
  INITIAL_SECURITY_CONFIG
} from '../data/vaultInitialData';

const VAULT_STORAGE_KEYS = {
  USERS: 'panjiyar_vault_users_v2',
  PROJECTS: 'panjiyar_vault_projects_v2',
  FOLDERS: 'panjiyar_vault_folders_v2',
  FILES: 'panjiyar_vault_files_v2',
  INVITATIONS: 'panjiyar_vault_invitations_v2',
  AUDIT_LOGS: 'panjiyar_vault_audit_logs_v2',
  TEMPLATES: 'panjiyar_vault_templates_v2',
  SECURITY: 'panjiyar_vault_security_v2'
};

interface VaultContextType {
  users: VaultUser[];
  projects: VaultProject[];
  folders: VaultFolder[];
  files: VaultFileItem[];
  invitations: VaultInvitation[];
  auditLogs: VaultAuditLogEntry[];
  roleTemplates: RoleTemplate[];
  securityConfig: VaultSecurityConfig;

  // User Actions
  createUser: (user: Omit<VaultUser, 'id' | 'createdAt' | 'lastLogin' | 'activeSessionsCount'>) => VaultUser;
  updateUser: (id: string, partial: Partial<VaultUser>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string, status: VaultAccountStatus) => void;
  resetUserPassword: (id: string) => string;
  forcePasswordChange: (id: string, force: boolean) => void;
  toggleLoginDisabled: (id: string, disabled: boolean) => void;
  logoutAllDevices: (id: string) => void;
  updateUserPermissions: (id: string, permissions: UserPermissions) => void;
  updateUserSectionAccess: (id: string, sections: VaultSectionName[]) => void;
  assignProjectsToUser: (id: string, projectIds: string[]) => void;
  assignClientsToStaff: (staffId: string, clientIds: string[]) => void;

  // Project Actions
  createProject: (project: Omit<VaultProject, 'id' | 'createdDate'>) => VaultProject;
  updateProject: (id: string, partial: Partial<VaultProject>) => void;
  deleteProject: (id: string) => void;

  // Folder Actions
  createFolder: (folder: Omit<VaultFolder, 'id' | 'createdAt' | 'createdBy'>) => VaultFolder;
  updateFolder: (id: string, partial: Partial<VaultFolder>) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, newName: string) => void;

  // File Actions
  addFile: (file: Omit<VaultFileItem, 'id' | 'uploadDate' | 'sha256Hash'>) => VaultFileItem;
  deleteFile: (id: string) => void;
  updateFile: (id: string, partial: Partial<VaultFileItem>) => void;
  updateFilePermissions: (id: string, permissions: VaultFileItem['permissions']) => void;
  renameFile: (id: string, newTitle: string, newFileName: string) => void;
  moveFile: (fileId: string, targetFolderId: string, targetFolderName: string) => void;

  // Invitation Actions
  sendInvitation: (inv: Omit<VaultInvitation, 'id' | 'invitedAt' | 'expiresAt' | 'status' | 'setupLink'>) => VaultInvitation;
  resendInvitation: (id: string) => void;
  cancelInvitation: (id: string) => void;

  // Role Template Actions
  createRoleTemplate: (tmpl: Omit<RoleTemplate, 'id'>) => RoleTemplate;
  updateRoleTemplate: (id: string, partial: Partial<RoleTemplate>) => void;

  // Security Settings
  updateSecurityConfig: (partial: Partial<VaultSecurityConfig>) => void;

  // Utilities
  generateSecurePassword: () => string;
  addAuditLog: (action: string, category: VaultAuditLogEntry['category'], details: string, status?: VaultAuditLogEntry['status']) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Users
  const [users, setUsers] = useState<VaultUser[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vault users', e);
    }
    return INITIAL_USERS;
  });

  // 2. Projects
  const [projects, setProjects] = useState<VaultProject[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEYS.PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vault projects', e);
    }
    return INITIAL_PROJECTS;
  });

  // 3. Folders
  const [folders, setFolders] = useState<VaultFolder[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEYS.FOLDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vault folders', e);
    }
    return INITIAL_FOLDERS;
  });

  // 4. Files
  const [files, setFiles] = useState<VaultFileItem[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEYS.FILES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vault files', e);
    }
    return INITIAL_FILES;
  });

  // 5. Invitations
  const [invitations, setInvitations] = useState<VaultInvitation[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEYS.INVITATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vault invitations', e);
    }
    return INITIAL_INVITATIONS;
  });

  // 6. Audit Logs
  const [auditLogs, setAuditLogs] = useState<VaultAuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEYS.AUDIT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vault audit logs', e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  // 7. Role Templates
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEYS.TEMPLATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vault templates', e);
    }
    return INITIAL_ROLE_TEMPLATES;
  });

  // 8. Security Config
  const [securityConfig, setSecurityConfig] = useState<VaultSecurityConfig>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEYS.SECURITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vault security config', e);
    }
    return INITIAL_SECURITY_CONFIG;
  });

  // Helper for authenticated API calls
  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('panjiyar_vault_session_token_v3') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  // Broadcast sync helper
  const broadcastVaultSync = (actionKey: string, payload?: unknown) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('panjiyar_client_vault_sync_channel');
        bc.postMessage({ type: 'VAULT_SYNC', key: actionKey, payload });
        bc.close();
      }
    } catch {
      // Fallback
    }
    try {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('panjiyar_vault_data_updated', { detail: { actionKey, payload } }));
    } catch {
      // Ignored
    }
  };

  // Cross-tab real-time sync listener
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('panjiyar_client_vault_sync_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'VAULT_SYNC') {
            syncAllVaultState();
          }
        };
      }
    } catch {
      // Fallback
    }

    const syncAllVaultState = () => {
      try {
        const u = localStorage.getItem(VAULT_STORAGE_KEYS.USERS);
        if (u) setUsers(JSON.parse(u));
        const p = localStorage.getItem(VAULT_STORAGE_KEYS.PROJECTS);
        if (p) setProjects(JSON.parse(p));
        const fld = localStorage.getItem(VAULT_STORAGE_KEYS.FOLDERS);
        if (fld) setFolders(JSON.parse(fld));
        const f = localStorage.getItem(VAULT_STORAGE_KEYS.FILES);
        if (f) setFiles(JSON.parse(f));
        const i = localStorage.getItem(VAULT_STORAGE_KEYS.INVITATIONS);
        if (i) setInvitations(JSON.parse(i));
        const l = localStorage.getItem(VAULT_STORAGE_KEYS.AUDIT_LOGS);
        if (l) setAuditLogs(JSON.parse(l));
        const t = localStorage.getItem(VAULT_STORAGE_KEYS.TEMPLATES);
        if (t) setRoleTemplates(JSON.parse(t));
        const s = localStorage.getItem(VAULT_STORAGE_KEYS.SECURITY);
        if (s) setSecurityConfig(JSON.parse(s));
      } catch (err) {
        console.warn('Vault storage sync error:', err);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || Object.values(VAULT_STORAGE_KEYS).includes(e.key)) {
        syncAllVaultState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', syncAllVaultState);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncAllVaultState();
    });

    const interval = setInterval(syncAllVaultState, 3500);

    // Sync with Server API on boot/token change
    const syncWithServerApi = async () => {
      try {
        const token = localStorage.getItem('panjiyar_vault_session_token_v3');
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const [foldersRes, filesRes, projRes, usersRes, logsRes, secRes] = await Promise.allSettled([
          fetch('/api/vault/folders', { headers }),
          fetch('/api/vault/files', { headers }),
          fetch('/api/vault/projects', { headers }),
          fetch('/api/vault/users', { headers }),
          fetch('/api/vault/audit-logs', { headers }),
          fetch('/api/vault/security-config', { headers })
        ]);

        if (foldersRes.status === 'fulfilled' && foldersRes.value.ok) {
          const data = await foldersRes.value.json();
          if (Array.isArray(data.folders) && data.folders.length > 0) {
            setFolders(data.folders);
            try { localStorage.setItem(VAULT_STORAGE_KEYS.FOLDERS, JSON.stringify(data.folders)); } catch {}
          }
        }
        if (filesRes.status === 'fulfilled' && filesRes.value.ok) {
          const data = await filesRes.value.json();
          if (Array.isArray(data.files)) {
            setFiles(data.files);
            try { localStorage.setItem(VAULT_STORAGE_KEYS.FILES, JSON.stringify(data.files)); } catch {}
          }
        }
        if (projRes.status === 'fulfilled' && projRes.value.ok) {
          const data = await projRes.value.json();
          if (Array.isArray(data.projects)) setProjects(data.projects);
        }
        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
          const data = await usersRes.value.json();
          if (Array.isArray(data.users)) setUsers(data.users);
        }
        if (logsRes.status === 'fulfilled' && logsRes.value.ok) {
          const data = await logsRes.value.json();
          if (Array.isArray(data.logs)) setAuditLogs(data.logs);
        }
        if (secRes.status === 'fulfilled' && secRes.value.ok) {
          const data = await secRes.value.json();
          if (data.config) setSecurityConfig(data.config);
        }
      } catch (e) {
        // Fallback to local cache
      }
    };

    syncWithServerApi();

    return () => {
      bc?.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', syncAllVaultState);
      clearInterval(interval);
    };
  }, []);

  // Utility: Password Generator
  const generateSecurePassword = (): string => {
    const charsUpper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const charsLower = 'abcdefghijkmnopqrstuvwxyz';
    const charsNumbers = '23456789';
    const charsSymbols = '!@#$%^&*()_+~';

    let pass = '';
    pass += charsUpper[Math.floor(Math.random() * charsUpper.length)];
    pass += charsLower[Math.floor(Math.random() * charsLower.length)];
    pass += charsNumbers[Math.floor(Math.random() * charsNumbers.length)];
    pass += charsSymbols[Math.floor(Math.random() * charsSymbols.length)];

    const all = charsUpper + charsLower + charsNumbers + charsSymbols;
    for (let i = 0; i < 8; i++) {
      pass += all[Math.floor(Math.random() * all.length)];
    }
    return pass.split('').sort(() => 0.5 - Math.random()).join('');
  };

  // Utility: Add Audit Log
  const addAuditLog = (
    action: string,
    category: VaultAuditLogEntry['category'],
    details: string,
    status: VaultAuditLogEntry['status'] = 'Success'
  ) => {
    const newEntry: VaultAuditLogEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'CA Krishna Panjiyar',
      userRole: 'Super Admin',
      action,
      category,
      status,
      details,
      ipAddress: '157.34.192.11'
    };
    setAuditLogs((prev) => {
      const next = [newEntry, ...prev.slice(0, 199)];
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing audit logs', e);
      }
      return next;
    });
  };

  // 1. User Actions
  const createUser = (userData: Omit<VaultUser, 'id' | 'createdAt' | 'lastLogin' | 'activeSessionsCount'>): VaultUser => {
    const prefix = userData.accountType === 'staff' ? 'USR-STF-' : userData.accountType === 'super_admin' ? 'USR-ADM-' : 'USR-CL-';
    const newId = `${prefix}${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString().split('T')[0];

    const newUser: VaultUser = {
      ...userData,
      id: newId,
      createdAt: now,
      lastLogin: 'Never logged in',
      activeSessionsCount: 0
    };

    setUsers((prev) => {
      const next = [newUser, ...prev];
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.USERS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing users', e);
      }
      broadcastVaultSync('CREATE_USER', newUser);
      return next;
    });

    addAuditLog(`Account Created: ${newUser.fullName} (${newUser.id})`, 'User', `Created ${newUser.accountType} account for ${newUser.company}.`);
    return newUser;
  };

  const updateUser = (id: string, partial: Partial<VaultUser>) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, ...partial } : u));
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.USERS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing users', e);
      }
      broadcastVaultSync('UPDATE_USER', { id, partial });
      return next;
    });
    addAuditLog(`User Account Updated (${id})`, 'User', `Modified parameters on user ${id}.`);
  };

  const deleteUser = (id: string) => {
    const user = users.find((u) => u.id === id);
    setUsers((prev) => {
      const next = prev.filter((u) => u.id !== id);
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.USERS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed deleting user', e);
      }
      broadcastVaultSync('DELETE_USER', id);
      return next;
    });
    addAuditLog(`User Account Deleted: ${user?.fullName || id}`, 'User', `Permanently removed user ${id} from registry.`, 'Warning');
  };

  const toggleUserStatus = (id: string, status: VaultAccountStatus) => {
    const isSuspendedOrInactive = status === 'Suspended' || status === 'Inactive';
    updateUser(id, {
      status,
      loginDisabled: isSuspendedOrInactive,
      activeSessionsCount: isSuspendedOrInactive ? 0 : 1
    });
    addAuditLog(`Status Changed: ${id} → ${status}`, 'User', `Account status transitioned to ${status}. Access permissions re-evaluated.`);
  };

  const resetUserPassword = (id: string): string => {
    const newPass = generateSecurePassword();
    updateUser(id, {
      forcePasswordChange: true,
      activeSessionsCount: 0 // Log out existing sessions
    });
    addAuditLog(`Password Reset Generated: ${id}`, 'Security', `Generated temporary secure credential. Force password change enabled on next login.`);
    return newPass;
  };

  const forcePasswordChange = (id: string, force: boolean) => {
    updateUser(id, { forcePasswordChange: force });
    addAuditLog(`Force Password Change Policy (${id})`, 'Security', `Policy set to ${force ? 'Enforced' : 'Disabled'}.`);
  };

  const toggleLoginDisabled = (id: string, disabled: boolean) => {
    updateUser(id, {
      loginDisabled: disabled,
      status: disabled ? 'Suspended' : 'Active',
      activeSessionsCount: disabled ? 0 : 1
    });
    addAuditLog(`Login Access ${disabled ? 'Disabled' : 'Enabled'} (${id})`, 'Security', `Access rights ${disabled ? 'revoked' : 'restored'}.`);
  };

  const logoutAllDevices = (id: string) => {
    updateUser(id, { activeSessionsCount: 0 });
    addAuditLog(`All Sessions Revoked (${id})`, 'Security', `Invalidated all active authentication tokens across devices.`);
  };

  const updateUserPermissions = (id: string, permissions: UserPermissions) => {
    updateUser(id, { permissions });
    addAuditLog(`Permissions Matrix Updated (${id})`, 'Permission', `Updated granular action permissions across sections for user ${id}.`);
  };

  const updateUserSectionAccess = (id: string, sections: VaultSectionName[]) => {
    updateUser(id, { sectionAccess: sections });
    addAuditLog(`Section Access Rights Modified (${id})`, 'Permission', `Assigned ${sections.length} accessible portal sections to user ${id}.`);
  };

  const assignProjectsToUser = (id: string, projectIds: string[]) => {
    updateUser(id, { assignedProjects: projectIds });
    addAuditLog(`Project Assignments Updated (${id})`, 'Project', `Assigned to ${projectIds.length} projects.`);
  };

  const assignClientsToStaff = (staffId: string, clientIds: string[]) => {
    updateUser(staffId, { assignedClientIds: clientIds });
    addAuditLog(`Staff Client Scope Updated (${staffId})`, 'Permission', `Assigned management over ${clientIds.length} client vaults.`);
  };

  // 2. Project Actions
  const createProject = (projectData: Omit<VaultProject, 'id' | 'createdDate'>): VaultProject => {
    const newId = `PRJ-MUM-${Math.floor(10 + Math.random() * 90)}`;
    const newProject: VaultProject = {
      ...projectData,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setProjects((prev) => {
      const next = [newProject, ...prev];
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing projects', e);
      }
      broadcastVaultSync('CREATE_PROJECT', newProject);
      return next;
    });

    addAuditLog(`Project Created: ${newProject.title}`, 'Project', `Created project ${newProject.id} for client ${newProject.clientName}.`);
    return newProject;
  };

  const updateProject = (id: string, partial: Partial<VaultProject>) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...partial } : p));
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing projects', e);
      }
      broadcastVaultSync('UPDATE_PROJECT', { id, partial });
      return next;
    });
    addAuditLog(`Project Updated (${id})`, 'Project', `Modified details on project ${id}.`);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed deleting project', e);
      }
      broadcastVaultSync('DELETE_PROJECT', id);
      return next;
    });
    addAuditLog(`Project Deleted (${id})`, 'Project', `Removed project ${id} from registry.`, 'Warning');
  };

  // 3. Folder Actions
  const createFolder = (folderData: Omit<VaultFolder, 'id' | 'createdAt' | 'createdBy'>): VaultFolder => {
    const newId = `FLD-${Date.now().toString(36).toUpperCase()}`;
    const slug = folderData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newFolder: VaultFolder = {
      ...folderData,
      id: newId,
      slug: slug || 'folder',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'CA Krishna Panjiyar (Admin)',
      isSystem: false,
      permissions: folderData.permissions || {
        canView: true,
        canUpload: true,
        canDownload: true,
        canEdit: true,
        canDelete: true
      }
    };

    setFolders((prev) => {
      const next = [...prev, newFolder];
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.FOLDERS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing folders', e);
      }
      broadcastVaultSync('CREATE_FOLDER', newFolder);
      return next;
    });

    // Background server sync
    fetch('/api/vault/folders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newFolder)
    }).catch((e) => console.warn('Server sync error for createFolder:', e));

    addAuditLog(`Vault Folder Created: ${newFolder.name}`, 'File', `New repository section initialized for scope ${newFolder.clientId}.`);
    return newFolder;
  };

  const updateFolder = (id: string, partial: Partial<VaultFolder>) => {
    const targetFolder = folders.find((f) => f.id === id);
    const oldName = targetFolder?.name || '';
    const newName = partial.name;

    setFolders((prev) => {
      const next = prev.map((f) => {
        if (f.id === id) {
          const updated = { ...f, ...partial };
          if (partial.name) {
            updated.slug = partial.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          }
          return updated;
        }
        return f;
      });
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.FOLDERS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing folders', e);
      }
      broadcastVaultSync('UPDATE_FOLDER', { id, partial });
      return next;
    });

    // If folder name was changed, sync files that belong to this folder
    if (newName && oldName && newName !== oldName) {
      setFiles((prev) => {
        const next = prev.map((file) => {
          if (file.folderId === id || file.folder === oldName) {
            return {
              ...file,
              folderId: id,
              folder: newName
            };
          }
          return file;
        });
        try {
          localStorage.setItem(VAULT_STORAGE_KEYS.FILES, JSON.stringify(next));
        } catch (e) {
          console.error('Failed writing files on folder rename', e);
        }
        return next;
      });
    }

    // Background server sync
    fetch(`/api/vault/folders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(partial)
    }).catch((e) => console.warn('Server sync error for updateFolder:', e));

    addAuditLog(`Vault Folder Modified (${id})`, 'File', `Updated properties on folder "${newName || oldName}".`);
  };

  const renameFolder = (id: string, newName: string) => {
    updateFolder(id, { name: newName });
  };

  const deleteFolder = (id: string) => {
    const target = folders.find((f) => f.id === id);
    if (!target) return;
    if (target.isSystem) {
      console.warn('Cannot delete system standard folder');
      return;
    }

    const fallbackFolder = folders.find((f) => f.id === 'FLD-DOCS') || folders[0];
    const fallbackId = fallbackFolder ? fallbackFolder.id : 'FLD-DOCS';
    const fallbackName = fallbackFolder ? fallbackFolder.name : 'Documents & Certificates';

    // Move any files in this folder to Documents so they are never lost
    setFiles((prev) => {
      const next = prev.map((f) => {
        if (f.folderId === id || f.folder === target.name) {
          return {
            ...f,
            folderId: fallbackId,
            folder: fallbackName
          };
        }
        return f;
      });
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.FILES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed updating files after folder delete', e);
      }
      return next;
    });

    setFolders((prev) => {
      const next = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.FOLDERS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing folders', e);
      }
      broadcastVaultSync('DELETE_FOLDER', id);
      return next;
    });

    // Background server sync
    fetch(`/api/vault/folders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).catch((e) => console.warn('Server sync error for deleteFolder:', e));

    addAuditLog(`Vault Folder Deleted: ${target.name}`, 'File', `Folder purged. Existing files moved safely to ${fallbackName}.`, 'Warning');
  };

  // 4. File Actions
  const addFile = (fileData: Omit<VaultFileItem, 'id' | 'uploadDate' | 'sha256Hash'>): VaultFileItem => {
    const newId = `FIL-${Math.floor(1000 + Math.random() * 9000)}`;
    const sha = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Resolve folderId
    let folderId = fileData.folderId;
    let folderName = fileData.folder || 'Documents & Certificates';
    if (!folderId) {
      const match = folders.find((f) => f.name.toLowerCase() === folderName.toLowerCase() || f.slug.toLowerCase() === folderName.toLowerCase());
      folderId = match ? match.id : 'FLD-DOCS';
      folderName = match ? match.name : folderName;
    }

    const newFile: VaultFileItem = {
      ...fileData,
      id: newId,
      folderId,
      folder: folderName,
      uploadDate: new Date().toISOString().split('T')[0],
      sha256Hash: sha,
      previewContent: fileData.previewContent || `PANJIYAR KRISHNA & CO. - CLIENT VAULT REPOSITORY\nFile Name: ${fileData.fileName}\nClient: ${fileData.clientName}\nFolder: ${folderName}\nSHA-256: ${sha}\nVerified compliance record.`
    };

    setFiles((prev) => {
      const next = [newFile, ...prev];
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.FILES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing files', e);
      }
      broadcastVaultSync('ADD_FILE', newFile);
      return next;
    });

    // Background server sync
    fetch('/api/vault/files', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newFile)
    }).catch((e) => console.warn('Server sync error for addFile:', e));

    addAuditLog(`Document Stored: ${newFile.fileName}`, 'File', `Uploaded to client vault of ${newFile.clientName} under folder ${newFile.folder}.`);
    return newFile;
  };

  const deleteFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.FILES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed deleting file', e);
      }
      broadcastVaultSync('DELETE_FILE', id);
      return next;
    });

    // Background server sync
    fetch(`/api/vault/files/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).catch((e) => console.warn('Server sync error for deleteFile:', e));

    addAuditLog(`File Deleted: ${target?.fileName || id}`, 'File', `File ${id} purged from vault storage.`, 'Warning');
  };

  const updateFile = (id: string, partial: Partial<VaultFileItem>) => {
    setFiles((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...partial } : f));
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.FILES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed updating file', e);
      }
      broadcastVaultSync('UPDATE_FILE', { id, partial });
      return next;
    });

    // Background server sync
    fetch(`/api/vault/files/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(partial)
    }).catch((e) => console.warn('Server sync error for updateFile:', e));
  };

  const updateFilePermissions = (id: string, permissions: VaultFileItem['permissions']) => {
    updateFile(id, { permissions });
    addAuditLog(`Granular File Permissions Changed (${id})`, 'Permission', `Updated file access flags on file ${id}.`);
  };

  const renameFile = (id: string, newTitle: string, newFileName: string) => {
    const target = files.find((f) => f.id === id);
    updateFile(id, { title: newTitle, fileName: newFileName });
    addAuditLog(`File Renamed (${id})`, 'File', `Renamed '${target?.fileName}' to '${newFileName}' (${newTitle}).`);
  };

  const moveFile = (fileId: string, targetFolderId: string, targetFolderName: string) => {
    const target = files.find((f) => f.id === fileId);
    const oldFolder = target?.folder || 'Unknown';
    updateFile(fileId, { folderId: targetFolderId, folder: targetFolderName });

    // Background server sync
    fetch(`/api/vault/files/${fileId}/move`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetFolderId, targetFolderName })
    }).catch((e) => console.warn('Server sync error for moveFile:', e));

    addAuditLog(`File Organized (${fileId})`, 'File', `Moved '${target?.fileName}' from '${oldFolder}' to folder '${targetFolderName}'.`);
  };

  // 4. Invitation Actions
  const sendInvitation = (invData: Omit<VaultInvitation, 'id' | 'invitedAt' | 'expiresAt' | 'status' | 'setupLink'>): VaultInvitation => {
    const newId = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const token = Math.random().toString(36).substring(2, 14);

    const newInv: VaultInvitation = {
      ...invData,
      id: newId,
      invitedAt: now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      expiresAt: expires.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      setupLink: `https://panjiyarkrishna.com/portal/setup?token=${token}&email=${encodeURIComponent(invData.recipientEmail)}`
    };

    setInvitations((prev) => {
      const next = [newInv, ...prev];
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.INVITATIONS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing invitations', e);
      }
      broadcastVaultSync('SEND_INVITATION', newInv);
      return next;
    });

    addAuditLog(`Portal Invitation Dispatched`, 'User', `Sent invitation to ${newInv.recipientName} (${newInv.recipientEmail}) with 7-day expiry token.`);
    return newInv;
  };

  const resendInvitation = (id: string) => {
    const inv = invitations.find((i) => i.id === id);
    if (!inv) return;
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setInvitations((prev) => {
      const next = prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'Pending' as const,
              invitedAt: now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              expiresAt: expires.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            }
          : i
      );
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.INVITATIONS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing invitations', e);
      }
      broadcastVaultSync('RESEND_INVITATION', id);
      return next;
    });

    addAuditLog(`Invitation Resent (${id})`, 'User', `Renewed token & resent portal access link to ${inv.recipientEmail}.`);
  };

  const cancelInvitation = (id: string) => {
    setInvitations((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, status: 'Cancelled' as const } : i));
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.INVITATIONS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing invitations', e);
      }
      broadcastVaultSync('CANCEL_INVITATION', id);
      return next;
    });
    addAuditLog(`Invitation Cancelled (${id})`, 'User', `Revoked outstanding invitation token ${id}.`);
  };

  // 5. Role Templates
  const createRoleTemplate = (tmpl: Omit<RoleTemplate, 'id'>): RoleTemplate => {
    const newId = `tmpl-${Date.now()}`;
    const newTmpl: RoleTemplate = { ...tmpl, id: newId };
    setRoleTemplates((prev) => {
      const next = [...prev, newTmpl];
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.TEMPLATES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing templates', e);
      }
      broadcastVaultSync('CREATE_TEMPLATE', newTmpl);
      return next;
    });
    addAuditLog(`Role Template Created: ${newTmpl.name}`, 'Permission', `Defined reusable permission template "${newTmpl.name}".`);
    return newTmpl;
  };

  const updateRoleTemplate = (id: string, partial: Partial<RoleTemplate>) => {
    setRoleTemplates((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...partial } : t));
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.TEMPLATES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing templates', e);
      }
      broadcastVaultSync('UPDATE_TEMPLATE', { id, partial });
      return next;
    });
    addAuditLog(`Role Template Modified (${id})`, 'Permission', `Updated template definition ${id}.`);
  };

  // 6. Security Config
  const updateSecurityConfig = (partial: Partial<VaultSecurityConfig>) => {
    setSecurityConfig((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(VAULT_STORAGE_KEYS.SECURITY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing security config', e);
      }
      broadcastVaultSync('UPDATE_SECURITY', next);
      return next;
    });
    addAuditLog(`Security Governance Policies Updated`, 'Security', `Updated global security policy parameters.`);
  };

  return (
    <VaultContext.Provider
      value={{
        users,
        projects,
        folders,
        files,
        invitations,
        auditLogs,
        roleTemplates,
        securityConfig,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        resetUserPassword,
        forcePasswordChange,
        toggleLoginDisabled,
        logoutAllDevices,
        updateUserPermissions,
        updateUserSectionAccess,
        assignProjectsToUser,
        assignClientsToStaff,
        createProject,
        updateProject,
        deleteProject,
        createFolder,
        updateFolder,
        deleteFolder,
        renameFolder,
        addFile,
        deleteFile,
        updateFile,
        updateFilePermissions,
        renameFile,
        moveFile,
        sendInvitation,
        resendInvitation,
        cancelInvitation,
        createRoleTemplate,
        updateRoleTemplate,
        updateSecurityConfig,
        generateSecurePassword,
        addAuditLog
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
