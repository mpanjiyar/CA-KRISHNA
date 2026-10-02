/**
 * Client Vault API Bridge
 * Communicates with server-side authentication and role-based access control endpoints.
 */

export interface VaultApiUser {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  username: string;
  accountType: 'super_admin' | 'staff' | 'client';
  role: string;
  status: 'Active' | 'Pending' | 'Suspended';
  assignedProjects: string[];
  assignedClientIds: string[];
  notes?: string;
  createdAt: string;
  lastLogin: string;
  forcePasswordChange: boolean;
  loginDisabled: boolean;
  twoFactorEnabled: boolean;
  permissions?: Record<string, any>;
  sectionAccess?: string[];
  activeSessionsCount?: number;
}

export interface VaultApiSession {
  token: string;
  userId: string;
  username: string;
  accountType: 'super_admin' | 'staff' | 'client';
  role: string;
  fullName: string;
  company: string;
  email: string;
  device: string;
  loginTime: string;
  lastActivityTime: number;
  expiresAt: number;
  twoFactorVerified: boolean;
}

export interface VaultDataResponse {
  role: 'super_admin' | 'staff' | 'client';
  documents: any[];
  projects: any[];
  users: VaultApiUser[];
  auditLogs: any[];
}

export class VaultApiClient {
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const sessionRaw = localStorage.getItem('panjiyar_vault_session_v3');
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        return parsed.token || null;
      }
    } catch {}
    return null;
  }

  private static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // 1. Login
  static async login(username: string, password: string): Promise<{
    success: boolean;
    error?: string;
    token?: string;
    session?: VaultApiSession;
    user?: VaultApiUser;
    require2FA?: boolean;
    tempToken?: string;
    sampleCode?: string;
  }> {
    try {
      const res = await fetch('/api/vault/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: 'Network error communicating with Vault security gateway.' };
    }
  }

  // 2. Verify 2FA
  static async verify2FA(tempToken: string, code: string): Promise<{
    success: boolean;
    error?: string;
    token?: string;
    session?: VaultApiSession;
    user?: VaultApiUser;
  }> {
    try {
      const res = await fetch('/api/vault/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code })
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error verifying 2FA security code.' };
    }
  }

  // 3. Get Active Session
  static async getSession(): Promise<{
    success: boolean;
    session?: VaultApiSession;
    user?: VaultApiUser;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/vault/auth/session', {
        headers: this.getHeaders()
      });
      if (res.status === 401) {
        return { success: false, error: 'Session expired' };
      }
      return await res.json();
    } catch {
      return { success: false, error: 'Network error' };
    }
  }

  // 4. Logout
  static async logout(): Promise<void> {
    try {
      await fetch('/api/vault/auth/logout', {
        method: 'POST',
        headers: this.getHeaders()
      });
    } catch {}
  }

  // 5. Change Password
  static async changePassword(oldPassword: string, newPassword: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/vault/auth/change-password', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ oldPassword, newPassword })
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Failed to update password.' };
    }
  }

  // 6. Reset Password Request
  static async resetPassword(usernameOrEmail: string): Promise<{
    success: boolean;
    message: string;
    tempPass?: string;
  }> {
    try {
      const res = await fetch('/api/vault/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail })
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Failed to request reset.' };
    }
  }

  // 7. Get Vault Data (Gated strictly by token and role)
  static async getVaultData(): Promise<{
    success: boolean;
    data?: VaultDataResponse;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/vault/data', {
        headers: this.getHeaders()
      });
      if (res.status === 401) {
        return { success: false, error: 'Unauthorized: Please log in.' };
      }
      const json = await res.json();
      if (json.success) {
        return {
          success: true,
          data: {
            role: json.role,
            documents: json.documents || [],
            projects: json.projects || [],
            users: json.users || [],
            auditLogs: json.auditLogs || []
          }
        };
      }
      return { success: false, error: json.error || 'Failed to fetch vault data.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error fetching vault data.' };
    }
  }

  // 8. Upload Document
  static async uploadDocument(doc: {
    title: string;
    clientName?: string;
    category?: string;
    fileSize?: string;
    sha256Hash?: string;
  }): Promise<{ success: boolean; document?: any; error?: string }> {
    try {
      const res = await fetch('/api/vault/documents', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(doc)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Failed to upload document.' };
    }
  }

  // 9. Admin Create User
  static async createUser(userData: any): Promise<{ success: boolean; user?: VaultApiUser; error?: string }> {
    try {
      const res = await fetch('/api/vault/users', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Failed to create user.' };
    }
  }

  // 10. Admin Update User
  static async updateUser(userId: string, partial: any): Promise<{ success: boolean; user?: VaultApiUser; error?: string }> {
    try {
      const res = await fetch(`/api/vault/users/${userId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(partial)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Failed to update user.' };
    }
  }

  // 11. Admin Delete User
  static async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/vault/users/${userId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Failed to delete user.' };
    }
  }

  // 12. Admin Reset Password
  static async adminResetPassword(userId: string): Promise<{ success: boolean; tempKey?: string; message?: string; error?: string }> {
    try {
      const res = await fetch(`/api/vault/users/${userId}/reset-password`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Failed to reset password.' };
    }
  }

  // 13. Admin Toggle Login Disabled
  static async toggleLoginDisabled(userId: string): Promise<{ success: boolean; loginDisabled?: boolean; user?: VaultApiUser; error?: string }> {
    try {
      const res = await fetch(`/api/vault/users/${userId}/toggle-disabled`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Failed to toggle login status.' };
    }
  }

  // 14. Admin Audit Logs
  static async getAuditLogs(): Promise<{ success: boolean; logs?: any[]; error?: string }> {
    try {
      const res = await fetch('/api/vault/audit-logs', {
        headers: this.getHeaders()
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Failed to fetch audit logs.' };
    }
  }
}
