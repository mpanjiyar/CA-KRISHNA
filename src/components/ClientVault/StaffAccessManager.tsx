import React, { useState } from 'react';
import {
  Users,
  Shield,
  Save,
  CheckCircle2,
  Building,
  Briefcase,
  Lock,
  Check,
  Minus,
  Sliders,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultUser } from '../../types/vault';

interface StaffAccessManagerProps {
  onSuccessToast: (msg: string) => void;
}

export const StaffAccessManager: React.FC<StaffAccessManagerProps> = ({ onSuccessToast }) => {
  const { users, projects, assignClientsToStaff, assignProjectsToUser, updateUser } = useVault();

  const staffMembers = users.filter((u) => u.accountType === 'staff' || u.accountType === 'super_admin');
  const clients = users.filter((u) => u.accountType === 'client');

  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    staffMembers.find((s) => s.accountType === 'staff')?.id || staffMembers[0]?.id || ''
  );

  const currentStaff = users.find((u) => u.id === selectedStaffId) || staffMembers[0];

  // Local state for edits
  const [assignedClients, setAssignedClients] = useState<string[]>(
    currentStaff?.assignedClientIds || []
  );
  const [assignedProjects, setAssignedProjects] = useState<string[]>(
    currentStaff?.assignedProjects || []
  );

  // Specific staff capability toggles
  const [canUpload, setCanUpload] = useState(true);
  const [canDelete, setCanDelete] = useState(currentStaff?.accountType === 'super_admin');
  const [canCommunicate, setCanCommunicate] = useState(true);
  const [canCreateClients, setCanCreateClients] = useState(currentStaff?.accountType === 'super_admin');
  const [canModifyPermissions, setCanModifyPermissions] = useState(currentStaff?.accountType === 'super_admin');

  // When staff selection changes
  const handleSelectStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    const staff = users.find((u) => u.id === staffId);
    if (staff) {
      setAssignedClients(staff.assignedClientIds || []);
      setAssignedProjects(staff.assignedProjects || []);
      setCanDelete(staff.accountType === 'super_admin');
      setCanCreateClients(staff.accountType === 'super_admin');
      setCanModifyPermissions(staff.accountType === 'super_admin');
    }
  };

  const handleToggleClient = (clientId: string) => {
    setAssignedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    );
  };

  const handleToggleProject = (projectId: string) => {
    setAssignedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const handleSave = () => {
    if (!currentStaff) return;
    assignClientsToStaff(currentStaff.id, assignedClients);
    assignProjectsToUser(currentStaff.id, assignedProjects);

    // Save capability overrides to user note or permissions
    updateUser(currentStaff.id, {
      notes: `${currentStaff.notes || ''} [Capabilities: Upload=${canUpload}, Delete=${canDelete}, CreateClients=${canCreateClients}, ModifyPerms=${canModifyPermissions}]`
    });

    onSuccessToast('✓ Changes saved successfully');
  };

  const handleSaveAndContinue = () => {
    if (!currentStaff) return;
    assignClientsToStaff(currentStaff.id, assignedClients);
    assignProjectsToUser(currentStaff.id, assignedProjects);

    updateUser(currentStaff.id, {
      notes: `${currentStaff.notes || ''} [Capabilities: Upload=${canUpload}, Delete=${canDelete}, CreateClients=${canCreateClients}, ModifyPerms=${canModifyPermissions}]`
    });

    onSuccessToast('✓ Changes saved successfully');
  };

  const handleReset = () => {
    if (!currentStaff) return;
    setAssignedClients(currentStaff.assignedClientIds || []);
    setAssignedProjects(currentStaff.assignedProjects || []);
    setCanDelete(currentStaff.accountType === 'super_admin');
    setCanCreateClients(currentStaff.accountType === 'super_admin');
    setCanModifyPermissions(currentStaff.accountType === 'super_admin');
    onSuccessToast('Reset staff delegation back to saved state.');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EEF5FC] text-[#0969C7] border border-[#0969C7]/20 flex items-center gap-1">
              <UserCheck size={11} />
              <span>Delegated Audit Staff Governance</span>
            </span>
          </div>
          <h2 className="font-manrope font-bold text-xl sm:text-2xl text-[#062A5A]">
            Staff Access Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explicitly assign which client vaults and projects each staff member is authorized to inspect, manage, or communicate with.
          </p>
        </div>

        {/* Selected Staff Selector */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedStaffId}
            onChange={(e) => handleSelectStaff(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-[#062A5A] bg-white focus:outline-none focus:ring-1 focus:ring-[#0969C7] shadow-2xs"
          >
            {staffMembers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.role})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
          >
            <Save size={14} className="text-[#F28C18]" />
            <span>Save Staff Scope</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Staff Members List */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Staff Directory ({staffMembers.length})
          </div>

          <div className="space-y-1.5">
            {staffMembers.map((staff) => {
              const isSelected = staff.id === selectedStaffId;
              return (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => handleSelectStaff(staff.id)}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#EEF5FC] border border-[#0969C7] ring-1 ring-[#0969C7]/20 shadow-2xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#062A5A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {staff.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[#062A5A] truncate">{staff.fullName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{staff.role}</div>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{staff.assignedClientIds?.length || 0} clients</span>
                      <span>&middot;</span>
                      <span>{staff.assignedProjects.length} projects</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Permission & Vault Assignment Controls */}
        <div className="lg:col-span-8 space-y-5">
          {/* Section A: Which Client Vaults Can They Access? */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-manrope font-bold text-sm text-[#062A5A] flex items-center gap-1.5">
                  <Building size={15} className="text-[#0969C7]" />
                  <span>Authorized Client Vault Access ({assignedClients.length} of {clients.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Staff will only be able to view and manage private records for checked clients.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAssignedClients(clients.map((c) => c.id))}
                  className="text-[10px] text-[#0969C7] font-semibold hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">&middot;</span>
                <button
                  type="button"
                  onClick={() => setAssignedClients([])}
                  className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {clients.map((c) => {
                const isChecked = assignedClients.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleToggleClient(c.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-[#EEF5FC] border-[#0969C7] text-[#062A5A]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-xs truncate">{c.company}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {c.fullName} &middot; {c.id}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        isChecked ? 'bg-[#0969C7] text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {isChecked ? <Check size={13} /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: Project-Based Delegation */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-manrope font-bold text-sm text-[#062A5A] flex items-center gap-1.5">
                  <Briefcase size={15} className="text-[#F28C18]" />
                  <span>Assigned Mandates &amp; Projects ({assignedProjects.length} of {projects.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Controls file and workspace visibility within active advisory engagements.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {projects.map((p) => {
                const isChecked = assignedProjects.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleToggleProject(p.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-[#EEF5FC] border-[#0969C7] text-[#062A5A]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-xs truncate">{p.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {p.clientName} &middot; {p.category}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        isChecked ? 'bg-[#0969C7] text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {isChecked ? <Check size={13} /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section C: Staff Operational Powers */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-manrope font-bold text-sm text-[#062A5A] flex items-center gap-1.5">
              <Sliders size={15} className="text-emerald-600" />
              <span>Operational Action Powers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Upload Documents &amp; Reports</span>
                  <span className="text-[10px] text-slate-400">Allow staff to publish files to client vaults</span>
                </div>
                <input
                  type="checkbox"
                  checked={canUpload}
                  onChange={(e) => setCanUpload(e.target.checked)}
                  className="w-4 h-4 text-[#0969C7] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Delete Files &amp; Artifacts</span>
                  <span className="text-[10px] text-slate-400">Permit permanent purging of working papers</span>
                </div>
                <input
                  type="checkbox"
                  checked={canDelete}
                  onChange={(e) => setCanDelete(e.target.checked)}
                  className="w-4 h-4 text-[#0969C7] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Client Communications</span>
                  <span className="text-[10px] text-slate-400">Permit direct messaging in portal</span>
                </div>
                <input
                  type="checkbox"
                  checked={canCommunicate}
                  onChange={(e) => setCanCommunicate(e.target.checked)}
                  className="w-4 h-4 text-[#0969C7] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Create Client Accounts</span>
                  <span className="text-[10px] text-slate-400">Empower staff to onboard new clients</span>
                </div>
                <input
                  type="checkbox"
                  checked={canCreateClients}
                  onChange={(e) => setCanCreateClients(e.target.checked)}
                  className="w-4 h-4 text-[#0969C7] rounded"
                />
              </label>

              <label className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Modify Security &amp; Permissions</span>
                  <span className="text-[10px] text-slate-400">Allow modifying other users&apos; access rights</span>
                </div>
                <input
                  type="checkbox"
                  checked={canModifyPermissions}
                  onChange={(e) => setCanModifyPermissions(e.target.checked)}
                  className="w-4 h-4 text-[#0969C7] rounded"
                />
              </label>
            </div>

            {/* Prominent Save / Reset Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndContinue}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#062A5A] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save size={13} className="text-[#0969C7]" />
                  <span>Save &amp; Continue</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                >
                  <Save size={15} className="text-[#F28C18]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
