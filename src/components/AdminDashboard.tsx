import React, { useState, useRef } from 'react';
import { 
  LogOut, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  RotateCcw, 
  Check, 
  ExternalLink, 
  Layers, 
  Building2, 
  Sparkles, 
  User, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  Download,
  UploadCloud,
  Eye,
  Sliders,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useMedia, ManagedMedia } from '../context/MediaContext';
import { OfficialFirmLogo, BrandHeaderLockup } from './CaLogo';
import { FIRM_DETAILS } from '../data/firmData';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const { logout, lastLoginTime } = useAdminAuth();
  const { 
    settings, 
    updateHeaderLogo, 
    updateFooterLogo, 
    updateFounderPhoto, 
    updateOfficePhoto,
    updateMediaItem, 
    resetToDefaults,
    exportBackup,
    importBackup
  } = useMedia();

  const [activeTab, setActiveTab] = useState<'logos' | 'media' | 'preview' | 'backup'>('logos');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ManagedMedia | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [backupJson, setBackupJson] = useState('');
  const [backupError, setBackupError] = useState<string | null>(null);

  // File input refs for fast uploading
  const headerLogoFileRef = useRef<HTMLInputElement>(null);
  const footerLogoFileRef = useRef<HTMLInputElement>(null);
  const generalMediaFileRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3200);
  };

  // Convert File to compressed Data URL (handles SVG, PNG, WebP, JPEG)
  const handleFileUpload = (
    file: File, 
    callback: (base64Url: string) => void,
    maxDimension: number = 1600
  ) => {
    if (!file) return;

    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          callback(result);
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.92);
          callback(dataUrl);
        } else {
          callback(img.src);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleHeaderLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, (url) => {
        updateHeaderLogo(url);
        showToast('Header Company Logo updated successfully!');
      });
    }
  };

  const handleFooterLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, (url) => {
        updateFooterLogo(url);
        showToast('Footer Brand Logo updated successfully!');
      });
    }
  };

  const handleMediaItemUpload = (item: ManagedMedia, file: File) => {
    handleFileUpload(file, (url) => {
      updateMediaItem(item.id, url);
      showToast(`${item.name} updated successfully!`);
      setEditingItem(null);
    });
  };

  const handleApplyUrl = () => {
    if (!editingItem || !urlInput.trim()) return;
    updateMediaItem(editingItem.id, urlInput.trim());
    showToast(`${editingItem.name} updated via URL!`);
    setEditingItem(null);
    setUrlInput('');
  };

  const handleExport = () => {
    const data = exportBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panjiyar_media_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup configuration exported!');
  };

  const handleImportJson = () => {
    setBackupError(null);
    if (!backupJson.trim()) return;
    const ok = importBackup(backupJson.trim());
    if (ok) {
      showToast('Media configuration imported successfully!');
      setBackupJson('');
    } else {
      setBackupError('Invalid JSON format. Please paste a valid backup file.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col text-left">
      {/* Top Admin Navigation Header */}
      <header className="w-full bg-[#062A5A] text-white border-b border-[#031C3D] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left Brand Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
              <OfficialFirmLogo sizePx={30} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand font-bold text-sm sm:text-base tracking-tight text-white">
                  PANJIYAR KRISHNA &amp; CO.
                </span>
                <span className="bg-[#F28C18] text-[#062A5A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Admin Master
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Centralized Media, Brand Identity &amp; Logo Management Panel
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/15"
            >
              <Globe size={14} className="text-[#0969C7]" />
              <span className="hidden sm:inline">View Public Website</span>
              <span className="sm:hidden">Website</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors shadow-2xs"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-18 right-6 z-50 bg-[#062A5A] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 animate-in slide-in-from-top-3">
          <CheckCircle2 size={18} className="text-[#159447]" />
          <span className="text-xs sm:text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Sub-navigation Tabs */}
      <div className="bg-white border-b border-[#D9E2EC] shadow-2xs sticky top-[69px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-2.5">
            <button
              onClick={() => setActiveTab('logos')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'logos'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Building2 size={16} className={activeTab === 'logos' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Company &amp; Footer Logos</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'media'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Layers size={16} className={activeTab === 'media' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Central Media Center</span>
              <span className="text-[11px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-md font-mono">
                {settings.customMedia.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Eye size={16} className={activeTab === 'preview' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Live Contrast Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'backup'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Sliders size={16} className={activeTab === 'backup' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Backup &amp; Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 1: COMPANY & FOOTER LOGOS SEPARATION */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'logos' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Context Info Banner */}
            <div className="bg-gradient-to-r from-[#EEF5FC] to-white p-5 rounded-2xl border border-[#D9E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
                  Central Logo Management
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Replace the main website header logo and the footer logo independently. Changes are instantly stored in persistent storage and synchronized in real-time across every page of the website.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors shadow-2xs"
                >
                  <RotateCcw size={14} />
                  <span>Restore Official ICAI Emblem</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Dual Logo Replace Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Main Header Logo */}
              <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0969C7]" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#0969C7] bg-[#EEF5FC] px-2.5 py-1 rounded-md">
                      Header / Navbar Logo
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Target: Light Backgrounds
                    </span>
                  </div>

                  <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1">
                    Main Company Header Logo
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">
                    This emblem appears in the sticky navigation bar, mobile menu, and top header across all views.
                  </p>

                  {/* Logo Preview Canvas (Light Background) */}
                  <div className="p-6 rounded-2xl bg-[#F7F9FC] border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[160px] mb-5 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-slate-200 p-2 flex items-center justify-center mb-3">
                      <OfficialFirmLogo source="header" sizePx={64} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Current Header Logo
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                      {settings.headerLogo.startsWith('data:') ? 'Custom Uploaded Data File' : settings.headerLogo}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <input
                    ref={headerLogoFileRef}
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleHeaderLogoChange}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => headerLogoFileRef.current?.click()}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                    >
                      <Upload size={14} className="text-[#F28C18]" />
                      <span>Upload &amp; Replace Header Logo</span>
                    </button>

                    {settings.headerLogo !== '/icai-emblem.svg' && (
                      <button
                        onClick={() => {
                          updateHeaderLogo('/icai-emblem.svg');
                          showToast('Header logo reset to default ICAI emblem.');
                        }}
                        title="Reset to default emblem"
                        className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Recommended: SVG with transparent background, or PNG (minimum 200x200px)
                  </p>
                </div>
              </div>

              {/* Card 2: Global Footer Logo */}
              <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#F28C18]" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#F28C18] bg-amber-50 px-2.5 py-1 rounded-md">
                      Footer Brand Logo
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Target: Deep Navy Background (#031C3D)
                    </span>
                  </div>

                  <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1">
                    Footer Logo (Separate Dark Mode Emblem)
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">
                    This emblem appears inside the dark navy global footer. You can provide a white-contrast version or custom watermark.
                  </p>

                  {/* Logo Preview Canvas (Dark Navy Background) */}
                  <div className="p-6 rounded-2xl bg-[#031C3D] border border-dashed border-slate-700 flex flex-col items-center justify-center min-h-[160px] mb-5 text-center text-white">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 shadow-sm border border-white/20 p-2 flex items-center justify-center mb-3">
                      <OfficialFirmLogo source="footer" sizePx={64} />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
                      Current Footer Logo
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                      {settings.footerLogo.startsWith('data:') ? 'Custom Uploaded Data File' : settings.footerLogo}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <input
                    ref={footerLogoFileRef}
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFooterLogoChange}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => footerLogoFileRef.current?.click()}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#031C3D] hover:bg-[#02142B] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs border border-white/10"
                    >
                      <Upload size={14} className="text-[#F28C18]" />
                      <span>Upload &amp; Replace Footer Logo</span>
                    </button>

                    {settings.footerLogo !== '/icai-emblem.svg' && (
                      <button
                        onClick={() => {
                          updateFooterLogo('/icai-emblem.svg');
                          showToast('Footer logo reset to default ICAI emblem.');
                        }}
                        title="Reset to default emblem"
                        className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Can be identical to Header logo or specialized for dark backgrounds
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 2: CENTRALIZED MEDIA CENTER (ALL WEBSITE IMAGES) */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header Description */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Central Media Library
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Manage, replace, and upload photos used throughout the entire website without touching code.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  Auto-synced across components
                </span>
              </div>
            </div>

            {/* Media Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settings.customMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#D9E2EC] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div>
                    {/* Category Pill */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.updatedAt}
                      </span>
                    </div>

                    {/* Preview Area */}
                    <div className="relative aspect-video rounded-xl bg-slate-100 border border-slate-200 overflow-hidden mb-4 flex items-center justify-center p-2">
                      {item.url ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                          <ImageIcon size={32} className="mb-1 text-slate-300" />
                          <span className="text-xs font-medium">Default Visual In Use</span>
                          <span className="text-[10px] text-slate-400">Tap Replace to Upload Custom Image</span>
                        </div>
                      )}
                    </div>

                    <h4 className="font-manrope font-bold text-sm text-[#062A5A] mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-4">
                      <div>Aspect: <strong className="text-slate-600">{item.recommendedAspect}</strong></div>
                      <div>Recommended: <strong className="text-slate-600">{item.dimensions}</strong></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload size={13} className="text-[#0969C7]" />
                      <span>Replace Photo</span>
                    </button>

                    {item.url && (
                      <button
                        onClick={() => {
                          updateMediaItem(item.id, '');
                          showToast(`${item.name} restored to default.`);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Reset to default asset"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 3: LIVE CONTRAST PREVIEW */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'preview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div>
              <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                Real-Time Website Branding Preview
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Inspect how your uploaded company logo and footer logo render in realistic web contexts.
              </p>
            </div>

            {/* Preview 1: Header Bar Simulation */}
            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs">
              <span className="text-xs uppercase tracking-wider font-bold text-[#0969C7] mb-3 block">
                1. Main Sticky Header (Light Mode)
              </span>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
                <BrandHeaderLockup theme="light" source="header" />
                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span>Home</span>
                  <span>About Us</span>
                  <span>Practice Areas</span>
                  <span className="px-3 py-1.5 bg-[#062A5A] text-white rounded-lg">Consult</span>
                </div>
              </div>
            </div>

            {/* Preview 2: Footer Bar Simulation */}
            <div className="bg-[#031C3D] text-white rounded-2xl border border-slate-800 p-6 shadow-md">
              <span className="text-xs uppercase tracking-wider font-bold text-[#F28C18] mb-3 block">
                2. Global Footer (Dark Navy Mode)
              </span>
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <BrandHeaderLockup theme="dark" source="footer" />
                <span className="text-xs text-slate-300">
                  {FIRM_DETAILS.tagline}
                </span>
              </div>
            </div>

            {/* Preview 3: Founder Avatar Simulation */}
            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs">
              <span className="text-xs uppercase tracking-wider font-bold text-[#062A5A] mb-3 block">
                3. Founder Profile Badge Presentation
              </span>
              <div className="flex items-center gap-4 p-4 bg-[#F7F9FC] rounded-2xl border border-slate-200 max-w-md">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#062A5A] to-[#0969C7] p-1 shadow-sm flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {settings.founderPhoto ? (
                      <img src={settings.founderPhoto} alt="Founder" className="w-full h-full object-cover" />
                    ) : (
                      <OfficialFirmLogo sizePx={38} />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-brand font-bold text-sm text-[#062A5A]">{FIRM_DETAILS.founder}</h4>
                  <p className="text-xs text-[#0969C7] font-semibold">{FIRM_DETAILS.founderTitle}</p>
                  <p className="text-[11px] text-slate-500">Andheri (W), Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 4: BACKUP & DATA CONTROLS */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'backup' && (
          <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
            <div>
              <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                Backup &amp; Environment Export
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Export all uploaded images, customized logo configurations, and metadata as a portable JSON backup file.
              </p>
            </div>

            {/* Export Card */}
            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                  Export Media Package
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Downloads a complete snapshot of all active media URLs and upload assets.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
              >
                <Download size={14} className="text-[#F28C18]" />
                <span>Download Backup (.json)</span>
              </button>
            </div>

            {/* Import Card */}
            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs">
              <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                Restore from Backup JSON
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Paste a previously exported configuration JSON below to restore all logos and photos across the site.
              </p>

              <textarea
                rows={4}
                value={backupJson}
                onChange={(e) => setBackupJson(e.target.value)}
                placeholder='Paste exported JSON configuration here... {"headerLogo": "...", "footerLogo": "..."}'
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] mb-3"
              />

              {backupError && (
                <div className="p-3 mb-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{backupError}</span>
                </div>
              )}

              <button
                onClick={handleImportJson}
                disabled={!backupJson.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0969C7] hover:bg-[#085cb0] disabled:opacity-50 text-white font-semibold text-xs shadow-2xs transition-colors"
              >
                <UploadCloud size={14} />
                <span>Import &amp; Apply Configuration</span>
              </button>
            </div>

            {/* Factory Reset */}
            <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-manrope font-bold text-base text-red-900">
                  Reset Everything to Defaults
                </h3>
                <p className="text-xs text-red-600 mt-0.5">
                  Restores official ICAI vector emblems for both Header and Footer, and clears custom photo overrides.
                </p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all logos and media to initial defaults?')) {
                    resetToDefaults();
                    showToast('All media settings restored to factory defaults.');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
              >
                <RotateCcw size={14} />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Edit Media Modal (Upload File or Enter URL) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95">
            <h3 className="font-manrope font-bold text-lg text-[#062A5A] mb-1">
              Update {editingItem.name}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Choose to upload an image from your computer or supply an external direct image URL.
            </p>

            {/* Option 1: Direct File Upload */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Option A: Direct File Upload (Computer / Phone)
              </label>
              
              <input
                ref={generalMediaFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleMediaItemUpload(editingItem, file);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => generalMediaFileRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-[#0969C7] hover:bg-[#EEF5FC]/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-600"
              >
                <UploadCloud size={24} className="text-[#0969C7]" />
                <span className="text-xs font-semibold text-[#062A5A]">Choose image file</span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WebP, SVG (Auto-compressed)</span>
              </button>
            </div>

            {/* Option 2: Image URL */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Option B: Or Enter Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="px-4 py-2.5 bg-[#062A5A] hover:bg-[#031C3D] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setUrlInput('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="w-full py-4 bg-white border-t border-slate-200 text-center text-xs text-slate-400">
        Administrator Session Active &middot; {FIRM_DETAILS.name} &middot; Last login: {lastLoginTime || 'Active session'}
      </footer>
    </div>
  );
};
