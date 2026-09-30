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
  Sliders
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
  'Client Vault',
  'Files',
  'Projects',
  'Gallery',
  'Documents',
  'Messages',
  'Profile'
] as const;

const ALL_PORTAL_SECTIONS: VaultSectionName[] = [
  'Dashboard',
  'My Profile',
  'Projects',
  'Documents',
  'Files',
  'Photos',
  'Videos',
  'Gallery',
  'Invoices',
  'Reports',
  'Messages',
  'Notifications',
  'Downloads',
  'Support',
  'Settings'
];

export const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  user,
  onClose,
  onSuccessToast,
  inlineMode = false
}) => {
  const { updateUserPermissions, updateUserSectionAccess, roleTemplates } = useVault();

  // Local editable state
  const [permissions, setPermissions] = useState<UserPermissions>(() => {
    return user ? JSON.parse(JSON.stringify(user.permissions)) : {};
  });

  const [sectionAccess, setSectionAccess] = useState<VaultSectionName[]>(() => {
    return user ? [...user.sectionAccess] : [];
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'matrix' | 'sections' | 'templates'>('matrix');

  useEffect(() => {
    if (user) {
      setPermissions(JSON.parse(JSON.stringify(user.permissions)));
      setSectionAccess([...user.sectionAccess]);
    }
  }, [user?.id]);

  if (!user) return null;

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

  const handleToggleSectionAccess = (sec: VaultSectionName) => {
    setSectionAccess((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  const handleApplyTemplate = (templateId: string) => {
    const tmpl = roleTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;
    setPermissions(JSON.parse(JSON.stringify(tmpl.permissions)));
    setSectionAccess([...tmpl.sectionAccess]);
    setSelectedTemplateId(templateId);
    onSuccessToast(`Applied "${tmpl.name}" permission template.`);
  };

  const handleSave = () => {
    updateUserPermissions(user.id, permissions);
    updateUserSectionAccess(user.id, sectionAccess);
    onSuccessToast(`✓ Changes saved successfully`);
    onClose();
  };

  const handleSaveAndContinue = () => {
    updateUserPermissions(user.id, permissions);
    updateUserSectionAccess(user.id, sectionAccess);
    onSuccessToast(`✓ Changes saved successfully`);
  };

  const handleReset = () => {
    setPermissions(JSON.parse(JSON.stringify(user.permissions)));
    setSectionAccess([...user.sectionAccess]);
    onSuccessToast('Reset changes to current user state.');
  };

  const modalContent = (
    <div className={`bg-white rounded-3xl ${inlineMode ? 'w-full shadow-xs' : 'max-w-4xl w-full shadow-2xl my-6 max-h-[92vh]'} p-5 sm:p-7 border border-slate-200 text-left animate-in zoom-in-95 flex flex-col`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#062A5A] text-white flex items-center justify-center shadow-xs shrink-0">
            <Sliders size={20} className="text-[#F28C18]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
                Permissions Manager
              </h2>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-[#EEF5FC] text-[#0969C7]">
                {user.fullName} ({user.id})
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure granular action capabilities, section-level visibility, and reusable security templates.
            </p>
          </div>
        </div>

        {!inlineMode && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 self-end sm:self-auto transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-3 border-b border-slate-100 shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`py-2 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'border-[#0969C7] text-[#062A5A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield size={14} className="text-[#0969C7]" />
            <span>Granular Action Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`py-2 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sections'
                ? 'border-[#0969C7] text-[#062A5A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers size={14} className="text-[#F28C18]" />
            <span>Section-Level Access ({sectionAccess.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'border-[#0969C7] text-[#062A5A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles size={14} className="text-emerald-600" />
            <span>Role Templates</span>
          </button>
        </div>

        {/* Tab 1: Granular Action Matrix */}
        {activeTab === 'matrix' && (
          <div className="overflow-y-auto py-4 flex-1 space-y-4">
            <div className="p-3 rounded-xl bg-[#EEF5FC]/60 border border-[#0969C7]/20 text-xs text-[#062A5A] flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <Lock size={14} className="text-[#0969C7] shrink-0" />
                <span>
                  Actions are cryptographically validated on the server layer before access to resources is granted.
                </span>
              </span>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </span>
                  Granted
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded bg-slate-200 text-slate-400 flex items-center justify-center text-[9px] font-bold">
                    —
                  </span>
                  Denied
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F7F9FC] border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <th className="py-3 px-4 font-manrope">Section</th>
                    <th className="py-3 px-3 text-center">View</th>
                    <th className="py-3 px-3 text-center">Create</th>
                    <th className="py-3 px-3 text-center">Edit</th>
                    <th className="py-3 px-3 text-center">Delete</th>
                    <th className="py-3 px-3 text-center">Upload</th>
                    <th className="py-3 px-3 text-center">Download</th>
                    <th className="py-3 px-3 text-center">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {SECTIONS_FOR_MATRIX.map((secName) => {
                    const secPerm: SectionPermission = permissions[secName] || {
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
                      'create',
                      'edit',
                      'delete',
                      'upload',
                      'download',
                      'share'
                    ];

                    return (
                      <tr key={secName} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#062A5A]">
                          {secName}
                        </td>
                        {actions.map((act) => {
                          const isAllowed = secPerm[act];
                          return (
                            <td key={act} className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleAction(secName, act)}
                                className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all ${
                                  isAllowed
                                    ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700 ring-2 ring-emerald-600/20'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                                title={`Toggle ${act} for ${secName}`}
                              >
                                {isAllowed ? <Check size={13} /> : <Minus size={13} />}
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
          </div>
        )}

        {/* Tab 2: Section-Level Access */}
        {activeTab === 'sections' && (
          <div className="overflow-y-auto py-4 flex-1 space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              Select which portal sections appear in this user&apos;s navigation menu and sidebar. Unauthorized sections are blocked even if requested by direct URL.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {ALL_PORTAL_SECTIONS.map((sec) => {
                const isSelected = sectionAccess.includes(sec);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleToggleSectionAccess(sec)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#EEF5FC] border-[#0969C7] text-[#062A5A] ring-1 ring-[#0969C7]'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">{sec}</span>
                      <span className="text-[10px] text-slate-400">
                        {isSelected ? 'Enabled for user' : 'Hidden & Denied'}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#0969C7] text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {isSelected ? <Check size={13} /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Reusable Role Templates */}
        {activeTab === 'templates' && (
          <div className="overflow-y-auto py-4 flex-1 space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Apply a standardized, audited role template to instantly configure permissions for this user.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {roleTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-[#EEF5FC] border-[#0969C7] ring-2 ring-[#0969C7]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-sm text-[#062A5A]">{tmpl.name}</h4>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {tmpl.accountType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {tmpl.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {tmpl.sectionAccess.slice(0, 5).map((sec) => (
                        <span
                          key={sec}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                        >
                          {sec}
                        </span>
                      ))}
                      {tmpl.sectionAccess.length > 5 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-mono">
                          +{tmpl.sectionAccess.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.id)}
                    className="w-full py-2 px-3 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Sparkles size={13} className="text-[#F28C18]" />
                    <span>Apply This Template</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer with Explicit Save / Cancel / Reset buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAndContinue}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#062A5A] font-bold text-xs flex items-center gap-1.5 transition-colors"
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
  );

  if (inlineMode) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      {modalContent}
    </div>
  );
};
