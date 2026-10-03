import React, { useState } from 'react';
import {
  X,
  Shield,
  Building,
  Mail,
  Phone,
  User as UserIcon,
  Key,
  Lock,
  LogOut,
  Ban,
  CheckCircle2,
  Trash2,
  Sliders,
  Briefcase,
  Copy,
  Check,
  Smartphone,
  Calendar,
  AlertTriangle,
  Save
} from 'lucide-react';
import { VaultUser, VaultAccountStatus } from '../../types/vault';
import { useVault } from '../../context/VaultContext';

interface UserProfileDrawerProps {
  user: VaultUser | null;
  onClose: () => void;
  onOpenPermissions: (user: VaultUser) => void;
  onSuccessToast: (msg: string) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  user,
  onClose,
  onOpenPermissions,
  onSuccessToast
}) => {
  const {
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword,
    forcePasswordChange,
    toggleLoginDisabled,
    logoutAllDevices,
    projects
  } = useVault();

  const [generatedPass, setGeneratedPass] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!user) return null;

  const handleStartEdit = () => {
    setEditName(user.fullName);
    setEditCompany(user.company);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditRole(user.role);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateUser(user.id, {
      fullName: editName.trim() || user.fullName,
      company: editCompany.trim() || user.company,
      email: editEmail.trim() || user.email,
      phone: editPhone.trim() || user.phone,
      role: editRole.trim() || user.role
    });
    setIsEditing(false);
    onSuccessToast(`✓ Changes saved successfully`);
  };

  const handleSaveAndContinue = () => {
    updateUser(user.id, {
      fullName: editName.trim() || user.fullName,
      company: editCompany.trim() || user.company,
      email: editEmail.trim() || user.email,
      phone: editPhone.trim() || user.phone,
      role: editRole.trim() || user.role
    });
    onSuccessToast(`✓ Changes saved successfully`);
  };

  const handleResetEdit = () => {
    setEditName(user.fullName);
    setEditCompany(user.company);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditRole(user.role);
    onSuccessToast('Reset changes to original state.');
  };

  const handleResetPassword = () => {
    const newPass = resetUserPassword(user.id);
    setGeneratedPass(newPass);
    onSuccessToast(`New temporary credentials generated for ${user.fullName}`);
  };

  const handleCopyPassword = () => {
    if (!generatedPass) return;
    navigator.clipboard.writeText(generatedPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const userProjects = projects.filter((p) => user.assignedProjects.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between text-left animate-in slide-in-from-right duration-200 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-[#F7F9FC]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#062A5A] px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
              {user.id}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                user.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : user.status === 'Pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {user.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* User Profile Banner */}
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#062A5A] to-[#0969C7] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-manrope font-bold text-base text-[#062A5A] truncate">
                {user.fullName}
              </h3>
              <p className="text-slate-600 font-medium truncate">{user.role}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 truncate">
                <Building size={12} className="shrink-0 text-slate-400" />
                <span className="truncate">{user.company}</span>
              </div>
            </div>
          </div>

          {/* Quick Edit or Display Fields */}
          {isEditing ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                Edit User Information
              </h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">Company</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">Role Title</label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetEdit}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndContinue}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-[#062A5A] font-semibold text-xs rounded-lg transition-colors"
                >
                  Save &amp; Continue
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Save size={13} className="text-[#F28C18]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="font-semibold text-slate-800">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Username</span>
                <span className="font-mono font-semibold text-[#0969C7]">{user.username}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account Type</span>
                <span className="font-semibold capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {user.accountType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Registered On</span>
                <span className="text-slate-700">{user.createdAt}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Last Authentication</span>
                <span className="text-slate-700 font-medium">{user.lastLogin}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Active Sessions</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Smartphone size={12} /> {user.activeSessionsCount} active
                </span>
              </div>
            </div>
          )}

          {/* Temporary Generated Password Banner if reset */}
          {generatedPass && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <Key size={13} className="text-[#F28C18]" />
                  <span>Temporary Password Generated</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="px-2.5 py-1 rounded bg-white hover:bg-amber-100 text-amber-900 font-semibold text-[11px] border border-amber-300 flex items-center gap-1"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2 rounded bg-white border border-amber-200 font-mono text-center text-sm font-bold text-[#062A5A] tracking-wider select-all">
                {generatedPass}
              </div>
              <p className="text-[10px] text-amber-800">
                Provide this credential securely to the user. They will be forced to set their own password immediately upon login.
              </p>
            </div>
          )}

          {/* Assigned Projects */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Assigned Projects ({userProjects.length})
            </h4>
            {userProjects.length > 0 ? (
              <div className="space-y-1.5">
                {userProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="font-semibold text-[#062A5A]">{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.id} &middot; Due {p.dueDate}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">No specific projects assigned.</p>
            )}
          </div>

          {/* Section-Level Access */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Accessible Portal Sections ({user.sectionAccess.length})
              </h4>
              <button
                onClick={() => onOpenPermissions(user)}
                className="text-[#0969C7] font-semibold text-[11px] hover:underline"
              >
                Modify Access
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.sectionAccess.map((sec) => (
                <span
                  key={sec}
                  className="px-2 py-0.5 rounded-md bg-[#EEF5FC] text-[#0969C7] font-medium text-[10.5px] border border-[#0969C7]/20"
                >
                  {sec}
                </span>
              ))}
            </div>
          </div>

          {/* Admin Control Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              Account Management Controls
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleStartEdit}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center transition-colors"
              >
                Edit Details
              </button>

              <button
                type="button"
                onClick={() => onOpenPermissions(user)}
                className="p-2.5 rounded-xl bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs text-center transition-colors flex items-center justify-center gap-1"
              >
                <Sliders size={13} className="text-[#0969C7]" />
                <span>Permissions Matrix</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetPassword}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#062A5A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Key size={14} className="text-[#F28C18]" />
              <span>Generate New Temporary Password</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  forcePasswordChange(user.id, !user.forcePasswordChange);
                  onSuccessToast(
                    `Force password change ${!user.forcePasswordChange ? 'enabled' : 'disabled'} for ${user.fullName}`
                  );
                }}
                className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-colors ${
                  user.forcePasswordChange
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {user.forcePasswordChange ? '✓ Force Change Active' : 'Force Pwd Change'}
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleLoginDisabled(user.id, !user.loginDisabled);
                  onSuccessToast(`Login access ${!user.loginDisabled ? 'disabled' : 'enabled'} for ${user.fullName}`);
                }}
                className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-colors ${
                  user.loginDisabled
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {user.loginDisabled ? 'Login Disabled' : 'Disable Login'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                logoutAllDevices(user.id);
                onSuccessToast(`Logged out all active device sessions for ${user.fullName}`);
              }}
              className="w-full py-2 px-3 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut size={13} />
              <span>Logout All Active Devices</span>
            </button>

            {/* Suspend or Delete */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const newStatus: VaultAccountStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
                  toggleUserStatus(user.id, newStatus);
                  onSuccessToast(`Account marked as ${newStatus}`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  user.status === 'Suspended'
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                {user.status === 'Suspended' ? 'Re-activate Account' : 'Suspend Access'}
              </button>

              {isConfirmingDelete ? (
                <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-lg border border-rose-200">
                  <span className="text-[11px] font-bold text-rose-700 px-1">Confirm delete?</span>
                  <button
                    type="button"
                    onClick={() => {
                      deleteUser(user.id);
                      onSuccessToast(`User ${user.fullName} removed.`);
                      onClose();
                    }}
                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10.5px] font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-[10.5px] font-semibold border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Delete Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
