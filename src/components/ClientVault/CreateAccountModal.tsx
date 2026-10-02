import React, { useState } from 'react';
import {
  X,
  Key,
  Copy,
  Check,
  Send,
  Shield,
  Building,
  Mail,
  Phone,
  User as UserIcon,
  Briefcase,
  FileText,
  Save,
  CheckCircle2,
  Lock,
  RotateCcw
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import {
  VaultAccountType,
  VaultAccountStatus,
  VaultSectionName,
  UserPermissions
} from '../../types/vault';

interface CreateAccountModalProps {
  isOpen?: boolean;
  onClose: () => void;
  accountType?: VaultAccountType;
  defaultAccountType?: VaultAccountType;
  onSuccessToast: (msg: string) => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen = true,
  onClose,
  accountType: initialType,
  defaultAccountType = 'client',
  onSuccessToast
}) => {
  const { createUser, projects, roleTemplates, generateSecurePassword, sendInvitation } = useVault();

  const [accountType, setAccountType] = useState<VaultAccountType>(initialType || defaultAccountType);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(
    defaultAccountType === 'staff' ? 'Senior Audit Associate' : defaultAccountType === 'super_admin' ? 'Super Administrator' : 'Managing Director'
  );
  const [status, setStatus] = useState<VaultAccountStatus>('Active');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [sendInviteChecked, setSendInviteChecked] = useState(true);

  // Password state
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword();
    setPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);
    setPasswordCopied(false);
  };

  const handleCopyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim() || !username.trim()) {
      setFormError('Please fill in Full Name, Email, and Username.');
      return;
    }

    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify.');
      return;
    }

    const assignedTemplate =
      roleTemplates.find((t) => t.accountType === accountType) || roleTemplates[0];

    const finalPermissions: UserPermissions = assignedTemplate?.permissions || {};
    const finalSections: VaultSectionName[] = assignedTemplate?.sectionAccess || ['Dashboard', 'Documents'];

    const newUser = createUser({
      fullName: fullName.trim(),
      company: company.trim() || 'Panjiyar Client',
      email: email.trim(),
      phone: phone.trim() || '+91 6000310815',
      username: username.trim(),
      accountType,
      role: role.trim() || (accountType === 'client' ? 'Authorized Client' : 'Staff Auditor'),
      status,
      assignedProjects: selectedProjectId ? [selectedProjectId] : [],
      notes: notes.trim(),
      profilePhoto: profilePhoto.trim() || undefined,
      forcePasswordChange: true,
      loginDisabled: status === 'Suspended' || status === 'Inactive',
      twoFactorEnabled: accountType === 'super_admin' || accountType === 'staff',
      permissions: finalPermissions,
      sectionAccess: finalSections
    });

    if (sendInviteChecked) {
      sendInvitation({
        recipientName: fullName.trim(),
        recipientEmail: email.trim(),
        company: company.trim() || 'Client Vault Access',
        accountType,
        role: role.trim(),
        assignedProject: selectedProjectId || undefined
      });
    }

    onSuccessToast(`✓ Changes saved successfully: Account created for ${newUser.fullName} (${newUser.id})`);
    onClose();
  };

  const handleResetForm = () => {
    setFullName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setNotes('');
    setFormError(null);
    onSuccessToast('Form reset.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 text-left my-6 animate-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#062A5A] text-white flex items-center justify-center shadow-xs">
              <Shield size={20} className="text-[#F28C18]" />
            </div>
            <div>
              <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
                Create Vault Account
              </h2>
              <p className="text-xs text-slate-500">
                Generate secure credentials and configure access permissions for clients or staff.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-5 text-xs pr-1">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <X size={14} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Account Type Selector */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              1. Select Account Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { type: 'client', label: 'Client', badge: 'Private Vault', desc: 'Client documents & projects' },
                  { type: 'staff', label: 'Admin Staff', badge: 'Delegated', desc: 'Audit & tax workflows' },
                  { type: 'super_admin', label: 'Super Admin', badge: 'Full Root', desc: 'Unrestricted master access' },
                  { type: 'custom', label: 'Custom Role', badge: 'Granular', desc: 'Custom tailored permissions' }
                ] as const
              ).map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setAccountType(item.type);
                    if (item.type === 'staff') setRole('Senior Audit Associate');
                    else if (item.type === 'super_admin') setRole('Super Administrator');
                    else setRole('Managing Director');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    accountType === item.type
                      ? 'bg-[#EEF5FC] border-[#0969C7] text-[#062A5A] ring-2 ring-[#0969C7]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{item.label}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* General Information */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              2. User &amp; Organization Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Singhal"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!username && e.target.value) {
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '.'));
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Organization *</label>
                <div className="relative">
                  <Building size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Precision Engineering Ltd"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Email Address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rajesh@apexprecision.co.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. +91 9821034455"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Portal Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. apex.singhal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Designation / Role Title</label>
                <div className="relative">
                  <Briefcase size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Managing Director / Partner"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credentials & Password Assignment */}
          <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#D9E2EC] space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Key size={14} className="text-[#0969C7]" />
                <span>3. Credential &amp; Password Assignment</span>
              </label>

              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-[#062A5A] font-semibold text-[11px] rounded-lg border border-slate-300 flex items-center gap-1 shadow-2xs transition-colors"
              >
                <Key size={12} className="text-[#F28C18]" />
                <span>Generate Secure Password</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Temporary Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter or generate password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-[#0969C7] bg-white pr-20"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    {password && (
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="p-1 text-slate-400 hover:text-[#0969C7] rounded"
                        title="Copy password"
                      >
                        {passwordCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 font-mono px-1 py-0.5"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-[#0969C7] bg-white"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Lock size={12} className="text-emerald-600 shrink-0" />
              <span>
                Passwords are never stored in plain text. Force password change on first login will be enforced.
              </span>
            </div>
          </div>

          {/* Project & Access Assignment */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              4. Project &amp; Account Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assign Primary Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs"
                >
                  <option value="">No Project Assigned (General Vault)</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title} ({proj.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Initial Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VaultAccountStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs font-semibold"
                >
                  <option value="Active">Active (Immediate Login Enabled)</option>
                  <option value="Pending">Pending (Awaiting First Setup)</option>
                  <option value="Inactive">Inactive (Disabled)</option>
                  <option value="Suspended">Suspended (Access Revoked)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
              <FileText size={13} className="text-slate-400" />
              <span>Administrative Notes (Private to Admin)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Authorized signatory for direct tax appeals and quarterly filings..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white text-xs"
            />
          </div>

          {/* Automatic Invitation Option */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <input
                id="send-invite-check"
                type="checkbox"
                checked={sendInviteChecked}
                onChange={(e) => setSendInviteChecked(e.target.checked)}
                className="w-4 h-4 text-[#0969C7] rounded focus:ring-[#0969C7]"
              />
              <label htmlFor="send-invite-check" className="cursor-pointer">
                <span className="font-semibold text-emerald-950 block text-xs">
                  Send Instant Portal Setup Invitation
                </span>
                <span className="text-[11px] text-emerald-700">
                  Sends email with unique 7-day secure token, setup instructions, and portal URL.
                </span>
              </label>
            </div>
            <Send size={16} className="text-emerald-600 shrink-0 hidden sm:block" />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <Save size={15} className="text-[#F28C18]" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
