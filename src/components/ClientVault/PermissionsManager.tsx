import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  Check,
  Minus,
  Sparkles,
  Lock,
  Layers,
  Sliders,
  User,
  Briefcase,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Users as UsersIcon,
  FolderCheck,
  CheckSquare,
  Square,
  ArrowRight
} from 'lucide-react';
import {
  VaultUser,
  UserPermissions,
  SectionPermission,
  VaultSectionName
} from '../../types/vault';
import { useVault } from '../../context/VaultContext';

interface PermissionsManagerProps {
  user: VaultUser | null;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
  inlineMode?: boolean;
}

const SECTIONS_FOR_MATRIX = [
  { id: 'Projects', label: 'Projects & Mandates', icon: <Briefcase size={14} className="text-amber-500" /> },
  { id: 'Documents', label: 'Documents & Filings', icon: <FileText size={14} className="text-blue-500" /> },
  { id: 'Gallery', label: 'Photos & Gallery', icon: <ImageIcon size={14} className="text-emerald-500" /> },
  { id: 'Messages', label: 'Messages & Advisory', icon: <MessageSquare size={14} className="text-sky-500" /> },
  { id: 'Client Vault', label: 'Financial Information', icon: <Shield size={14} className="text-purple-500" /> },
  { id: 'Profile', label: 'User Management', icon: <UsersIcon size={14} className="text-rose-500" /> }
];

const SIMPLE_PORTAL_SECTIONS: { id: VaultSectionName; label: string; desc: string }[] = [
  { id: 'Dashboard', label: 'Dashboard', desc: 'Overview, analytics & quick cards' },
  { id: 'Projects', label: 'Projects', desc: 'Assigned mandates and milestones' },
  { id: 'Documents', label: 'Documents', desc: 'Statutory returns and 3CD reports' },
  { id: 'Photos', label: 'Photos & Media', desc: 'Asset verification photos' },
  { id: 'Reports', label: 'Financial Information', desc: 'Balance sheets, P&L, and ledgers' },
  { id: 'Messages', label: 'Messages', desc: 'Confidential client-CA chat' },
  { id: 'Settings', label: 'User Management', desc: 'Account administration privileges' }
];

export const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  user,
  onClose,
  onSuccessToast,
  inlineMode = false
}) => {
  const { updateUserPermissions, updateUserSectionAccess, assignProjectsToUser, projects, roleTemplates } = useVault();

  // Local editable state
  const [permissions, setPermissions] = useState<UserPermissions>(() => {
    return user ? JSON.parse(JSON.stringify(user.permissions || {})) : {};
  });

  const [sectionAccess, setSectionAccess] = useState<VaultSectionName[]>(() => {
    return user ? [...(user.sectionAccess || [])] : [];
  });

  const [assignedProjectIds, setAssignedProjectIds] = useState<string[]>(() => {
    return user ? [...(user.assignedProjects || [])] : [];
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'simple' | 'matrix' | 'projects' | 'templates'>('simple');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  useEffect(() => {
    if (user) {
      setPermissions(JSON.parse(JSON.stringify(user.permissions || {})));
      setSectionAccess([...(user.sectionAccess || [])]);
      setAssignedProjectIds([...(user.assignedProjects || [])]);
      setSaveSuccessNotice(false);
    }
  }, [user?.id]);

  if (!user) return null;

  // Toggle specific action in section
  const handleToggleAction = (section: string, action: keyof SectionPermission) => {
    setPermissions((prev) => {
      const currentSection = prev[section] || {
        view: false,
        create: false,
        edit: false,
        delete: false,
        upload: false,
        download: false,
        share: false
      };
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [action]: !currentSection[action]
        }
      };
    });
  };

  // Toggle section access
  const handleToggleSection = (sec: VaultSectionName) => {
    setSectionAccess((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  // Toggle project assignment
  const handleToggleProject = (projId: string) => {
    setAssignedProjectIds((prev) =>
      prev.includes(projId) ? prev.filter((id) => id !== projId) : [...prev, projId]
    );
  };

  // Apply template
  const handleApplyTemplate = (tmplId: string) => {
    const tmpl = roleTemplates.find((t) => t.id === tmplId);
    if (!tmpl) return;
    setPermissions(JSON.parse(JSON.stringify(tmpl.permissions)));
    setSectionAccess([...tmpl.sectionAccess]);
    setSelectedTemplateId(tmplId);
    onSuccessToast(`Applied role template: ${tmpl.name}`);
  };

  // Save changes
  const handleSave = () => {
    updateUserPermissions(user.id, permissions);
    updateUserSectionAccess(user.id, sectionAccess);
    assignProjectsToUser(user.id, assignedProjectIds);

    setSaveSuccessNotice(true);
    onSuccessToast('✓ Changes saved successfully');

    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 4000);
  };

  // Reset to initial
  const handleReset = () => {
    setPermissions(JSON.parse(JSON.stringify(user.permissions || {})));
    setSectionAccess([...(user.sectionAccess || [])]);
    setAssignedProjectIds([...(user.assignedProjects || [])]);
    setSaveSuccessNotice(false);
    onSuccessToast('Permissions reset to previous saved state.');
  };

  const containerClasses = inlineMode
    ? 'w-full bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 text-left space-y-5'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in';

  const modalWrapperClasses = inlineMode
    ? 'w-full'
    : 'bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 sm:p-8 text-left max-h-[90vh] flex flex-col relative overflow-hidden';

  return (
    <div className={containerClasses}>
      <div className={modalWrapperClasses}>
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Shield size={11} className="text-blue-600" />
                <span>Access Control &bull; {user.accountType.toUpperCase()}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {user.id}</span>
            </div>

            <h3 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A] flex items-center gap-2">
              <span>{user.fullName} &ndash; {user.role}</span>
            </h3>
            
            <p className="text-xs text-slate-500">
              Company: <strong className="text-slate-700">{user.company}</strong> &bull; Username: <span className="font-mono font-semibold text-slate-600">@{user.username}</span>
            </p>
          </div>

          {!inlineMode && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 self-start sm:self-center transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Save confirmation toast pill */}
        {saveSuccessNotice && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>✓ Changes saved successfully. Permissions are enforced in real time.</span>
          </div>
        )}

        {/* Modern Tab Bar */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pt-3 pb-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('simple')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'simple'
                ? 'bg-[#062A5A] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckSquare size={13} />
            <span>Simple Permission Checklist</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-[#062A5A] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders size={13} />
            <span>Action Matrix Table</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'bg-[#062A5A] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase size={13} />
            <span>Assigned Projects ({assignedProjectIds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-[#062A5A] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers size={13} />
            <span>Role Presets</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="py-4 space-y-5 overflow-y-auto max-h-[60vh]">
          
          {/* TAB 1: SIMPLE PERMISSION CHECKLIST */}
          {activeTab === 'simple' && (
            <div className="space-y-6">
              
              {/* Section 1: Section Access Checkboxes */}
              <div>
                <h4 className="font-manrope font-bold text-sm text-[#062A5A] mb-1">
                  1. Section Access Permissions
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Check which sections {user.fullName} is allowed to access inside Client Vault:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {SIMPLE_PORTAL_SECTIONS.map((sec) => {
                    const isChecked = sectionAccess.includes(sec.id);
                    return (
                      <div
                        key={sec.id}
                        onClick={() => handleToggleSection(sec.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-300 text-blue-950 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          isChecked ? 'bg-[#0969C7] text-white' : 'border border-slate-300 bg-slate-50'
                        }`}>
                          {isChecked && <Check size={13} />}
                        </div>

                        <div className="min-w-0">
                          <span className="font-bold text-xs block text-slate-900">{sec.label}</span>
                          <span className="text-[11px] text-slate-500 leading-tight block mt-0.5 truncate">{sec.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Action Permissions */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-manrope font-bold text-sm text-[#062A5A] mb-1">
                  2. Granular Action Permissions
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Configure allowed actions (View, Upload, Edit, Delete, Download, Share) across key areas:
                </p>

                <div className="space-y-3">
                  {SECTIONS_FOR_MATRIX.map((sec) => {
                    const secPerm = permissions[sec.id] || {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                      upload: false,
                      download: false,
                      share: false
                    };

                    const actionList: { key: keyof SectionPermission; label: string }[] = [
                      { key: 'view', label: 'View' },
                      { key: 'upload', label: 'Upload' },
                      { key: 'edit', label: 'Edit' },
                      { key: 'delete', label: 'Delete' },
                      { key: 'download', label: 'Download' },
                      { key: 'share', label: 'Share' }
                    ];

                    return (
                      <div
                        key={sec.id}
                        className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-[180px]">
                          {sec.icon}
                          <span className="font-bold text-[#062A5A]">{sec.label}</span>
                        </div>

                        {/* Action Pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {actionList.map((act) => {
                            const active = secPerm[act.key];
                            return (
                              <button
                                key={act.key}
                                type="button"
                                onClick={() => handleToggleAction(sec.id, act.key)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                                  active
                                    ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                    : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-700'
                                }`}
                              >
                                {active ? <Check size={11} /> : <Minus size={11} />}
                                <span>{act.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ACTION MATRIX TABLE */}
          {activeTab === 'matrix' && (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#062A5A] text-white uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4 font-manrope">Section</th>
                    <th className="py-3 px-3 text-center">View</th>
                    <th className="py-3 px-3 text-center">Upload</th>
                    <th className="py-3 px-3 text-center">Edit</th>
                    <th className="py-3 px-3 text-center">Delete</th>
                    <th className="py-3 px-3 text-center">Download</th>
                    <th className="py-3 px-3 text-center">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {SECTIONS_FOR_MATRIX.map((sec) => {
                    const secPerm: SectionPermission = permissions[sec.id] || {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                      upload: false,
                      download: false,
                      share: false
                    };

                    const actions: (keyof SectionPermission)[] = [
                      'view',
                      'upload',
                      'edit',
                      'delete',
                      'download',
                      'share'
                    ];

                    return (
                      <tr key={sec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#062A5A] flex items-center gap-2">
                          {sec.icon}
                          <span>{sec.label}</span>
                        </td>
                        {actions.map((act) => {
                          const isAllowed = secPerm[act];
                          return (
                            <td key={act} className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleAction(sec.id, act)}
                                className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                                  isAllowed
                                    ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                                title={`Toggle ${act} for ${sec.label}`}
                              >
                                {isAllowed ? <Check size={14} /> : <Minus size={14} />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: PROJECT-BASED ASSIGNMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                Assign specific engagements to <strong>{user.fullName}</strong>. Users are only granted access to documents, audits, and deadlines for their assigned projects.
              </div>

              <div className="space-y-2.5">
                {projects.map((proj) => {
                  const isAssigned = assignedProjectIds.includes(proj.id);
                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleToggleProject(proj.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 text-xs ${
                        isAssigned
                          ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                          isAssigned ? 'bg-[#F28C18] text-[#062A5A] font-bold' : 'border border-slate-300 bg-slate-50'
                        }`}>
                          {isAssigned && <Check size={13} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{proj.title}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {proj.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Client: <strong>{proj.clientName}</strong> &bull; Category: {proj.category}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        Due: {proj.dueDate}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ROLE PRESETS */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                Quickly apply standardized permission matrices for common practice roles:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleTemplates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(tmpl.id)}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#0969C7] hover:bg-[#EEF5FC]/50 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-bold text-sm text-[#062A5A]">{tmpl.name}</h5>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {tmpl.accountType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#0969C7] font-semibold">
                      <span>Apply Preset</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Action Controls: Save Changes, Cancel, Reset */}
        <div className="pt-4 border-t border-slate-100 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Changes are saved to the persistent cryptographic database and take effect immediately.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            {!inlineMode && (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#062A5A] to-[#0969C7] hover:from-[#031C3D] hover:to-[#062A5A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Save size={13} className="text-[#F28C18]" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
