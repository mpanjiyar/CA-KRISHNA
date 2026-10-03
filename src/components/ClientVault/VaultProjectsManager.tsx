import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Building,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  X,
  Save,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultProject } from '../../types/vault';

interface VaultProjectsManagerProps {
  onSuccessToast: (msg: string) => void;
}

export const VaultProjectsManager: React.FC<VaultProjectsManagerProps> = ({ onSuccessToast }) => {
  const { projects, users, createProject, updateProject, deleteProject } = useVault();

  const clients = users.filter((u) => u.accountType === 'client');
  const staff = users.filter((u) => u.accountType === 'staff' || u.accountType === 'super_admin');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [editingProject, setEditingProject] = useState<VaultProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<VaultProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [category, setCategory] = useState('Statutory Audit');
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]);
  const [status, setStatus] = useState<VaultProject['status']>('Active');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setTitle('');
    setClientId(clients[0]?.id || '');
    setCategory('Statutory Audit');
    setAssignedStaffIds([]);
    setStatus('Active');
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setDescription('');
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleOpenEdit = (p: VaultProject) => {
    setEditingProject(p);
    setTitle(p.title);
    setClientId(p.clientId);
    setCategory(p.category);
    setAssignedStaffIds(p.assignedStaffIds);
    setStatus(p.status);
    setDueDate(p.dueDate);
    setDescription(p.description);
    setIsCreating(false);
  };

  const handleToggleStaff = (staffId: string) => {
    setAssignedStaffIds((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const client = clients.find((c) => c.id === clientId) || clients[0];

    if (isCreating) {
      createProject({
        title: title.trim(),
        clientName: client?.company || 'Corporate Client',
        clientId: client?.id || 'USR-CL-101',
        category,
        assignedStaffIds,
        status,
        dueDate,
        description: description.trim()
      });
      onSuccessToast(`✓ Changes saved successfully: Project "${title}" created and assigned to ${client?.company}`);
    } else if (editingProject) {
      updateProject(editingProject.id, {
        title: title.trim(),
        clientName: client?.company || editingProject.clientName,
        clientId: client?.id || editingProject.clientId,
        category,
        assignedStaffIds,
        status,
        dueDate,
        description: description.trim()
      });
      onSuccessToast(`✓ Changes saved successfully: Project "${title}" updated.`);
    }

    setIsCreating(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EEF5FC] text-[#0969C7] border border-[#0969C7]/20 flex items-center gap-1">
              <Briefcase size={11} />
              <span>Project Isolation &amp; Mandate Access</span>
            </span>
          </div>
          <h2 className="font-manrope font-bold text-xl sm:text-2xl text-[#062A5A]">
            Projects &amp; Engagements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict project perimeter: Clients only see projects specifically assigned to their accounts. Cross-project file leakage is prevented.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
        >
          <Plus size={14} className="text-[#F28C18]" />
          <span>New Mandate / Project</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, client, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] text-xs bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Active', 'Under Review', 'Completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold text-[11px] transition-colors ${
                selectedStatus === st
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => {
          const assignedStaffMembers = staff.filter((s) => p.assignedStaffIds.includes(s.id));
          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#062A5A] to-[#0969C7]" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10.5px] font-bold text-slate-400">{p.id}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      p.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : p.status === 'Active'
                        ? 'bg-[#EEF5FC] text-[#0969C7]'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <h3 className="font-manrope font-bold text-sm sm:text-base text-[#062A5A] mb-1 line-clamp-2">
                  {p.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#0969C7] font-semibold mb-2">
                  <Building size={13} className="shrink-0" />
                  <span className="truncate">{p.clientName}</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                  {p.description}
                </p>

                {/* Assigned Staff Pills */}
                <div className="mb-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Assigned Auditors ({assignedStaffMembers.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {assignedStaffMembers.map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10.5px] font-medium"
                      >
                        {s.fullName}
                      </span>
                    ))}
                    {assignedStaffMembers.length === 0 && (
                      <span className="text-slate-400 text-[11px] italic">No auditors assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Calendar size={12} className="text-[#F28C18]" />
                  <span>Due {p.dueDate}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-slate-400 hover:text-[#062A5A] hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit project"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingProject(p)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Create/Edit */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                {isCreating ? 'Create Engagement Mandate' : `Edit ${editingProject?.id}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProject(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statutory & Tax Audit FY 2025-26"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Client *</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company} ({c.fullName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="Statutory Audit">Statutory Audit</option>
                    <option value="Indirect Taxation">Indirect Taxation</option>
                    <option value="Direct Tax Appeals">Direct Tax Appeals</option>
                    <option value="Project Financing">Project Financing</option>
                    <option value="International Tax">International Tax</option>
                    <option value="Corporate Advisory">Corporate Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Approval">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Statutory Target Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scope &amp; Description</label>
                <textarea
                  rows={3}
                  placeholder="Key milestones, compliance deliverables, and assurance standards..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              {/* Staff Assignments */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Assign Staff Members to Project
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {staff.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer text-[11px]"
                    >
                      <input
                        type="checkbox"
                        checked={assignedStaffIds.includes(s.id)}
                        onChange={() => handleToggleStaff(s.id)}
                        className="w-3.5 h-3.5 text-[#0969C7] rounded"
                      />
                      <span className="truncate">{s.fullName}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (editingProject) {
                      handleOpenEdit(editingProject);
                    } else {
                      handleOpenCreate();
                    }
                    onSuccessToast('Reset project form.');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProject(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5"
                  >
                    <Save size={14} className="text-[#F28C18]" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-left my-auto space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-manrope font-bold text-base text-[#062A5A]">
                  Delete Project Mandate?
                </h4>
                <p className="text-xs text-slate-500">
                  {deletingProject.title} ({deletingProject.id})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this project mandate for <strong>{deletingProject.clientName}</strong>? All associated filings and assignments will be archived.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProject(deletingProject.id);
                  onSuccessToast(`Project "${deletingProject.title}" removed.`);
                  setDeletingProject(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
