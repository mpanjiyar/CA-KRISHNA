import React, { useState } from 'react';
import {
  Send,
  Mail,
  Copy,
  Check,
  RotateCcw,
  XCircle,
  Clock,
  Plus,
  Building,
  User,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultInvitation, VaultAccountType } from '../../types/vault';

interface VaultInvitationsViewProps {
  onSuccessToast: (msg: string) => void;
}

export const VaultInvitationsView: React.FC<VaultInvitationsViewProps> = ({ onSuccessToast }) => {
  const { invitations, sendInvitation, resendInvitation, cancelInvitation, projects } = useVault();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [company, setCompany] = useState('');
  const [accountType, setAccountType] = useState<VaultAccountType>('client');
  const [role, setRole] = useState('Director / Client Partner');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (inv: VaultInvitation) => {
    navigator.clipboard.writeText(inv.setupLink);
    setCopiedId(inv.id);
    onSuccessToast(`Setup link copied for ${inv.recipientName}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim()) return;

    sendInvitation({
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      company: company.trim() || 'Client Vault',
      accountType,
      role: role.trim(),
      assignedProject: selectedProjectId || undefined
    });

    onSuccessToast(`✓ Changes saved successfully: Invitation dispatched to ${recipientEmail}`);
    setIsModalOpen(false);
    setRecipientName('');
    setRecipientEmail('');
    setCompany('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-600" />
              <span>Cryptographic One-Time Invitation Links</span>
            </span>
          </div>
          <h2 className="font-manrope font-bold text-xl sm:text-2xl text-[#062A5A]">
            Portal Invitations &amp; Onboarding
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue cryptographically signed invitation tokens with automatic 7-day expiration for rapid, secure user onboarding.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
        >
          <Plus size={14} className="text-[#F28C18]" />
          <span>Dispatch New Invitation</span>
        </button>
      </div>

      {/* Invitations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3 px-4 font-manrope">Recipient &amp; Entity</th>
                <th className="py-3 px-4">Role &amp; Type</th>
                <th className="py-3 px-4">Dispatched At</th>
                <th className="py-3 px-4">Expires At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#062A5A] text-sm">{inv.recipientName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                      <Mail size={12} className="text-slate-400" />
                      <span>{inv.recipientEmail}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                      {inv.company}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{inv.role}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono mt-0.5 inline-block">
                      {inv.accountType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {inv.invitedAt}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {inv.expiresAt}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        inv.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}
                    >
                      {inv.status === 'Pending' && <Clock size={11} />}
                      <span>{inv.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(inv)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        title="Copy setup URL"
                      >
                        {copiedId === inv.id ? (
                          <Check size={12} className="text-emerald-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                        <span>{copiedId === inv.id ? 'Copied' : 'Copy Link'}</span>
                      </button>

                      {inv.status === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              resendInvitation(inv.id);
                              onSuccessToast(`Resent invitation to ${inv.recipientEmail}`);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0969C7] hover:bg-slate-100"
                            title="Resend Invitation & Renew Expiry"
                          >
                            <RotateCcw size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              cancelInvitation(inv.id);
                              onSuccessToast(`Cancelled invitation token for ${inv.recipientEmail}`);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Revoke Token"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Dispatch Invitation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95">
            <h3 className="font-manrope font-bold text-lg text-[#062A5A] mb-1">
              Dispatch Secure Portal Invitation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Sends an invitation email with a private setup URL and a 7-day cryptographic validity window.
            </p>

            <form onSubmit={handleCreateInvitation} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recipient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Joshi"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recipient Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram@vertexpay.io"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Entity</label>
                <input
                  type="text"
                  placeholder="e.g. Vertex FinTech Pvt Ltd"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Type</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as VaultAccountType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="client">Client</option>
                    <option value="staff">Staff Member</option>
                    <option value="custom">Custom Role</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Role Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assign Primary Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="">No Project Assigned</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRecipientName('');
                    setRecipientEmail('');
                    setCompany('');
                    setSelectedProjectId('');
                    onSuccessToast('Reset invitation form.');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5"
                  >
                    <Send size={13} className="text-[#F28C18]" />
                    <span>Send Invitation</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
