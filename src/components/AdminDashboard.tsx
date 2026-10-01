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
  Type,
  Star,
  MessageSquareQuote,
  Search
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useMedia, ManagedMedia } from '../context/MediaContext';
import { useFirmData, ProjectItem, ReviewItem } from '../context/FirmDataContext';
import { OfficialFirmLogo, BrandHeaderLockup } from './CaLogo';
import { ServiceItem } from '../types';
import { OfficeLocation } from '../data/indiaMapData';
import { ClientVaultContainer } from './ClientVault/ClientVaultContainer';
import { UniversalImageCard } from './Admin/UniversalImageCard';
import { processImageUpload } from '../utils/imageManager';
import { uploadImageFile, processDirectUrl } from '../lib/storageService';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

type TabType = 'vault' | 'logos' | 'media' | 'reviews' | 'content' | 'services' | 'projects' | 'locations' | 'contact' | 'preview' | 'backup';

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
    reviews,
    addReview,
    updateReview,
    deleteReview,
    resetReviewsToDefault,
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
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [isCreatingReview, setIsCreatingReview] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewItem | null>(null);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | 'all'>('all');

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(reviewSearchQuery.toLowerCase());
    const matchesRating = reviewRatingFilter === 'all' || r.rating === reviewRatingFilter;
    return matchesSearch && matchesRating;
  });

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
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFirmDetails({
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
    showToast('✓ Changes saved successfully: Contact & Practice profile updated and synchronized across all active devices.');
  };

  // Handle save website copy changes
  const handleSaveCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWebsiteText(copyState);
    showToast('✓ Changes saved successfully: Website headlines and copy updated and synchronized across all active devices.');
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
            {/* Real-time Multi-Device Sync Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-slate-200">
              <span className="relative flex h-2 w-2">
                {cloudConnected ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                )}
              </span>
              <span className="font-semibold text-[11px] text-white">
                {cloudConnected ? 'Live Multi-Device Sync' : 'Local Fallback'}
              </span>
              {lastSyncTime && (
                <span className="text-[10px] text-slate-300 font-mono hidden lg:inline">
                  &middot; {lastSyncTime}
                </span>
              )}
            </div>

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
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#062A5A] hover:bg-slate-100'
              }`}
            >
              <Star size={15} className="text-[#F28C18]" />
              <span>Reviews &amp; Trust</span>
              <span className="text-[10px] bg-white/20 text-current px-1.5 rounded font-mono">
                {reviews.length}
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
        {/* TAB 1: LOGOS & FAVICON (HEADER, FOOTER, FAVICON, HERO BADGE) */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'logos' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-[#EEF5FC] to-white p-5 rounded-2xl border border-[#D9E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
                  Brand Logos, Favicon &amp; Crest Management
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Supports all image formats (SVG, PNG, WebP, JPG, GIF, AVIF, ICO) with live preview, replacement, format validation, and instant real-time synchronization across all devices.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    await resetMediaDefaults();
                    showToast('✓ Changes saved successfully: Restored official ICAI vector emblems.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors shadow-2xs"
                >
                  <RotateCcw size={14} />
                  <span>Restore Official ICAI Crest</span>
                </button>
              </div>
            </div>

            {/* 4-Grid Logo Cards: Header, Footer, Favicon, Hero Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <UniversalImageCard
                title="Company Header Logo"
                badge="Header / Navbar"
                badgeColor="blue"
                description="Primary emblem displayed on the top sticky navigation header and mobile drawer."
                currentUrl={settings.headerLogo}
                defaultUrl="/icai-emblem.svg"
                recommendedAspect="Square (1:1) or Horizontal (SVG/PNG/WebP)"
                dimensions="SVG, PNG, WebP, JPG, GIF up to 10MB"
                onSave={async (url) => {
                  await updateHeaderLogo(url);
                }}
                onDelete={async () => {
                  await updateHeaderLogo('/icai-emblem.svg');
                }}
                onToast={showToast}
              />

              <UniversalImageCard
                title="Footer Brand Logo"
                badge="Footer Dark Mode"
                badgeColor="amber"
                description="Emblem displayed inside the dark navy global footer (#031C3D)."
                currentUrl={settings.footerLogo}
                defaultUrl="/icai-emblem.svg"
                recommendedAspect="Square (1:1) or Horizontal"
                dimensions="High-contrast SVG or transparent PNG"
                darkPreviewBg={true}
                onSave={async (url) => {
                  await updateFooterLogo(url);
                }}
                onDelete={async () => {
                  await updateFooterLogo('/icai-emblem.svg');
                }}
                onToast={showToast}
              />

              <UniversalImageCard
                title="Browser Tab Favicon"
                badge="Favicon &amp; Tab"
                badgeColor="emerald"
                description="Icon shown in browser tabs, bookmarks, and mobile home screen shortcuts."
                currentUrl={settings.favicon}
                defaultUrl="/icai-emblem.svg"
                recommendedAspect="Square (1:1)"
                dimensions="SVG, ICO, or 32x32 / 64x64 PNG"
                onSave={async (url) => {
                  await updateFavicon(url);
                }}
                onDelete={async () => {
                  await updateFavicon('/icai-emblem.svg');
                }}
                onToast={showToast}
              />

              <UniversalImageCard
                title="Hero Visiting-Card Crest"
                badge="Hero Badge"
                badgeColor="purple"
                description="Emblem rendered inside the Hero visiting-card geometric container."
                currentUrl={settings.heroBadge}
                defaultUrl="/icai-emblem.svg"
                recommendedAspect="Square (1:1)"
                dimensions="Vector SVG, PNG, or WebP"
                darkPreviewBg={true}
                onSave={async (url) => {
                  await updateHeroBadge(url);
                }}
                onDelete={async () => {
                  await updateHeroBadge('/icai-emblem.svg');
                }}
                onToast={showToast}
              />
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
                  Upload and manage founder portrait, office premises, and section visuals. Supports JPG, JPEG, PNG, WebP, SVG, GIF, AVIF, and ICO formats up to 10MB.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMediaItem({
                      id: `custom-media-${Date.now()}`,
                      name: 'New Custom Media Asset',
                      category: 'banners',
                      description: 'Custom visual asset for firm banners or collateral.',
                      url: '',
                      dimensions: 'High-Res Image',
                      recommendedAspect: '16:9 Landscape',
                      updatedAt: 'Just added'
                    });
                    setMediaUrlInput('');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
                >
                  <Plus size={15} className="text-[#F28C18]" />
                  <span>Add New Media Asset</span>
                </button>
              </div>
            </div>

            {/* Core Practice Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UniversalImageCard
                title="Founder Portrait / CA Crest"
                badge="Leadership"
                badgeColor="blue"
                description="Portrait photo of CA Krishna Panjiyar featured in the Founder profile card & About page."
                currentUrl={settings.founderPhoto}
                defaultUrl=""
                recommendedAspect="Square portrait (1:1 or 4:5)"
                dimensions="JPG, PNG, WebP up to 10MB"
                onSave={async (url) => {
                  await updateFounderPhoto(url);
                }}
                onDelete={async () => {
                  await updateFounderPhoto('');
                }}
                onToast={showToast}
              />

              <UniversalImageCard
                title="Andheri West Office / Reception"
                badge="Firm Facility"
                badgeColor="amber"
                description="Photo of Andheri West office, conference room, or executive desk featured across the site."
                currentUrl={settings.officePhoto}
                defaultUrl=""
                recommendedAspect="16:9 Landscape"
                dimensions="JPG, PNG, WebP up to 10MB"
                onSave={async (url) => {
                  await updateOfficePhoto(url);
                }}
                onDelete={async () => {
                  await updateOfficePhoto('');
                }}
                onToast={showToast}
              />

              <UniversalImageCard
                title="About Section Advisory Visual"
                badge="Section Visual"
                badgeColor="purple"
                description="Secondary visual background or illustration used in firm presentation cards."
                currentUrl={settings.aboutBanner}
                defaultUrl=""
                recommendedAspect="16:9 or 4:3 Landscape"
                dimensions="JPG, PNG, WebP, SVG up to 10MB"
                onSave={async (url) => {
                  await updateAboutBanner(url);
                }}
                onDelete={async () => {
                  await updateAboutBanner('');
                }}
                onToast={showToast}
              />

              {/* Any additional custom media items */}
              {settings.customMedia
                .filter(
                  (item) =>
                    !['header-logo', 'footer-logo', 'website-favicon', 'hero-badge', 'founder-photo', 'office-photo', 'about-banner'].includes(item.id)
                )
                .map((item) => (
                  <UniversalImageCard
                    key={item.id}
                    title={item.name}
                    badge={item.category}
                    badgeColor="slate"
                    description={item.description}
                    currentUrl={item.url}
                    defaultUrl=""
                    recommendedAspect={item.recommendedAspect || 'Any Aspect'}
                    dimensions={item.dimensions || 'JPG, PNG, WebP, SVG'}
                    onSave={async (url) => {
                      await updateMediaItem(item.id, url);
                    }}
                    onDelete={async () => {
                      await deleteMediaItem(item.id);
                    }}
                    onToast={showToast}
                  />
                ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB: CLIENT REVIEWS & TRUST MANAGEMENT */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-manrope font-bold text-xl text-[#062A5A] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#F28C18] fill-[#F28C18]" />
                  <span>Client Reviews &amp; Trust Management</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Manage published testimonials and client ratings featured in the public Client Reviews &amp; Trust section.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm('Reset all client reviews back to official firm default testimonials?')) {
                      await resetReviewsToDefault();
                      showToast('✓ Restored official firm reviews to default.');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Restore Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingReview(true);
                    setEditingReview({
                      id: `rev-${Date.now()}`,
                      name: '',
                      role: 'Director / Founder',
                      company: '',
                      location: 'Mumbai, MH',
                      rating: 5,
                      content: '',
                      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                      verified: true
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
                >
                  <Plus size={15} className="text-[#F28C18]" />
                  <span>Add Client Review</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Reviews</span>
                <p className="text-2xl font-bold text-[#062A5A] mt-1">{reviews.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Rating</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-2xl font-bold text-[#062A5A]">
                    {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)).toFixed(1)}
                  </p>
                  <div className="flex items-center text-amber-400">
                    <Star size={16} className="fill-amber-400" />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Verified Clients</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {reviews.filter(r => r.verified !== false).length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Live Status</span>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700">Real-Time Synced</span>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reviews by client or company..."
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500 mr-1">Filter Stars:</span>
                {(['all', 5, 4, 3] as const).map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setReviewRatingFilter(starVal)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      reviewRatingFilter === starVal
                        ? 'bg-[#062A5A] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {starVal === 'all' ? 'All' : `${starVal} ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No reviews matched your search criteria.
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs flex flex-col justify-between transition-all"
                  >
                    <div>
                      {/* Rating & Actions Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                            />
                          ))}
                          <span className="ml-1 text-xs font-bold text-slate-700">{rev.rating}.0</span>
                          {rev.verified !== false && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              <CheckCircle2 size={11} className="text-emerald-600" /> Verified
                            </span>
                          )}
                        </div>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingReview(false);
                              setEditingReview({ ...rev });
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0969C7] hover:bg-slate-100 transition-colors"
                            title="Edit Review"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setReviewToDelete(rev)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Review Quote Body */}
                      <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal italic mb-4">
                        &ldquo;{rev.content}&rdquo;
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{rev.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {rev.role} &bull; {rev.company}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100 block">
                          {rev.location}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{rev.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Banner CTA Headline
                    </label>
                    <input
                      type="text"
                      value={copyState.bannerCtaHeadline}
                      onChange={(e) => setCopyState({ ...copyState, bannerCtaHeadline: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Banner CTA Subheadline
                    </label>
                    <textarea
                      rows={2}
                      value={copyState.bannerCtaSubheadline}
                      onChange={(e) => setCopyState({ ...copyState, bannerCtaSubheadline: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setCopyState(websiteText);
                      showToast('Reverted copy changes back to saved state.');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <Save size={15} className="text-[#F28C18]" />
                    <span>Save Changes</span>
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

                <div className="sm:col-span-2 pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setContactState({
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
                      showToast('Reverted contact changes back to saved state.');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <Save size={15} className="text-[#F28C18]" />
                    <span>Save Changes</span>
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
                  Asset Title / Label
                </label>
                <input
                  type="text"
                  value={editingMediaItem.name}
                  onChange={(e) => setEditingMediaItem({ ...editingMediaItem, name: e.target.value })}
                  placeholder="e.g. Conference Hall, Executive Team Photo"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white mb-3"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Option A: Upload File (JPG, PNG, WebP, SVG, GIF, AVIF, ICO up to 10MB)
                </label>
                
                <input
                  ref={generalMediaRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.svg,.gif,.ico,.avif,.bmp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const result = await uploadImageFile(file);
                        setMediaUrlInput(result.url);
                        showToast(`File staged (${(result.sizeBytes / 1024).toFixed(0)} KB)! Click "Save Changes" to publish.`);
                      } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : 'Upload failed';
                        showToast(`Error: ${msg}`);
                      }
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => generalMediaRef.current?.click()}
                  className="w-full py-3.5 border-2 border-dashed border-slate-300 hover:border-[#0969C7] hover:bg-[#EEF5FC]/50 rounded-2xl flex items-center justify-center gap-2 transition-all text-slate-700 text-xs font-semibold bg-slate-50/50"
                >
                  <UploadCloud size={18} className="text-[#0969C7]" />
                  <span>Choose Image File (JPG, PNG, WebP, SVG, GIF, AVIF, ICO)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Option B: Or Enter Stored Path (/uploads/...) or Direct Cloud/CDN URL
                </label>
                <input
                  type="text"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="/uploads/image.jpg or https://example.com/photo.jpg"
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
                onClick={async () => {
                  const raw = mediaUrlInput.trim();
                  try {
                    let finalUrl = raw;
                    if (raw && !raw.startsWith('data:')) {
                      const res = await processDirectUrl(raw);
                      finalUrl = res.url;
                    }
                    await updateMediaItem(editingMediaItem.id, finalUrl);
                    showToast(`✓ Changes saved successfully: ${editingMediaItem.name} saved and synchronized in real time.`);
                    setEditingMediaItem(null);
                    setMediaUrlInput('');
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : 'Invalid image URL';
                    showToast(`Error: ${msg}`);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <Save size={15} className="text-[#F28C18]" />
                <span>Save Changes</span>
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
                onClick={async () => {
                  if (editingService.name.trim()) {
                    if (isCreatingService) {
                      await addService(editingService);
                      showToast(`✓ Changes saved successfully: Service "${editingService.name}" created and synchronized in real time.`);
                    } else {
                      await updateService(editingService.id, editingService);
                      showToast(`✓ Changes saved successfully: Service "${editingService.name}" updated and broadcast across all devices.`);
                    }
                    setEditingService(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Save size={14} className="text-[#F28C18]" />
                <span>Save Changes</span>
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
                onClick={async () => {
                  if (editingProject.title.trim()) {
                    if (isCreatingProject) {
                      await addProject(editingProject);
                      showToast(`✓ Changes saved successfully: Mandate "${editingProject.title}" created and synchronized in real time.`);
                    } else {
                      await updateProject(editingProject.id, editingProject);
                      showToast(`✓ Changes saved successfully: Mandate "${editingProject.title}" updated and broadcast across all devices.`);
                    }
                    setEditingProject(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Save size={14} className="text-[#F28C18]" />
                <span>Save Changes</span>
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
                onClick={async () => {
                  if (editingOffice.city.trim()) {
                    if (isCreatingOffice) {
                      await addOffice(editingOffice);
                      showToast(`✓ Changes saved successfully: Office in ${editingOffice.city} added and synchronized.`);
                    } else {
                      await updateOffice(editingOffice.id, editingOffice);
                      showToast(`✓ Changes saved successfully: Office in ${editingOffice.city} updated and synchronized.`);
                    }
                    setEditingOffice(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Save size={14} className="text-[#F28C18]" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* MODAL: DELETE REVIEW CONFIRMATION */}
      {/* --------------------------------------------------------------------------------- */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="font-manrope font-bold text-lg text-slate-900 mb-2">
              Delete Client Review?
            </h3>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to permanently delete the review from <strong className="text-slate-900">{reviewToDelete.name}</strong> ({reviewToDelete.company})? This will immediately remove it from the public Client Reviews &amp; Trust section across all devices in real time.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5 text-xs text-slate-600 italic">
              &ldquo;{reviewToDelete.content}&rdquo;
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  const clientName = reviewToDelete.name;
                  await deleteReview(reviewToDelete.id);
                  setReviewToDelete(null);
                  showToast(`✓ Review from "${clientName}" deleted and removed from the website across all devices.`);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Trash2 size={14} />
                <span>Confirm Delete Review</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* MODAL: EDIT / CREATE CLIENT REVIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-bold text-lg text-[#062A5A] flex items-center gap-2">
                <Star size={18} className="text-[#F28C18] fill-[#F28C18]" />
                <span>{isCreatingReview ? 'Add New Client Review' : 'Edit Client Review'}</span>
              </h3>
              <button
                onClick={() => setEditingReview(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingReview.name}
                  onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                  placeholder="e.g. Rajesh V. Sharma"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={editingReview.role}
                    onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Enterprise</label>
                  <input
                    type="text"
                    value={editingReview.company}
                    onChange={(e) => setEditingReview({ ...editingReview, company: e.target.value })}
                    placeholder="e.g. Horizon Engineering"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={editingReview.location}
                    onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                    placeholder="e.g. Andheri West, Mumbai"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={editingReview.rating}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7] bg-white"
                  >
                    <option value={5}>5 Stars ★★★★★ (Exceptional)</option>
                    <option value={4}>4 Stars ★★★★☆ (Very Good)</option>
                    <option value={3}>3 Stars ★★★☆☆ (Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Quote / Testimonial Text *</label>
                <textarea
                  rows={4}
                  required
                  value={editingReview.content}
                  onChange={(e) => setEditingReview({ ...editingReview, content: e.target.value })}
                  placeholder="Enter detailed client quote describing professional Chartered Accountancy experience..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0969C7]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verified-engagement"
                  checked={editingReview.verified !== false}
                  onChange={(e) => setEditingReview({ ...editingReview, verified: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0969C7] focus:ring-[#0969C7]"
                />
                <label htmlFor="verified-engagement" className="text-xs font-medium text-slate-700">
                  Mark as Verified Client Engagement
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (editingReview.name.trim() && editingReview.content.trim()) {
                    if (isCreatingReview) {
                      await addReview(editingReview);
                      showToast(`✓ Review from "${editingReview.name}" published live!`);
                    } else {
                      await updateReview(editingReview.id, editingReview);
                      showToast(`✓ Review from "${editingReview.name}" updated!`);
                    }
                    setEditingReview(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Save size={14} className="text-[#F28C18]" />
                <span>Save Review</span>
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
