import React, { createContext, useContext, useState, useEffect } from 'react';
import { FIRM_DETAILS, CORE_SERVICES, OUR_OFFICES, OfficeLocation, TESTIMONIALS } from '../data/firmData';
import { ServiceItem } from '../types';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  clientType: string;
  description: string;
  turnaroundTime: string;
  deliverables: string[];
  status: 'Completed' | 'Ongoing' | 'Audited';
  year: string;
}

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Statutory & Tax Audit for Engineering Conglomerate',
    category: 'Corporate Audit',
    clientType: 'Precision Manufacturer (Turnover ₹45+ Cr)',
    description: 'Conducted rigorous multi-plant statutory audit under Companies Act 2013 and Section 44AB tax audit, establishing internal inventory controls and CARO reporting.',
    turnaroundTime: '21 Days',
    deliverables: ['Form 3CA/3CD Filing', 'CARO 2020 Compliance Dossier', 'Internal Financial Controls Report'],
    status: 'Completed',
    year: '2025-26'
  },
  {
    id: 'proj-2',
    title: 'Input Tax Credit (ITC) Forensic Reconciliation & Refund',
    category: 'GST Advisory',
    clientType: 'Export Trading House (Andheri West)',
    description: 'Reconciled 1,400+ vendor purchase invoices against GSTR-2B, uncovering ₹38 Lakhs in blocked credit and successfully obtaining export GST refunds without demand notices.',
    turnaroundTime: '14 Days',
    deliverables: ['GSTR-2B vs Books Variance Matrix', 'Form RFD-01 Refund Sanction', 'Departmental Clarification Brief'],
    status: 'Completed',
    year: '2025-26'
  },
  {
    id: 'proj-3',
    title: 'CMA Data Modeling & Multi-Bank Working Capital Loan',
    category: 'Loan Syndication',
    clientType: 'Logistics & Fleet Operator (Mumbai & Pune)',
    description: 'Formulated 5-year projected financials, debt-service coverage ratio (DSCR), sensitivity analyses, and CMA data for ₹12 Crore working capital sanction by PSU bank.',
    turnaroundTime: '10 Days',
    deliverables: ['CMA Data Sheets', 'CA Net Worth Certificates', 'Bank Credit Appraisal Submission'],
    status: 'Completed',
    year: '2025-26'
  },
  {
    id: 'proj-4',
    title: 'High-Growth Tech Startup DPIIT & Structuring',
    category: 'Startup Advisory',
    clientType: 'AI & SaaS Enterprise (Bengaluru & Mumbai)',
    description: 'Structured equity cap-table, assisted with DPIIT recognition for Section 56(2)(viib) angel tax exemption, drafted shareholder registers, and established zero-touch cloud accounting.',
    turnaroundTime: '12 Days',
    deliverables: ['DPIIT Certificate of Recognition', 'MCA Incorporation Kit', 'Chart of Accounts Architecture'],
    status: 'Completed',
    year: '2025-26'
  },
  {
    id: 'proj-5',
    title: 'Faceless Income Tax Assessment & High-Pitch Notice Defense',
    category: 'Direct Tax Litigation',
    clientType: 'High Net-Worth Individual / Family Trust',
    description: 'Represented client in high-value Section 148 reopening notice regarding capital gains, prepared evidence-backed reconciliations, and secured complete drop of demand.',
    turnaroundTime: '18 Days',
    deliverables: ['Written Submissions on IT Portal', 'Bank Statement Indexed Dossier', 'Assessment Order u/s 147'],
    status: 'Completed',
    year: '2025-26'
  }
];

export interface WebsiteTextConfig {
  heroKicker: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutPillarsText: string;
  andheriHeadline: string;
  andheriDescription: string;
  bannerCtaHeadline: string;
  bannerCtaSubheadline: string;
}

export const INITIAL_WEBSITE_TEXT: WebsiteTextConfig = {
  heroKicker: 'PANJIYAR KRISHNA & CO. / CHARTERED ACCOUNTANTS',
  heroHeadline: 'Accuracy, Integrity & Strategic Financial Leadership for Your Enterprise',
  heroSubheadline: 'Reliable Chartered Accountancy, Direct Taxation, Corporate Audit, GST Filings, ROC Compliance, and Business Financing solutions delivered with uncompromising ethics and partner-level attention.',
  aboutPillarsText: 'At PANJIYAR KRISHNA & CO., we combine professional Chartered Accountancy expertise with a practical understanding of business, taxation, accounting and regulatory compliance. Our focus is to provide accurate, transparent and dependable financial solutions that help individuals and businesses make informed decisions and grow with confidence.',
  andheriHeadline: 'Chartered Accountants in Andheri, Mumbai',
  andheriDescription: 'Looking for an established Chartered Accountant in Andheri West? PANJIYAR KRISHNA & CO. provides trusted income tax filing, corporate audit, GST compliance, company registration, and loan documentation services from our office at Bombay Bazaar, Andheri (W), Mumbai.',
  bannerCtaHeadline: 'Ready to Streamline Your Tax & Financial Compliance?',
  bannerCtaSubheadline: 'Schedule a confidential, direct consultation with CA Krishna Panjiyar today at our Andheri (W) office or connect via our PAN India remote desk.'
};

export type FirmDetailsType = typeof FIRM_DETAILS;

interface FirmDataContextType {
  firmDetails: FirmDetailsType;
  updateFirmDetails: (partial: Partial<FirmDetailsType>) => void;
  services: ServiceItem[];
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  addService: (newService: ServiceItem) => void;
  deleteService: (id: string) => void;
  projects: ProjectItem[];
  updateProject: (id: string, updated: Partial<ProjectItem>) => void;
  addProject: (newProject: ProjectItem) => void;
  deleteProject: (id: string) => void;
  offices: OfficeLocation[];
  updateOffice: (id: string, updated: Partial<OfficeLocation>) => void;
  addOffice: (newOffice: OfficeLocation) => void;
  deleteOffice: (id: string) => void;
  websiteText: WebsiteTextConfig;
  updateWebsiteText: (partial: Partial<WebsiteTextConfig>) => void;
  resetAllFirmData: () => void;
}

const STORAGE_KEYS = {
  FIRM_DETAILS: 'panjiyar_firm_details_v2',
  SERVICES: 'panjiyar_services_v2',
  PROJECTS: 'panjiyar_projects_v2',
  OFFICES: 'panjiyar_offices_v2',
  WEBSITE_TEXT: 'panjiyar_website_text_v2'
};

const FirmDataContext = createContext<FirmDataContextType | undefined>(undefined);

export const FirmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Firm Details
  const [firmDetails, setFirmDetails] = useState<FirmDetailsType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FIRM_DETAILS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phone1 === '600310815') {
          parsed.phone1 = '6000310815';
        }
        if (Array.isArray(parsed.phones)) {
          parsed.phones = parsed.phones.map((p: string) => (p === '600310815' ? '6000310815' : p));
        }
        return { ...FIRM_DETAILS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed reading firm details from storage', e);
    }
    return FIRM_DETAILS;
  });

  // 2. Services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed reading services from storage', e);
    }
    return CORE_SERVICES;
  });

  // 3. Projects
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed reading projects from storage', e);
    }
    return INITIAL_PROJECTS;
  });

  // 4. Offices & Locations
  const [offices, setOffices] = useState<OfficeLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFICES);
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed = parsed.map((o: OfficeLocation) => ({
            ...o,
            phone: o.phone ? o.phone.replace('600310815', '6000310815') : o.phone
          }));
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading offices from storage', e);
    }
    return OUR_OFFICES;
  });

  // 5. Website Copy & Content
  const [websiteText, setWebsiteText] = useState<WebsiteTextConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEBSITE_TEXT);
      if (saved) {
        return { ...INITIAL_WEBSITE_TEXT, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed reading website text from storage', e);
    }
    return INITIAL_WEBSITE_TEXT;
  });

  // Broadcast helper to notify other tabs/components in real time
  const broadcastSync = (key?: string, payload?: unknown) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('panjiyar_firm_data_sync_channel');
        bc.postMessage({ type: 'FIRM_DATA_SYNC', key, payload });
        bc.close();
      }
    } catch {
      // Fallback
    }
    try {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('panjiyar_data_updated', { detail: { key, payload } }));
    } catch {
      // Ignored
    }
  };

  // Cross-tab & multi-window real-time sync listener
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('panjiyar_firm_data_sync_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'FIRM_DATA_SYNC') {
            syncAllFromStorage();
          }
        };
      }
    } catch {
      // Fallback
    }

    const syncAllFromStorage = () => {
      try {
        const d = localStorage.getItem(STORAGE_KEYS.FIRM_DETAILS);
        if (d) {
          const parsed = JSON.parse(d);
          if (parsed.phone1 === '600310815') parsed.phone1 = '6000310815';
          if (Array.isArray(parsed.phones)) {
            parsed.phones = parsed.phones.map((p: string) => (p === '600310815' ? '6000310815' : p));
          }
          setFirmDetails({ ...FIRM_DETAILS, ...parsed });
        }
        const s = localStorage.getItem(STORAGE_KEYS.SERVICES);
        if (s) {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed) && parsed.length > 0) setServices(parsed);
        }
        const p = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        if (p) {
          const parsed = JSON.parse(p);
          if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed);
        }
        const o = localStorage.getItem(STORAGE_KEYS.OFFICES);
        if (o) {
          let parsed = JSON.parse(o);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed = parsed.map((item: OfficeLocation) => ({
              ...item,
              phone: item.phone ? item.phone.replace('600310815', '6000310815') : item.phone
            }));
            setOffices(parsed);
          }
        }
        const t = localStorage.getItem(STORAGE_KEYS.WEBSITE_TEXT);
        if (t) {
          const parsed = JSON.parse(t);
          setWebsiteText({ ...INITIAL_WEBSITE_TEXT, ...parsed });
        }
      } catch (err) {
        console.warn('Storage sync error:', err);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || Object.values(STORAGE_KEYS).includes(e.key)) {
        syncAllFromStorage();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncAllFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', syncAllFromStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    // Heartbeat check every 3s to guarantee background sync
    const interval = setInterval(syncAllFromStorage, 3000);

    return () => {
      bc?.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', syncAllFromStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  const updateFirmDetails = (partial: Partial<FirmDetailsType>) => {
    setFirmDetails((prev) => {
      const next = { ...prev, ...partial };
      // Keep phones array in sync if phone1/phone2 updated
      if (partial.phone1 || partial.phone2) {
        next.phones = [partial.phone1 || prev.phone1, partial.phone2 || prev.phone2];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.FIRM_DETAILS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing firm details to storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing services to storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const addService = (newService: ServiceItem) => {
    setServices((prev) => {
      const next = [newService, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed adding service to storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const deleteService = (id: string) => {
    setServices((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed deleting service from storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing projects to storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const addProject = (newProject: ProjectItem) => {
    setProjects((prev) => {
      const next = [newProject, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing projects to storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error('Failed deleting project from storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const updateOffice = (id: string, updated: Partial<OfficeLocation>) => {
    setOffices((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, ...updated } : o));
      try {
        localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing offices to storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const addOffice = (newOffice: OfficeLocation) => {
    setOffices((prev) => {
      const next = [newOffice, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed adding office to storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const deleteOffice = (id: string) => {
    setOffices((prev) => {
      const next = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(next));
      } catch (e) {
        console.error('Failed deleting office from storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const updateWebsiteText = (partial: Partial<WebsiteTextConfig>) => {
    setWebsiteText((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEYS.WEBSITE_TEXT, JSON.stringify(next));
      } catch (e) {
        console.error('Failed writing website text to storage', e);
      }
      broadcastSync();
      return next;
    });
  };

  const resetAllFirmData = () => {
    setFirmDetails(FIRM_DETAILS);
    setServices(CORE_SERVICES);
    setProjects(INITIAL_PROJECTS);
    setOffices(OUR_OFFICES);
    setWebsiteText(INITIAL_WEBSITE_TEXT);
    try {
      localStorage.removeItem(STORAGE_KEYS.FIRM_DETAILS);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.OFFICES);
      localStorage.removeItem(STORAGE_KEYS.WEBSITE_TEXT);
    } catch (e) {
      console.error('Failed resetting firm data in storage', e);
    }
    broadcastSync();
  };

  return (
    <FirmDataContext.Provider
      value={{
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
      }}
    >
      {children}
    </FirmDataContext.Provider>
  );
};

export const useFirmData = () => {
  const context = useContext(FirmDataContext);
  if (!context) {
    throw new Error('useFirmData must be used within a FirmDataProvider');
  }
  return context;
};
