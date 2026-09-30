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
  Globe,
  Plus,
  Edit2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  FileText,
  FileSpreadsheet,
  Save,
  X,
  Type
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useMedia, ManagedMedia } from '../context/MediaContext';
import { useFirmData, ProjectItem } from '../context/FirmDataContext';
import { OfficialFirmLogo, BrandHeaderLockup } from './CaLogo';
import { ServiceItem } from '../types';
import { OfficeLocation } from '../data/indiaMapData';
import { ClientVaultContainer } from './ClientVault/ClientVaultContainer';
import { UniversalImageCard } from './Admin/UniversalImageCard';
import { processImageUpload } from '../utils/imageManager';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

type TabType = 'vault' | 'logos' | 'media' | 'content' | 'services' | 'projects' | 'locations' | 'contact' | 'preview' | 'backup';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const { logout, lastLoginTime } = useAdminAuth();
  
  // Media Context
  const { 
    settings, 
    updateHeaderLogo, 
    updateFooterLogo, 
    updateFavicon,
    updateFounderPhoto, 
    updateOfficePhoto,
    updateHeroBadge,
    updateAboutBanner,
    updateMediaItem, 
    deleteMediaItem,
    resetToDefaults: resetMediaDefaults,
    exportBackup,
    importBackup,
    cloudConnected,
    lastSyncTime,
    isSyncing: isMediaSyncing
  } = useMedia();

  // Full Firm Data Context
  const {
    firmDetails,
    updateFirmDetails,
    services,
    updateService,
    addService,
    deleteService,
    projects,
    updateProject,
    addProject,
    deleteProject,
    offices,
    updateOffice,
    addOffice,
    deleteOffice,
    websiteText,
    updateWebsiteText,
    resetAllFirmData
  } = useFirmData();

  const [activeTab, setActiveTab] = useState<TabType>('logos');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal / Editing States
  const [editingMediaItem, setEditingMediaItem] = useState<ManagedMedia | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [editingOffice, setEditingOffice] = useState<OfficeLocation | null>(null);
  const [isCreatingOffice, setIsCreatingOffice] = useState(false);

  // Form input temps
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [headerLogoUrlInput, setHeaderLogoUrlInput] = useState('');
  const [footerLogoUrlInput, setFooterLogoUrlInput] = useState('');
  const [faviconUrlInput, setFaviconUrlInput] = useState('');
  const [backupJson, setBackupJson] = useState('');
  const [backupError, setBackupError] = useState<string | null>(null);

  // Contact form temp state
  const [contactState, setContactState] = useState({
    name: firmDetails.name,
    designation: firmDetails.designation,
    founder: firmDetails.founder,
    founderTitle: firmDetails.founderTitle,
    tagline: firmDetails.tagline,
    phone1: firmDetails.phone1,
    phone2: firmDetails.phone2,
    email: firmDetails.email,
    line1: firmDetails.address.line1,
    line2: firmDetails.address.line2,
    city: firmDetails.address.city,
    state: firmDetails.address.state,
    pincode: firmDetails.address.pincode,
    workingHours: firmDetails.workingHours,
    mainPositioning: firmDetails.mainPositioning,
    supportingPositioning: firmDetails.supportingPositioning
  });

  // Website copy temp state
  const [copyState, setCopyState] = useState(websiteText);

  // File input refs
  const headerLogoRef = useRef<HTMLInputElement>(null);
  const footerLogoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const generalMediaRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3200);
  };

  // Convert File to compressed Data URL
  const handleFileUpload = (
    file: File, 
    callback: (base64Url: string) => void,
    maxDimension: number = 1600
  ) => {
    if (!file) return;

    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
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

  // Handle save contact changes
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateFirmDetails({
      name: contactState.name,
      designation: contactState.designation,
      founder: contactState.founder,
      founderTitle: contactState.founderTitle,
      tagline: contactState.tagline,
      phone1: contactState.phone1,
      phone2: contactState.phone2,
      email: contactState.email,
      workingHours: contactState.workingHours,
      mainPositioning: contactState.mainPositioning,
      supportingPositioning: contactState.supportingPositioning,
      address: {
        line1: contactState.line1,
        line2: contactState.line2,
        locality: contactState.line2.split(',')[0] || 'Andheri West',
        city: contactState.city,
        state: contactState.state,
        pincode: contactState.pincode,
        full: `${contactState.line1}, ${contactState.line2}, ${contactState.city} – ${contactState.pincode}, ${contactState.state}`
      }
    });
    showToast('Contact and Firm Information updated live!');
  };

  // Handle save website copy changes
  const handleSaveCopy = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteText(copyState);
    showToast('Website Headlines and Text updated live across all pages!');
  };

  // Export Combined Backup (Media + Data)
  const handleExportFullBackup = () => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      firmDetails,
      websiteText,
      services,
      projects,
      offices,
      mediaSettings: settings
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panjiyar_complete_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Complete website snapshot exported successfully!');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col text-left">
      {/* Top Admin Navigation Header */}
      <header className="w-full bg-[#062A5A] text-white border-b border-[#031C3D] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Left Brand Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
              <OfficialFirmLogo sizePx={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand font-bold text-sm sm:text-base tracking-tight text-white">
                  {firmDetails.name}
                </span>
                <span className="bg-[#F28C18] text-[#062A5A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Admin Master
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Real-Time Website &amp; Identity Management Console &middot; Zero Deploy Sync
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/15"
            >
              <Globe size={14} className="text-[#0969C7]" />
              <span className="hidden sm:inline">View Public Website</span>
              <span className="sm:hidden">Website</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors shadow-2xs"
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

      {/* Sub-navigation Tabs: Comprehensive Real-time Controls */}
      <div className="bg-white border-b border-[#D9E2EC] shadow-2xs sticky top-[65px] z-20 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 py-2 whitespace-nowrap min-w-max">
            
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-[#062A5A] to-[#0A3D78] text-white shadow-2xs ring-1 ring-[#F28C18]/60'
                  : 'text-[#062A5A] bg-[#062A5A]/5 hover:bg-[#062A5A]/10 border border-[#062A5A]/15'
              }`}
            >
              <ShieldCheck size={15} className="text-[#F28C18]" />
              <span>Client Vault</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-[#F28C18] text-white px-1.5 py-0.5 rounded shadow-2xs">
                SECURE
              </span>
            </button>

            <button
              onClick={() => setActiveTab('logos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'logos'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <Building2 size={15} />
              <span>Logos &amp; Favicon</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'media'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <Layers size={15} />
              <span>Website Images</span>
              <span className="text-[10px] bg-white/20 text-current px-1.5 rounded">
                {settings.customMedia.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'content'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <Type size={15} />
              <span>Website Text &amp; Copy</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet size={15} />
              <span>Services</span>
              <span className="text-[10px] bg-white/20 text-current px-1.5 rounded font-mono">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <Briefcase size={15} />
              <span>Projects &amp; Mandates</span>
              <span className="text-[10px] bg-white/20 text-current px-1.5 rounded font-mono">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('locations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'locations'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <MapPin size={15} />
              <span>Locations &amp; Offices</span>
              <span className="text-[10px] bg-white/20 text-current px-1.5 rounded font-mono">
                {offices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'contact'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <Phone size={15} />
              <span>Contact &amp; Address</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <Eye size={15} />
              <span>Live Contrast Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'backup'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <Sliders size={15} />
              <span>Backup &amp; Reset</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 0: CLIENT VAULT (SECURE ACCESS & USER ROLES CONTROL) */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'vault' && (
          <div className="animate-in fade-in duration-150">
            <ClientVaultContainer />
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 1: LOGOS & FAVICON (HEADER, FOOTER, FAVICON) */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'logos' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-[#EEF5FC] to-white p-5 rounded-2xl border border-[#D9E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
                  Company Logo, Footer Logo &amp; Favicon Management
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Manage the main header logo, separate high-contrast footer logo, and browser favicon. All changes immediately sync across every page, tab, and device.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={resetMediaDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors shadow-2xs"
                >
                  <RotateCcw size={14} />
                  <span>Restore Official ICAI Crest</span>
                </button>
              </div>
            </div>

            {/* 3-Column Logo Cards: Header, Footer, Favicon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Header Logo */}
              <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0969C7]" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#0969C7] bg-[#EEF5FC] px-2 py-0.5 rounded">
                      Header / Navbar Logo
                    </span>
                  </div>
                  <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                    Company Header Logo
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Appears in sticky header, desktop lockup &amp; mobile drawer.
                  </p>

                  <div className="p-4 rounded-xl bg-[#F7F9FC] border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[140px] mb-4 text-center">
                    <div className="w-18 h-18 rounded-xl bg-white shadow-xs border border-slate-200 p-2 flex items-center justify-center mb-2">
                      <OfficialFirmLogo source="header" sizePx={56} />
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-xs">
                      {settings.headerLogo.startsWith('data:') ? 'Custom Upload Data File' : settings.headerLogo}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <input
                    ref={headerLogoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => {
                          updateHeaderLogo(url);
                          showToast('Header Company Logo updated live!');
                        });
                      }
                    }}
                  />
                  <button
                    onClick={() => headerLogoRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <Upload size={14} className="text-[#F28C18]" />
                    <span>Upload New Header Logo</span>
                  </button>

                  <div className="mt-2.5 flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste cloud storage / CDN URL..."
                      value={headerLogoUrlInput}
                      onChange={(e) => setHeaderLogoUrlInput(e.target.value)}
                      className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                    <button
                      type="button"
                      disabled={!headerLogoUrlInput.trim()}
                      onClick={() => {
                        if (headerLogoUrlInput.trim()) {
                          updateHeaderLogo(headerLogoUrlInput.trim());
                          showToast('Header Company Logo saved and broadcast in real time!');
                          setHeaderLogoUrlInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-[#062A5A] hover:bg-[#031C3D] disabled:opacity-40 text-white font-semibold text-[11px] rounded-lg transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Save size={12} />
                      <span>Save</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Header Company Logo confirmed and synced in real time across all active sessions!');
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                  >
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Saved &amp; Active Across Website</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Footer Logo */}
              <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#F28C18]" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#F28C18] bg-amber-50 px-2 py-0.5 rounded">
                      Footer Dark Logo
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </span>
                  </div>
                  <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                    Footer Brand Logo
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Rendered inside dark navy footer (#031C3D) with light contrast.
                  </p>

                  <div className="p-4 rounded-xl bg-[#031C3D] border border-dashed border-slate-700 flex flex-col items-center justify-center min-h-[140px] mb-4 text-center text-white">
                    <div className="w-18 h-18 rounded-xl bg-white/10 shadow-xs border border-white/20 p-2 flex items-center justify-center mb-2">
                      <OfficialFirmLogo source="footer" sizePx={56} />
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-xs">
                      {settings.footerLogo.startsWith('data:') ? 'Custom Upload Data File' : settings.footerLogo}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <input
                    ref={footerLogoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => {
                          updateFooterLogo(url);
                          showToast('Footer Brand Logo saved and broadcast in real time!');
                        });
                      }
                    }}
                  />
                  <button
                    onClick={() => footerLogoRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#031C3D] hover:bg-[#02142B] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs border border-white/10"
                  >
                    <Upload size={14} className="text-[#F28C18]" />
                    <span>Upload New Footer Logo</span>
                  </button>

                  <div className="mt-2.5 flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste cloud storage / CDN URL..."
                      value={footerLogoUrlInput}
                      onChange={(e) => setFooterLogoUrlInput(e.target.value)}
                      className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                    <button
                      type="button"
                      disabled={!footerLogoUrlInput.trim()}
                      onClick={() => {
                        if (footerLogoUrlInput.trim()) {
                          updateFooterLogo(footerLogoUrlInput.trim());
                          showToast('Footer Brand Logo saved and broadcast in real time!');
                          setFooterLogoUrlInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-[#031C3D] hover:bg-[#02142B] disabled:opacity-40 text-white font-semibold text-[11px] rounded-lg transition-colors shrink-0 flex items-center gap-1 border border-white/10"
                    >
                      <Save size={12} />
                      <span>Save</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Footer Brand Logo confirmed and synced in real time across all active sessions!');
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                  >
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Saved &amp; Active Across Website</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Browser Favicon */}
              <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#159447]" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#159447] bg-emerald-50 px-2 py-0.5 rounded">
                      Browser Tab Favicon
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </span>
                  </div>
                  <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                    Browser Tab Favicon
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Appears in browser tabs, bookmarks &amp; mobile shortcuts.
                  </p>

                  <div className="p-4 rounded-xl bg-[#F7F9FC] border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[140px] mb-4 text-center">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-xs border border-slate-200 p-2 flex items-center justify-center mb-2">
                      <img src={settings.favicon || '/icai-emblem.svg'} alt="Favicon" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-xs">
                      {settings.favicon.startsWith('data:') ? 'Custom Upload Data File' : settings.favicon}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <input
                    ref={faviconRef}
                    type="file"
                    accept="image/x-icon,image/svg+xml,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => {
                          updateFavicon(url);
                          showToast('Browser Favicon saved and broadcast in real time across tabs!');
                        }, 256);
                      }
                    }}
                  />
                  <button
                    onClick={() => faviconRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#159447] hover:bg-[#117638] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <Upload size={14} className="text-white" />
                    <span>Upload New Favicon</span>
                  </button>

                  <div className="mt-2.5 flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste cloud storage / CDN URL..."
                      value={faviconUrlInput}
                      onChange={(e) => setFaviconUrlInput(e.target.value)}
                      className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#159447]"
                    />
                    <button
                      type="button"
                      disabled={!faviconUrlInput.trim()}
                      onClick={() => {
                        if (faviconUrlInput.trim()) {
                          updateFavicon(faviconUrlInput.trim());
                          showToast('Favicon saved and broadcast via Cloud URL!');
                          setFaviconUrlInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-[#159447] hover:bg-[#117638] disabled:opacity-40 text-white font-semibold text-[11px] rounded-lg transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Save size={12} />
                      <span>Save</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Browser Favicon confirmed and synced in real time across all active sessions!');
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                  >
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Saved &amp; Active Across Website</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 2: WEBSITE IMAGES (MEDIA CENTER) */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Central Media Library &amp; Website Photos
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Manage founder portrait, office exterior/interior, hero ribbons and custom banners.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  Real-time broadcast enabled
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settings.customMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#D9E2EC] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
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

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingMediaItem(item);
                        setMediaUrlInput(item.url || '');
                      }}
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
        {/* TAB 3: WEBSITE TEXT & COPY */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveCopy} className="space-y-6 max-w-4xl animate-in fade-in duration-150">
            <div className="bg-white p-6 rounded-2xl border border-[#D9E2EC] shadow-xs">
              <h2 className="font-manrope font-bold text-lg text-[#062A5A] mb-1">
                Edit Website Copy &amp; Headlines
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Update homepage kickers, hero statements, positioning statements, and Andheri location descriptions in real time.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hero Section Kicker Label
                  </label>
                  <input
                    type="text"
                    value={copyState.heroKicker}
                    onChange={(e) => setCopyState({ ...copyState, heroKicker: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Main Hero Headline (H1)
                  </label>
                  <input
                    type="text"
                    value={copyState.heroHeadline}
                    onChange={(e) => setCopyState({ ...copyState, heroHeadline: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hero Subheadline / Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={copyState.heroSubheadline}
                    onChange={(e) => setCopyState({ ...copyState, heroSubheadline: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    About Section Introduction Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={copyState.aboutPillarsText}
                    onChange={(e) => setCopyState({ ...copyState, aboutPillarsText: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Andheri West Page Headline (H1)
                    </label>
                    <input
                      type="text"
                      value={copyState.andheriHeadline}
                      onChange={(e) => setCopyState({ ...copyState, andheriHeadline: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Andheri West Page Description
                    </label>
                    <textarea
                      rows={2}
                      value={copyState.andheriDescription}
                      onChange={(e) => setCopyState({ ...copyState, andheriDescription: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center gap-2 shadow-2xs transition-colors"
                  >
                    <Save size={14} />
                    <span>Publish Copy Changes Live</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 4: SERVICES MANAGEMENT */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Practice Areas &amp; Services Catalog
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Add, edit, or remove services. Changes update navigation megamenu, homepage grid, and detail pages immediately.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCreatingService(true);
                  setEditingService({
                    id: `service-${Date.now()}`,
                    name: '',
                    category: 'Taxation',
                    shortDesc: '',
                    fullDesc: '',
                    subServices: ['Compliances & Filing'],
                    documentsRequired: ['PAN & Aadhaar', 'Financial Statements'],
                    targetAudience: ['SMEs', 'Corporates', 'Individuals'],
                    deliverables: ['Verified Filings', 'Dossier Acknowledgement'],
                    faqs: [{ question: 'What is the turnaround time?', answer: 'Engagements are executed within statutory timelines.' }],
                    relatedServiceIds: []
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
              >
                <Plus size={15} className="text-[#F28C18]" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl border border-[#D9E2EC] p-5 shadow-xs flex flex-col justify-between hover:border-[#0969C7] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#EEF5FC] text-[#0969C7] rounded">
                        {srv.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {srv.subServices.length} Sub-services
                      </span>
                    </div>

                    <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                      {srv.shortDesc}
                    </p>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 space-y-1">
                      <div className="truncate font-medium text-[#062A5A]">
                        Scope: {srv.subServices.slice(0, 2).join(', ')}
                        {srv.subServices.length > 2 ? '...' : ''}
                      </div>
                      <div className="text-slate-400">
                        {srv.faqs.length} FAQ answers configured
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setIsCreatingService(false);
                        setEditingService(srv);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={13} />
                      <span>Edit Service</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove "${srv.name}"?`)) {
                          deleteService(srv.id);
                          showToast(`Service "${srv.name}" removed.`);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete service"
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
        {/* TAB 5: PROJECTS & MANDATES */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Client Mandates &amp; Track Record Projects
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Showcase audits, refunds, corporate litigations, and financing models successfully executed.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCreatingProject(true);
                  setEditingProject({
                    id: `proj-${Date.now()}`,
                    title: '',
                    category: 'Corporate Advisory',
                    clientType: 'Private Enterprise',
                    description: '',
                    turnaroundTime: '15 Days',
                    deliverables: ['Audit Dossier', 'Statutory Filing'],
                    status: 'Completed',
                    year: '2025-26'
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
              >
                <Plus size={15} className="text-[#F28C18]" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-[#D9E2EC] p-5 shadow-xs flex flex-col justify-between hover:border-[#0969C7] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#EEF5FC] text-[#0969C7] rounded">
                        {proj.category}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        {proj.status}
                      </span>
                    </div>

                    <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1 leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mb-2">
                      {proj.clientType} &middot; {proj.turnaroundTime}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setIsCreatingProject(false);
                        setEditingProject(proj);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={13} />
                      <span>Edit Project</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove "${proj.title}"?`)) {
                          deleteProject(proj.id);
                          showToast(`Project removed.`);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete project"
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
        {/* TAB 6: LOCATIONS & OFFICES */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'locations' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                  Office Network &amp; Regional Desks
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Manage the Andheri West headquarters, Delhi NCR, Bangalore, Pune, Ahmedabad, and Kolkata presence.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCreatingOffice(true);
                  setEditingOffice({
                    id: `office-${Date.now()}`,
                    city: '',
                    state: '',
                    region: 'West',
                    isHeadquarter: false,
                    address: '',
                    phone: firmDetails.phone1,
                    email: firmDetails.email,
                    hours: 'Mon - Sat: 9:30 AM - 6:30 PM',
                    services: ['Taxation & Audit', 'GST Compliance']
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
              >
                <Plus size={15} className="text-[#F28C18]" />
                <span>Add Regional Office</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offices.map((off) => (
                <div
                  key={off.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${
                    off.isHeadquarter ? 'border-[#0969C7] bg-[#EEF5FC]/20' : 'border-[#D9E2EC]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        off.isHeadquarter ? 'bg-[#062A5A] text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {off.isHeadquarter ? 'Head Office' : `${off.region} Region`}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {off.state}
                      </span>
                    </div>

                    <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                      {off.city}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3 flex items-start gap-1">
                      <MapPin size={13} className="text-[#F28C18] shrink-0 mt-0.5" />
                      <span>{off.address}</span>
                    </p>

                    <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                      <div>Phone: <strong className="text-slate-700">{off.phone}</strong></div>
                      <div>Email: <strong className="text-slate-700">{off.email}</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setIsCreatingOffice(false);
                        setEditingOffice(off);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={13} />
                      <span>Edit Office</span>
                    </button>

                    {!off.isHeadquarter && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove ${off.city} office?`)) {
                            deleteOffice(off.id);
                            showToast(`Office removed.`);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete office"
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
        {/* TAB 7: CONTACT & FIRM DETAILS */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveContact} className="space-y-6 max-w-4xl animate-in fade-in duration-150">
            <div className="bg-white p-6 rounded-2xl border border-[#D9E2EC] shadow-xs">
              <h2 className="font-manrope font-bold text-lg text-[#062A5A] mb-1">
                Edit Firm Identification &amp; Contact Details
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                All changes reflect across the top navy info bar, footer, contact page, WhatsApp links, and structured schema.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Firm Name</label>
                  <input
                    type="text"
                    required
                    value={contactState.name}
                    onChange={(e) => setContactState({ ...contactState, name: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={contactState.designation}
                    onChange={(e) => setContactState({ ...contactState, designation: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Founder Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactState.founder}
                    onChange={(e) => setContactState({ ...contactState, founder: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Founder Title</label>
                  <input
                    type="text"
                    required
                    value={contactState.founderTitle}
                    onChange={(e) => setContactState({ ...contactState, founderTitle: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Firm Tagline / Creed</label>
                  <input
                    type="text"
                    required
                    value={contactState.tagline}
                    onChange={(e) => setContactState({ ...contactState, tagline: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Working Hours</label>
                  <input
                    type="text"
                    value={contactState.workingHours}
                    onChange={(e) => setContactState({ ...contactState, workingHours: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Phone 1 (Calls &amp; WhatsApp)</label>
                  <input
                    type="text"
                    required
                    value={contactState.phone1}
                    onChange={(e) => setContactState({ ...contactState, phone1: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Secondary Phone 2</label>
                  <input
                    type="text"
                    required
                    value={contactState.phone2}
                    onChange={(e) => setContactState({ ...contactState, phone2: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactState.email}
                    onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={contactState.line1}
                    onChange={(e) => setContactState({ ...contactState, line1: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address Line 2 (Locality)</label>
                  <input
                    type="text"
                    value={contactState.line2}
                    onChange={(e) => setContactState({ ...contactState, line2: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={contactState.city}
                    onChange={(e) => setContactState({ ...contactState, city: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={contactState.pincode}
                    onChange={(e) => setContactState({ ...contactState, pincode: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div className="sm:col-span-2 pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center gap-2 shadow-2xs transition-colors"
                  >
                    <Save size={14} />
                    <span>Save Contact Details Live</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 8: LIVE CONTRAST PREVIEW */}
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
                  {firmDetails.tagline}
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
                  <h4 className="font-brand font-bold text-sm text-[#062A5A]">{firmDetails.founder}</h4>
                  <p className="text-xs text-[#0969C7] font-semibold">{firmDetails.founderTitle}</p>
                  <p className="text-[11px] text-slate-500">{firmDetails.address.locality}, {firmDetails.address.city}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 9: BACKUP & DATA CONTROLS */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'backup' && (
          <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
            <div>
              <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                Backup, Sync &amp; Reset Controls
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Export all uploaded images, customized logo configurations, services, projects, and contact data as a portable JSON snapshot.
              </p>
            </div>

            {/* Export Card */}
            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                  Export Full Website Snapshot
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Downloads a complete snapshot of all media, services, projects, locations, and copy.
                </p>
              </div>
              <button
                onClick={handleExportFullBackup}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
              >
                <Download size={14} className="text-[#F28C18]" />
                <span>Download Backup (.json)</span>
              </button>
            </div>

            {/* Factory Reset */}
            <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-manrope font-bold text-base text-red-900">
                  Reset Everything to Defaults
                </h3>
                <p className="text-xs text-red-600 mt-0.5">
                  Restores official ICAI vector emblems for Header and Footer, resets services, projects, and contact data to verified firm defaults.
                </p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all media, services, and content to initial verified defaults?')) {
                    resetMediaDefaults();
                    resetAllFirmData();
                    showToast('All settings restored to factory defaults.');
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

      {/* --------------------------------------------------------------------------------- */}
      {/* MODAL 1: EDIT / UPLOAD MEDIA */}
      {/* --------------------------------------------------------------------------------- */}
      {editingMediaItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                  Update {editingMediaItem.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Target: {editingMediaItem.dimensions} ({editingMediaItem.recommendedAspect})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingMediaItem(null);
                  setMediaUrlInput('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Preview of Current / Staged Photo */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Staged Image Preview</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Real-time preview
                </span>
              </label>
              <div className="relative aspect-video rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                {mediaUrlInput ? (
                  <img
                    src={mediaUrlInput}
                    alt={editingMediaItem.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <ImageIcon size={32} className="mb-1 text-slate-300" />
                    <span className="text-xs font-medium">Default Firm Graphic In Use</span>
                    <span className="text-[10px] text-slate-400">Upload or enter URL below to customize</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Option A: Upload File (Computer / Phone)
                </label>
                
                <input
                  ref={generalMediaRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, (url) => {
                        setMediaUrlInput(url);
                        showToast(`File loaded into preview! Click "Save & Broadcast Photo" to commit.`);
                      });
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => generalMediaRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-[#0969C7] hover:bg-[#EEF5FC]/50 rounded-2xl flex items-center justify-center gap-2 transition-all text-slate-700 text-xs font-semibold bg-slate-50/50"
                >
                  <UploadCloud size={18} className="text-[#0969C7]" />
                  <span>Select Image File (SVG, PNG, JPG, WebP)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Option B: Or Enter Direct Cloud / CDN Image URL
                </label>
                <input
                  type="url"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg or cloud storage URL"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white"
                />
              </div>
            </div>

            {/* Clear, Prominent Modal Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditingMediaItem(null);
                  setMediaUrlInput('');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => {
                  updateMediaItem(editingMediaItem.id, mediaUrlInput.trim());
                  showToast(`${editingMediaItem.name} saved and synchronized in real time!`);
                  setEditingMediaItem(null);
                  setMediaUrlInput('');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              >
                <Save size={15} className="text-[#F28C18]" />
                <span>Save &amp; Broadcast Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* MODAL 2: EDIT / CREATE SERVICE */}
      {/* --------------------------------------------------------------------------------- */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                {isCreatingService ? 'Add New Practice Area' : `Edit ${editingService.name}`}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category / Discipline</label>
                <input
                  type="text"
                  required
                  value={editingService.category}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description (Cards &amp; Menus)</label>
                <input
                  type="text"
                  required
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Detailed Narrative</label>
                <textarea
                  rows={3}
                  value={editingService.fullDesc}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sub-services (comma separated)
                </label>
                <textarea
                  rows={2}
                  value={editingService.subServices.join(', ')}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    subServices: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingService.name.trim()) {
                    if (isCreatingService) {
                      addService(editingService);
                      showToast(`Service "${editingService.name}" created!`);
                    } else {
                      updateService(editingService.id, editingService);
                      showToast(`Service "${editingService.name}" updated!`);
                    }
                    setEditingService(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <Save size={14} className="text-[#F28C18]" />
                <span>Save Practice Area Live</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* MODAL 3: EDIT / CREATE PROJECT */}
      {/* --------------------------------------------------------------------------------- */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                {isCreatingProject ? 'Add Mandate / Project' : `Edit Mandate`}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discipline / Category</label>
                <input
                  type="text"
                  required
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Profile</label>
                <input
                  type="text"
                  required
                  value={editingProject.clientType}
                  onChange={(e) => setEditingProject({ ...editingProject, clientType: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Turnaround Duration</label>
                <input
                  type="text"
                  value={editingProject.turnaroundTime}
                  onChange={(e) => setEditingProject({ ...editingProject, turnaroundTime: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Narrative / Summary</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deliverables (comma separated)
                </label>
                <input
                  type="text"
                  value={editingProject.deliverables.join(', ')}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    deliverables: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingProject.title.trim()) {
                    if (isCreatingProject) {
                      addProject(editingProject);
                      showToast(`Project created!`);
                    } else {
                      updateProject(editingProject.id, editingProject);
                      showToast(`Project updated!`);
                    }
                    setEditingProject(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <Save size={14} className="text-[#F28C18]" />
                <span>Save Mandate Live</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* MODAL 4: EDIT / CREATE OFFICE */}
      {/* --------------------------------------------------------------------------------- */}
      {editingOffice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                {isCreatingOffice ? 'Add Practice Location' : `Edit ${editingOffice.city} Location`}
              </h3>
              <button
                onClick={() => setEditingOffice(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City Name</label>
                <input
                  type="text"
                  required
                  value={editingOffice.city}
                  onChange={(e) => setEditingOffice({ ...editingOffice, city: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={editingOffice.state}
                  onChange={(e) => setEditingOffice({ ...editingOffice, state: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Region</label>
                <select
                  value={editingOffice.region}
                  onChange={(e) => setEditingOffice({ ...editingOffice, region: e.target.value as any })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7] bg-white"
                >
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="Central">Central</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={editingOffice.address}
                  onChange={(e) => setEditingOffice({ ...editingOffice, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingOffice.phone}
                  onChange={(e) => setEditingOffice({ ...editingOffice, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingOffice.email}
                  onChange={(e) => setEditingOffice({ ...editingOffice, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setEditingOffice(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingOffice.city.trim()) {
                    if (isCreatingOffice) {
                      addOffice(editingOffice);
                      showToast(`Office in ${editingOffice.city} added!`);
                    } else {
                      updateOffice(editingOffice.id, editingOffice);
                      showToast(`Office in ${editingOffice.city} updated!`);
                    }
                    setEditingOffice(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <Save size={14} className="text-[#F28C18]" />
                <span>Save Location Live</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="w-full py-4 bg-white border-t border-slate-200 text-center text-xs text-slate-400">
        Administrator Session Active &middot; {firmDetails.name} &middot; Last login: {lastLoginTime || 'Active session'}
      </footer>
    </div>
  );
};
