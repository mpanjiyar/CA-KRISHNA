import React, { createContext, useContext, useState, useEffect } from 'react';
import { FIRM_DETAILS, CORE_SERVICES } from '../data/firmData';
import { OUR_OFFICES, OfficeLocation } from '../data/indiaMapData';
import { ServiceItem } from '../types';

export interface ProjectShowcase {
  id: string;
  title: string;
  category: string;
  clientType: string;
  impact: string;
  summary: string;
  date: string;
}

export interface ManagedMediaItem {
  id: string;
  name: string;
  category: 'logo' | 'leadership' | 'banners' | 'firm' | 'favicon';
  description: string;
  url: string;
  dimensions?: string;
  recommendedAspect?: string;
  updatedAt: string;
}

export interface SiteContentState {
  firmDetails: typeof FIRM_DETAILS;
  services: ServiceItem[];
  offices: OfficeLocation[];
  projects: ProjectShowcase[];
  media: {
    headerLogo: string;
    footerLogo: string;
    favicon: string;
    founderPhoto: string;
    officePhoto: string;
    heroBadge: string;
    aboutBanner: string;
    customMedia: ManagedMediaItem[];
  };
  lastUpdated: string;
}

const STORAGE_KEY = 'panjiyar_live_site_content_v2';

const DEFAULT_PROJECTS: ProjectShowcase[] = [
  {
    id: 'proj-1',
    title: 'Multi-State GST Restructuring & Inverted Duty Audit',
    category: 'Indirect Taxation',
    clientType: 'FMCG Manufacturing Enterprise',
    impact: '₹1.84 Crore input tax credit recovered with 100% statutory clearance',
    summary: 'Restructured multi-plant supply chain invoicing and successfully filed inverted duty refunds before Mumbai and Gujarat jurisdictions.',
    date: '2025 - 2026'
  },
  {
    id: 'proj-2',
    title: 'Turnkey Private Limited Incorporation & DPIIT Recognition',
    category: 'Corporate Secretarial',
    clientType: 'B2B Logistics SaaS Startup',
    impact: 'Fast-tracked incorporation & Angel Tax exemption under Section 56(2)(viib)',
    summary: 'Drafted bespoke Articles of Association, obtained startup India tax holiday certificate, and setup compliant ESOP guidelines.',
    date: '2025'
  },
  {
    id: 'proj-3',
    title: '₹22 Crore Working Capital CMA & Consortium Debt Syndication',
    category: 'Project Finance & Loans',
    clientType: 'Precision Engineering Unit',
    impact: 'Sanctioned at sub-benchmark interest margin across leading public sector banks',
    summary: 'Formulated 7-year detailed CMA projections, debt service coverage ratio (DSCR) stress tests, and representation at credit committee.',
    date: '2025 - 2026'
  },
  {
    id: 'proj-4',
    title: 'Faceless High-Value Income Tax Assessment Resolution',
    category: 'Litigation & Direct Tax',
    clientType: 'High-Net-Worth Family Office',
    impact: '100% penalty drop & complete relief under Section 148 reopening notices',
    summary: 'Prepared 120-page evidence dossier reconciling automated AIS data with historical foreign inward remittances.',
    date: '2025'
  }
];

const DEFAULT_MEDIA_ITEMS: ManagedMediaItem[] = [
  {
    id: 'header-logo',
    name: 'Main Header Company Logo',
    category: 'logo',
    description: 'Emblem rendered on the sticky top navigation bar and mobile drawer.',
    url: '/icai-emblem.svg',
    recommendedAspect: 'Square (1:1) or Horizontal Vector',
    dimensions: 'SVG / PNG (min 200px)',
    updatedAt: 'Default ICAI Emblem'
  },
  {
    id: 'footer-logo',
    name: 'Dark Mode Footer Logo',
    category: 'logo',
    description: 'Emblem rendered on deep navy (#031C3D) background in the global footer.',
    url: '/icai-emblem.svg',
    recommendedAspect: 'Square (1:1) or Horizontal Vector',
    dimensions: 'SVG / PNG with transparency',
    updatedAt: 'Default ICAI Emblem'
  },
  {
    id: 'favicon',
    name: 'Website Favicon & Tab Icon',
    category: 'favicon',
    description: 'Browser tab bookmark icon and mobile home screen app touch icon.',
    url: '/favicon.svg',
    recommendedAspect: '1:1 Square',
    dimensions: '32x32px / 64x64px / SVG',
    updatedAt: 'System Favicon'
  },
  {
    id: 'founder-photo',
    name: 'Founder Portrait (CA Krishna Panjiyar)',
    category: 'leadership',
    description: 'Official portrait displayed in the Founder Profile and About Us leadership card.',
    url: '',
    recommendedAspect: '1:1 Square Portrait',
    dimensions: '800 x 800 px recommended',
    updatedAt: 'Default ICAI Insignia'
  },
  {
    id: 'office-photo',
    name: 'Andheri West Head Office',
    category: 'firm',
    description: 'Office reception and conference room photo for Andheri West location page.',
    url: '',
    recommendedAspect: '16:9 Landscape',
    dimensions: '1200 x 675 px recommended',
    updatedAt: 'Default Location Graphic'
  },
  {
    id: 'hero-badge',
    name: 'Hero Visiting-Card Badge',
    category: 'banners',
    description: 'Crest showcased inside the hero section interactive visiting card container.',
    url: '/icai-emblem.svg',
    recommendedAspect: '1:1 Square',
    dimensions: 'Vector / High-Res',
    updatedAt: 'Default ICAI Emblem'
  }
];

const DEFAULT_SITE_STATE: SiteContentState = {
  firmDetails: FIRM_DETAILS,
  services: CORE_SERVICES,
  offices: OUR_OFFICES,
  projects: DEFAULT_PROJECTS,
  media: {
    headerLogo: '/icai-emblem.svg',
    footerLogo: '/icai-emblem.svg',
    favicon: '/favicon.svg',
    founderPhoto: '',
    officePhoto: '',
    heroBadge: '/icai-emblem.svg',
    aboutBanner: '',
    customMedia: DEFAULT_MEDIA_ITEMS
  },
  lastUpdated: new Date().toISOString()
};

interface SiteContentContextType {
  state: SiteContentState;
  // Media updates
  updateHeaderLogo: (url: string) => void;
  updateFooterLogo: (url: string) => void;
  updateFavicon: (url: string) => void;
  updateFounderPhoto: (url: string) => void;
  updateOfficePhoto: (url: string) => void;
  updateMediaItem: (id: string, url: string) => void;
  // Content updates
  updateFirmDetails: (updates: Partial<typeof FIRM_DETAILS>) => void;
  updateContactDetails: (phones: string[], email: string, addressFull: string, hours: string) => void;
  updateService: (service: ServiceItem) => void;
  addService: (service: ServiceItem) => void;
  deleteService: (id: string) => void;
  updateOffice: (office: OfficeLocation) => void;
  addOffice: (office: OfficeLocation) => void;
  deleteOffice: (id: string) => void;
  updateProject: (project: ProjectShowcase) => void;
  addProject: (project: ProjectShowcase) => void;
  deleteProject: (id: string) => void;
  // Global actions
  resetToDefaults: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SiteContentState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SITE_STATE,
          ...parsed,
          firmDetails: { ...DEFAULT_SITE_STATE.firmDetails, ...(parsed.firmDetails || {}) },
          services: parsed.services?.length ? parsed.services : DEFAULT_SITE_STATE.services,
          offices: parsed.offices?.length ? parsed.offices : DEFAULT_SITE_STATE.offices,
          projects: parsed.projects?.length ? parsed.projects : DEFAULT_SITE_STATE.projects,
          media: {
            ...DEFAULT_SITE_STATE.media,
            ...(parsed.media || {}),
            customMedia: parsed.media?.customMedia?.length ? parsed.media.customMedia : DEFAULT_MEDIA_ITEMS
          }
        };
      }
    } catch (e) {
      console.warn('Could not load site content from localStorage:', e);
    }
    return DEFAULT_SITE_STATE;
  });

  // Dynamically update favicon in document head whenever favicon changes
  useEffect(() => {
    if (state.media.favicon) {
      const links = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (links.length > 0) {
        links.forEach((l) => (l.href = state.media.favicon));
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = state.media.favicon;
        document.head.appendChild(link);
      }
    }
  }, [state.media.favicon]);

  const saveState = (newState: SiteContentState) => {
    const updated = {
      ...newState,
      lastUpdated: new Date().toISOString()
    };
    setState(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to persist site content:', e);
    }
  };

  // Media handlers
  const updateHeaderLogo = (url: string) => {
    const updatedMediaItems = state.media.customMedia.map((m) =>
      m.id === 'header-logo' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    saveState({
      ...state,
      media: {
        ...state.media,
        headerLogo: url,
        customMedia: updatedMediaItems
      }
    });
  };

  const updateFooterLogo = (url: string) => {
    const updatedMediaItems = state.media.customMedia.map((m) =>
      m.id === 'footer-logo' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    saveState({
      ...state,
      media: {
        ...state.media,
        footerLogo: url,
        customMedia: updatedMediaItems
      }
    });
  };

  const updateFavicon = (url: string) => {
    const updatedMediaItems = state.media.customMedia.map((m) =>
      m.id === 'favicon' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    saveState({
      ...state,
      media: {
        ...state.media,
        favicon: url,
        customMedia: updatedMediaItems
      }
    });
  };

  const updateFounderPhoto = (url: string) => {
    const updatedMediaItems = state.media.customMedia.map((m) =>
      m.id === 'founder-photo' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    saveState({
      ...state,
      media: {
        ...state.media,
        founderPhoto: url,
        customMedia: updatedMediaItems
      }
    });
  };

  const updateOfficePhoto = (url: string) => {
    const updatedMediaItems = state.media.customMedia.map((m) =>
      m.id === 'office-photo' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    saveState({
      ...state,
      media: {
        ...state.media,
        officePhoto: url,
        customMedia: updatedMediaItems
      }
    });
  };

  const updateMediaItem = (id: string, url: string) => {
    const updatedMediaItems = state.media.customMedia.map((m) =>
      m.id === id ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );

    let headerLogo = state.media.headerLogo;
    let footerLogo = state.media.footerLogo;
    let favicon = state.media.favicon;
    let founderPhoto = state.media.founderPhoto;
    let officePhoto = state.media.officePhoto;
    let heroBadge = state.media.heroBadge;

    if (id === 'header-logo') headerLogo = url;
    if (id === 'footer-logo') footerLogo = url;
    if (id === 'favicon') favicon = url;
    if (id === 'founder-photo') founderPhoto = url;
    if (id === 'office-photo') officePhoto = url;
    if (id === 'hero-badge') heroBadge = url;

    saveState({
      ...state,
      media: {
        ...state.media,
        headerLogo,
        footerLogo,
        favicon,
        founderPhoto,
        officePhoto,
        heroBadge,
        customMedia: updatedMediaItems
      }
    });
  };

  // Content Handlers
  const updateFirmDetails = (updates: Partial<typeof FIRM_DETAILS>) => {
    saveState({
      ...state,
      firmDetails: {
        ...state.firmDetails,
        ...updates
      }
    });
  };

  const updateContactDetails = (phones: string[], email: string, addressFull: string, hours: string) => {
    saveState({
      ...state,
      firmDetails: {
        ...state.firmDetails,
        phone1: phones[0] || state.firmDetails.phone1,
        phone2: phones[1] || state.firmDetails.phone2,
        phones: phones.length > 0 ? phones : state.firmDetails.phones,
        email: email || state.firmDetails.email,
        workingHours: hours || state.firmDetails.workingHours,
        address: {
          ...state.firmDetails.address,
          full: addressFull || state.firmDetails.address.full
        }
      }
    });
  };

  const updateService = (service: ServiceItem) => {
    saveState({
      ...state,
      services: state.services.map((s) => (s.id === service.id ? service : s))
    });
  };

  const addService = (service: ServiceItem) => {
    saveState({
      ...state,
      services: [...state.services, service]
    });
  };

  const deleteService = (id: string) => {
    saveState({
      ...state,
      services: state.services.filter((s) => s.id !== id)
    });
  };

  const updateOffice = (office: OfficeLocation) => {
    saveState({
      ...state,
      offices: state.offices.map((o) => (o.id === office.id ? office : o))
    });
  };

  const addOffice = (office: OfficeLocation) => {
    saveState({
      ...state,
      offices: [...state.offices, office]
    });
  };

  const deleteOffice = (id: string) => {
    saveState({
      ...state,
      offices: state.offices.filter((o) => o.id !== id)
    });
  };

  const updateProject = (project: ProjectShowcase) => {
    saveState({
      ...state,
      projects: state.projects.map((p) => (p.id === project.id ? project : p))
    });
  };

  const addProject = (project: ProjectShowcase) => {
    saveState({
      ...state,
      projects: [...state.projects, project]
    });
  };

  const deleteProject = (id: string) => {
    saveState({
      ...state,
      projects: state.projects.filter((p) => p.id !== id)
    });
  };

  const resetToDefaults = () => {
    saveState(DEFAULT_SITE_STATE);
  };

  const exportBackup = () => {
    return JSON.stringify(state, null, 2);
  };

  const importBackup = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        saveState({
          ...DEFAULT_SITE_STATE,
          ...parsed
        });
        return true;
      }
    } catch {
      // JSON syntax error
    }
    return false;
  };

  return (
    <SiteContentContext.Provider
      value={{
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
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
