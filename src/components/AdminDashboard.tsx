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
  User, 
  MapPin,
  Briefcase,
  CheckCircle2, 
  AlertCircle,
  Download,
  UploadCloud,
  Eye,
  Sliders,
  ShieldCheck,
  Globe,
  Plus,
  Edit2,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSiteContent, ManagedMediaItem, ProjectShowcase } from '../context/SiteContentContext';
import { OfficialFirmLogo, BrandHeaderLockup } from './CaLogo';
import { ServiceItem } from '../types';
import { OfficeLocation } from '../data/indiaMapData';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const { logout, lastLoginTime } = useAdminAuth();
  const { 
    state, 
    updateHeaderLogo, 
    updateFooterLogo, 
    updateFavicon,
    updateFounderPhoto, 
    updateOfficePhoto,
    updateMediaItem, 
    updateFirmDetails,
    updateContactDetails,
    updateService,
    addService,
    deleteService,
    updateOffice,
    addOffice,
    deleteOffice,
    updateProject,
    addProject,
    deleteProject,
    resetToDefaults,
    exportBackup,
    importBackup
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<'logos' | 'media' | 'content' | 'services' | 'offices' | 'projects' | 'preview' | 'backup'>('logos');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  
  // Media editing states
  const [editingItem, setEditingItem] = useState<ManagedMediaItem | null>(null);
  const [urlInput, setUrlInput] = useState('');

  // General firm text edit state
  const [firmName, setFirmName] = useState(state.firmDetails.name);
  const [designation, setDesignation] = useState(state.firmDetails.designation);
  const [founder, setFounder] = useState(state.firmDetails.founder);
  const [founderTitle, setFounderTitle] = useState(state.firmDetails.founderTitle);
  const [tagline, setTagline] = useState(state.firmDetails.tagline);
  const [phone1, setPhone1] = useState(state.firmDetails.phone1);
  const [phone2, setPhone2] = useState(state.firmDetails.phone2);
  const [email, setEmail] = useState(state.firmDetails.email);
  const [addressFull, setAddressFull] = useState(state.firmDetails.address?.full || '');
  const [workingHours, setWorkingHours] = useState(state.firmDetails.workingHours || '');

  // Service Edit / Add Modal
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Office Location Edit / Add Modal
  const [editingOffice, setEditingOffice] = useState<OfficeLocation | null>(null);
  const [isNewOffice, setIsNewOffice] = useState(false);

  // Project Edit / Add Modal
  const [editingProject, setEditingProject] = useState<ProjectShowcase | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Backup states
  const [backupJson, setBackupJson] = useState('');
  const [backupError, setBackupError] = useState<string | null>(null);

  // File input refs for rapid direct uploading
  const headerLogoFileRef = useRef<HTMLInputElement>(null);
  const footerLogoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);
  const generalMediaFileRef = useRef<HTMLInputElement>(null);

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
        showToast('Header Company Logo updated in real-time!');
      });
    }
  };

  const handleFooterLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, (url) => {
        updateFooterLogo(url);
        showToast('Footer Brand Logo updated in real-time!');
      });
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, (url) => {
        updateFavicon(url);
        showToast('Website Favicon updated live across tabs!');
      }, 128);
    }
  };

  const handleMediaItemUpload = (item: ManagedMediaItem, file: File) => {
    handleFileUpload(file, (url) => {
      updateMediaItem(item.id, url);
      showToast(`${item.name} updated live!`);
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

  const handleSaveFirmDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateFirmDetails({
      name: firmName,
      designation: designation,
      founder: founder,
      founderTitle: founderTitle,
      tagline: tagline
    });
    updateContactDetails([phone1, phone2], email, addressFull, workingHours);
    showToast('Firm & Contact information updated across public site in real-time!');
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (isNewService) {
      addService(editingService);
      showToast(`Service "${editingService.name}" created!`);
    } else {
      updateService(editingService);
      showToast(`Service "${editingService.name}" updated!`);
    }
    setEditingService(null);
  };

  const handleSaveOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;
    if (isNewOffice) {
      addOffice(editingOffice);
      showToast(`Office location "${editingOffice.city}" added!`);
    } else {
      updateOffice(editingOffice);
      showToast(`Office location "${editingOffice.city}" updated!`);
    }
    setEditingOffice(null);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (isNewProject) {
      addProject(editingProject);
      showToast(`Case project "${editingProject.title}" added!`);
    } else {
      updateProject(editingProject);
      showToast(`Case project "${editingProject.title}" updated!`);
    }
    setEditingProject(null);
  };

  const handleExport = () => {
    const data = exportBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panjiyar_complete_site_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Complete site state downloaded as JSON!');
  };

  const handleImportJson = () => {
    setBackupError(null);
    if (!backupJson.trim()) return;
    const ok = importBackup(backupJson.trim());
    if (ok) {
      showToast('All website configurations, text, and media imported live!');
      setBackupJson('');
    } else {
      setBackupError('Invalid JSON structure. Please paste a valid backup file.');
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
                  {state.firmDetails.name}
                </span>
                <span className="bg-[#F28C18] text-[#062A5A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Admin Console
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Live Real-Time CMS: Logos, Favicon, Media, Text, Services &amp; Locations
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

      {/* Sub-navigation Tabs: Fully Comprehensive CMS */}
      <div className="bg-white border-b border-[#D9E2EC] shadow-2xs sticky top-[69px] z-20 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-4 py-2 min-w-max">
            
            <button
              onClick={() => setActiveTab('logos')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'logos'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Building2 size={15} className={activeTab === 'logos' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Logos &amp; Favicon</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'media'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Layers size={15} className={activeTab === 'media' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Media Library</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                {state.media.customMedia.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'content'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <User size={15} className={activeTab === 'content' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Firm &amp; Contact Info</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Briefcase size={15} className={activeTab === 'services' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Services</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                {state.services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('offices')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'offices'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <MapPin size={15} className={activeTab === 'offices' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Office Locations</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                {state.offices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Sparkles size={15} className={activeTab === 'projects' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Projects &amp; Mandates</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                {state.projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Eye size={15} className={activeTab === 'preview' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'backup'
                  ? 'bg-[#EEF5FC] text-[#062A5A] border-b-2 border-[#0969C7]'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-50'
              }`}
            >
              <Sliders size={15} className={activeTab === 'backup' ? 'text-[#0969C7]' : 'text-slate-400'} />
              <span>Backup &amp; Reset</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 1: LOGOS, FOOTER LOGO & FAVICON */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'logos' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-[#EEF5FC] to-white p-5 rounded-2xl border border-[#D9E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
                  Brand Emblems &amp; Favicon Management
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Upload and replace the main company logo, dark-mode footer logo, and browser tab favicon. All changes immediately propagate to the website without requiring redeployment.
                </p>
              </div>

              <button
                onClick={resetToDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors shadow-2xs shrink-0"
              >
                <RotateCcw size={14} />
                <span>Restore Default ICAI Assets</span>
              </button>
            </div>

            {/* 3 Brand Asset Cards: Header Logo, Footer Logo, Favicon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Main Header Logo */}
              <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#0969C7] bg-[#EEF5FC] px-2 py-0.5 rounded">
                      Header / Navbar Logo
                    </span>
                    <span className="text-[10px] text-slate-400">Light BG</span>
                  </div>

                  <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                    Company Header Logo
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Primary logo on top navigation &amp; mobile menu.
                  </p>

                  <div className="p-4 rounded-xl bg-[#F7F9FC] border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[140px] mb-4 text-center">
                    <div className="w-16 h-16 rounded-xl bg-white shadow-xs border border-slate-200 p-2 flex items-center justify-center mb-2">
                      <OfficialFirmLogo source="header" sizePx={52} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">Active Header Logo</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <input
                    ref={headerLogoFileRef}
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleHeaderLogoChange}
                  />
                  <button
                    onClick={() => headerLogoFileRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Upload size={13} className="text-[#F28C18]" />
                    <span>Upload &amp; Replace Header Logo</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">SVG / PNG with transparent background</p>
                </div>
              </div>

              {/* Card 2: Footer Logo */}
              <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#F28C18] bg-amber-50 px-2 py-0.5 rounded">
                      Footer Brand Logo
                    </span>
                    <span className="text-[10px] text-slate-400">Dark BG</span>
                  </div>

                  <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                    Footer Logo (Separate Dark Mode)
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Rendered against deep navy background (#031C3D).
                  </p>

                  <div className="p-4 rounded-xl bg-[#031C3D] border border-dashed border-slate-700 flex flex-col items-center justify-center min-h-[140px] mb-4 text-center text-white">
                    <div className="w-16 h-16 rounded-xl bg-white/10 shadow-xs border border-white/20 p-2 flex items-center justify-center mb-2">
                      <OfficialFirmLogo source="footer" sizePx={52} />
                    </div>
                    <span className="text-xs font-medium text-slate-300">Active Footer Logo</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <input
                    ref={footerLogoFileRef}
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFooterLogoChange}
                  />
                  <button
                    onClick={() => footerLogoFileRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#031C3D] hover:bg-[#02142B] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs border border-white/10"
                  >
                    <Upload size={13} className="text-[#F28C18]" />
                    <span>Upload &amp; Replace Footer Logo</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">Optimized for dark background contrast</p>
                </div>
              </div>

              {/* Card 3: Website Favicon */}
              <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Browser Favicon
                    </span>
                    <span className="text-[10px] text-slate-400">Tab Icon</span>
                  </div>

                  <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                    Website Favicon &amp; App Icon
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Appears in browser tabs, bookmarks, and mobile home.
                  </p>

                  <div className="p-4 rounded-xl bg-[#F7F9FC] border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[140px] mb-4 text-center">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-xs border border-slate-200 p-2 flex items-center justify-center mb-2">
                      <img
                        src={state.media.favicon || '/favicon.svg'}
                        alt="Favicon"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">Live Favicon</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <input
                    ref={faviconFileRef}
                    type="file"
                    accept="image/svg+xml,image/png,image/x-icon,image/vnd.microsoft.icon"
                    className="hidden"
                    onChange={handleFaviconChange}
                  />
                  <button
                    onClick={() => faviconFileRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Upload size={13} className="text-emerald-300" />
                    <span>Upload &amp; Replace Favicon</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">SVG or 32x32 / 64x64 PNG / ICO</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 2: CENTRAL MEDIA LIBRARY */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Central Media Section
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Manage, replace, and upload photos used throughout the entire website without touching code.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  Live Reactive State
                </span>
              </div>
            </div>

            {/* Media Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.media.customMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#D9E2EC] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.updatedAt}
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-xl bg-slate-100 border border-slate-200 overflow-hidden mb-4 flex items-center justify-center p-2">
                      {item.url ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                          <ImageIcon size={30} className="mb-1 text-slate-300" />
                          <span className="text-xs font-medium">Default Crest In Use</span>
                          <span className="text-[10px] text-slate-400">Upload to override</span>
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
                      <div>Format: <strong className="text-slate-600">{item.dimensions}</strong></div>
                    </div>
                  </div>

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
        {/* TAB 3: FIRM & CONTACT INFO MANAGEMENT */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'content' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
            <div>
              <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                Firm Details &amp; Contact Coordinates
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Update the official firm name, founder titles, phone numbers, email, and address. Updates reflect instantly across Header, Footer, Hero, and Contact pages.
              </p>
            </div>

            <form onSubmit={handleSaveFirmDetails} className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs space-y-6">
              
              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-4 flex items-center gap-2">
                  <Award size={18} className="text-[#0969C7]" />
                  <span>Firm Identity &amp; Founder</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Firm Name
                    </label>
                    <input
                      type="text"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Designation Subtitle
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Founder Name
                    </label>
                    <input
                      type="text"
                      value={founder}
                      onChange={(e) => setFounder(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Founder Title / Role
                    </label>
                    <input
                      type="text"
                      value={founderTitle}
                      onChange={(e) => setFounderTitle(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Firm Creed / Tagline
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Communications */}
              <div>
                <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-4 flex items-center gap-2">
                  <Phone size={18} className="text-[#F28C18]" />
                  <span>Direct Communication &amp; Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Phone Line (Header / Bottom Bar / Calls)
                    </label>
                    <input
                      type="text"
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Secondary Direct Line / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Practice Working Hours
                    </label>
                    <input
                      type="text"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Head Office Address (Full Formatted)
                    </label>
                    <textarea
                      rows={2}
                      value={addressFull}
                      onChange={(e) => setAddressFull(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Save &amp; Update Live Website
                </button>
              </div>

            </form>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 4: SERVICES MANAGEMENT */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Practice Areas &amp; CA Services
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Manage the practice offerings displayed on Home, Navbar Dropdown, and Service detail views.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    id: 'custom-' + Date.now(),
                    name: 'New Advisory Service',
                    category: 'Corporate Advisory',
                    shortDesc: 'Comprehensive description of the new practice service.',
                    fullDesc: 'Complete detailed description outlining statutory obligations, audits and advisory.',
                    subServices: ['Detailed Practice Point 1', 'Detailed Practice Point 2'],
                    documentsRequired: ['PAN Card', 'Bank Statements'],
                    targetAudience: ['Corporate Companies', 'Proprietorships'],
                    deliverables: ['Audit Report', 'Filing Acknowledgement'],
                    faqs: [{ question: 'What is the turnaround time?', answer: 'Usually 3 to 5 business days.' }],
                    relatedServiceIds: ['income-tax', 'gst-services']
                  });
                  setIsNewService(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <Plus size={14} className="text-[#F28C18]" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {state.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-[#D9E2EC] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#0969C7]">
                        {service.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {service.id}</span>
                    </div>

                    <h4 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                      {service.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                      {service.shortDesc}
                    </p>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-4 space-y-1">
                      <div>Scope items: <strong>{service.subServices?.length || 0} sub-services</strong></div>
                      <div>Deliverables: <strong>{service.deliverables?.length || 0} outputs</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setIsNewService(false);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={13} className="text-[#0969C7]" />
                      <span>Edit Content</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete service "${service.name}"?`)) {
                          deleteService(service.id);
                          showToast(`Service "${service.name}" deleted.`);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 5: OFFICE LOCATIONS MANAGEMENT */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'offices' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Office Network &amp; Regional Hubs
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Manage physical locations and regional advisory desks across India.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingOffice({
                    id: 'office-' + Date.now(),
                    city: 'Pune',
                    state: 'Maharashtra',
                    region: 'West',
                    isHeadquarter: false,
                    address: 'Shivaji Nagar Corporate Hub, Pune',
                    phone: '+91 8876808572',
                    email: 'cakrishanpanjiyar@gmail.com',
                    hours: 'Mon - Sat: 9:30 AM – 6:30 PM (IST)',
                    services: ['Tax Audit', 'GST Invoicing', 'Corporate Filings']
                  });
                  setIsNewOffice(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <Plus size={14} className="text-[#F28C18]" />
                <span>Add Office Location</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {state.offices.map((office) => (
                <div
                  key={office.id}
                  className="bg-white rounded-2xl border border-[#D9E2EC] p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        office.isHeadquarter ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {office.isHeadquarter ? 'Headquarters' : `${office.region} Hub`}
                      </span>
                      <span className="text-xs text-slate-400">{office.state}</span>
                    </div>

                    <h4 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                      {office.city} Office
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      {office.address}
                    </p>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-4 space-y-1">
                      <div className="flex items-center gap-1.5"><Phone size={11} /> <span>{office.phone}</span></div>
                      <div className="flex items-center gap-1.5"><Mail size={11} /> <span className="truncate">{office.email}</span></div>
                      <div className="flex items-center gap-1.5"><Clock size={11} /> <span>{office.hours}</span></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setEditingOffice(office);
                        setIsNewOffice(false);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={13} className="text-[#0969C7]" />
                      <span>Edit Office</span>
                    </button>

                    {!office.isHeadquarter && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete office "${office.city}"?`)) {
                            deleteOffice(office.id);
                            showToast(`Office "${office.city}" removed.`);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 6: PROJECTS & CLIENT MANDATES */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Client Mandates &amp; Track Record
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Manage representative projects, audit successes, and tax case milestones.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProject({
                    id: 'proj-' + Date.now(),
                    title: 'Strategic Corporate Compliance Mandate',
                    category: 'Corporate Finance',
                    clientType: 'Private Limited Enterprise',
                    impact: '100% regulatory compliance achieved on accelerated timeline',
                    summary: 'Executed statutory audit reconciliation and delivered bank-ready financial projections.',
                    date: '2026'
                  });
                  setIsNewProject(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <Plus size={14} className="text-[#F28C18]" />
                <span>Add Case Mandate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {state.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                        {proj.category}
                      </span>
                      <span className="text-xs text-slate-400">{proj.date}</span>
                    </div>

                    <h4 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-[#0969C7] font-semibold mb-2">
                      {proj.clientType}
                    </p>

                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {proj.summary}
                    </p>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 mb-4 text-xs font-semibold text-amber-900 flex items-start gap-2">
                      <Sparkles size={15} className="text-[#F28C18] shrink-0 mt-0.5" />
                      <span>{proj.impact}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setIsNewProject(false);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={13} className="text-[#0969C7]" />
                      <span>Edit Mandate</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete mandate "${proj.title}"?`)) {
                          deleteProject(proj.id);
                          showToast(`Project deleted.`);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 7: LIVE CONTRAST PREVIEW */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'preview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div>
              <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                Real-Time Website Branding Preview
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Inspect how your uploaded company logo, footer logo, and firm texts appear in real web context.
              </p>
            </div>

            {/* Header Preview */}
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

            {/* Footer Preview */}
            <div className="bg-[#031C3D] text-white rounded-2xl border border-slate-800 p-6 shadow-md">
              <span className="text-xs uppercase tracking-wider font-bold text-[#F28C18] mb-3 block">
                2. Global Footer (Dark Navy Mode)
              </span>
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <BrandHeaderLockup theme="dark" source="footer" />
                <span className="text-xs text-slate-300">
                  {state.firmDetails.tagline}
                </span>
              </div>
            </div>

            {/* Founder Profile Preview */}
            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs">
              <span className="text-xs uppercase tracking-wider font-bold text-[#062A5A] mb-3 block">
                3. Founder Profile Badge Presentation
              </span>
              <div className="flex items-center gap-4 p-4 bg-[#F7F9FC] rounded-2xl border border-slate-200 max-w-md">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#062A5A] to-[#0969C7] p-1 shadow-sm flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {state.media.founderPhoto ? (
                      <img src={state.media.founderPhoto} alt="Founder" className="w-full h-full object-cover" />
                    ) : (
                      <OfficialFirmLogo sizePx={38} />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-brand font-bold text-sm text-[#062A5A]">{state.firmDetails.founder}</h4>
                  <p className="text-xs text-[#0969C7] font-semibold">{state.firmDetails.founderTitle}</p>
                  <p className="text-[11px] text-slate-500">{state.firmDetails.address?.city || 'Mumbai'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 8: BACKUP & DATA CONTROLS */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'backup' && (
          <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
            <div>
              <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                Backup &amp; Production Export
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Export all uploaded images, customized logo configurations, services, and text metadata as a portable JSON snapshot.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                  Export Complete Site Configuration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Downloads active state, logos, custom media, services, and contact metadata.
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

            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs">
              <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                Restore from Backup JSON
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Paste a previously exported configuration JSON below to restore all settings live.
              </p>

              <textarea
                rows={4}
                value={backupJson}
                onChange={(e) => setBackupJson(e.target.value)}
                placeholder='Paste exported JSON configuration here...'
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

            <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-manrope font-bold text-base text-red-900">
                  Reset Everything to Defaults
                </h3>
                <p className="text-xs text-red-600 mt-0.5">
                  Restores official ICAI vector emblems for both Header and Footer, and resets services and firm text to initial defaults.
                </p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all site settings to factory defaults?')) {
                    resetToDefaults();
                    showToast('All site configurations restored to factory defaults.');
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

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Option A: Direct File Upload (Desktop / Mobile)
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
                <span className="text-[10px] text-slate-400">PNG, JPG, WebP, SVG</span>
              </button>
            </div>

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

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-left my-8">
            <h3 className="font-manrope font-bold text-lg text-[#062A5A] mb-1">
              {isNewService ? 'Add New Practice Service' : `Edit: ${editingService.name}`}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Changes reflect live on the homepage services grid and navigation mega menu.
            </p>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary (Homepage card)</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Detailed Narrative</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.fullDesc}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-semibold shadow-xs"
                >
                  Save Service Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Office Modal */}
      {editingOffice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left my-8">
            <h3 className="font-manrope font-bold text-lg text-[#062A5A] mb-1">
              {isNewOffice ? 'Add New Regional Office' : `Edit Office: ${editingOffice.city}`}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Regional location coordinates and local advisory phone numbers.
            </p>

            <form onSubmit={handleSaveOffice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.city}
                    onChange={(e) => setEditingOffice({ ...editingOffice, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.state}
                    onChange={(e) => setEditingOffice({ ...editingOffice, state: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address</label>
                <textarea
                  rows={2}
                  required
                  value={editingOffice.address}
                  onChange={(e) => setEditingOffice({ ...editingOffice, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.phone}
                    onChange={(e) => setEditingOffice({ ...editingOffice, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingOffice.email}
                    onChange={(e) => setEditingOffice({ ...editingOffice, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOffice(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-semibold shadow-xs"
                >
                  Save Office Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left my-8">
            <h3 className="font-manrope font-bold text-lg text-[#062A5A] mb-1">
              {isNewProject ? 'Add Client Mandate' : `Edit: ${editingProject.title}`}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Representative corporate advisory engagement details.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mandate Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Practice Category</label>
                  <input
                    type="text"
                    required
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Sector</label>
                  <input
                    type="text"
                    required
                    value={editingProject.clientType}
                    onChange={(e) => setEditingProject({ ...editingProject, clientType: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Impact / Metric</label>
                <input
                  type="text"
                  required
                  value={editingProject.impact}
                  onChange={(e) => setEditingProject({ ...editingProject, impact: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-semibold shadow-xs"
                >
                  Save Mandate Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="w-full py-4 bg-white border-t border-slate-200 text-center text-xs text-slate-400">
        Administrator Session Active &middot; {state.firmDetails.name} &middot; Last login: {lastLoginTime || 'Active session'}
      </footer>
    </div>
  );
};
