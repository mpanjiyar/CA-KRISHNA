import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FIRM_DETAILS, CORE_SERVICES, OUR_OFFICES, OfficeLocation } from '../data/firmData';
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

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  content: string;
  date: string;
  verified?: boolean;
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

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Rajesh V. Sharma',
    role: 'Managing Director',
    company: 'Horizon Engineering & Trading',
    location: 'Andheri West, Mumbai',
    rating: 5,
    content: 'PANJIYAR KRISHNA & CO. streamlined our entire multi-state GST and quarterly TDS compliance without a single hitch. CA Krishna Panjiyar brings deep precision and genuine care to every consultation.',
    date: 'Sep 2026',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Neelam K. Mehta',
    role: 'Co-Founder & COO',
    company: 'Apex Precision Components',
    location: 'Mumbai, MH',
    rating: 5,
    content: 'Preparing our CMA data and loan documentation for a working capital limit enhancement was executed flawlessly. The bank approved our facility within record time thanks to their impeccable financial compilation.',
    date: 'Aug 2026',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Amitava Sen',
    role: 'Principal Architect',
    company: 'CloudBridge Solutions',
    location: 'Bengaluru / Mumbai',
    rating: 5,
    content: 'As a fast-growing IT consultancy, navigating international service invoices and 15CA/CB documentation felt daunting until we partnered with PANJIYAR KRISHNA & CO. Their PAN India support is truly responsive.',
    date: 'Jul 2026',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Dr. Sunita Deshmukh',
    role: 'Medical Director',
    company: 'Lifeline Health Clinic',
    location: 'Pune / Mumbai',
    rating: 5,
    content: 'Accurate, transparent, and highly accessible. When we received an unexpected income tax notice, their team analysed our ledgers, prepared a point-by-point reply, and resolved it smoothly.',
    date: 'Jun 2026',
    verified: true
  },
  {
    id: 'rev-5',
    name: 'Vikram Mehta',
    role: 'Co-Founder & CEO',
    company: 'FinStack Tech Labs',
    location: 'Bengaluru / Mumbai',
    rating: 5,
    content: 'From DPIIT registration and startup valuation to CMA data preparation for our bank line, PANJIYAR KRISHNA & CO. delivered institutional-grade accuracy under very tight investor deadlines.',
    date: 'May 2026',
    verified: true
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
  updateFirmDetails: (partial: Partial<FirmDetailsType>) => Promise<void>;
  services: ServiceItem[];
  updateService: (id: string, updated: Partial<ServiceItem>) => Promise<void>;
  addService: (newService: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  projects: ProjectItem[];
  updateProject: (id: string, updated: Partial<ProjectItem>) => Promise<void>;
  addProject: (newProject: ProjectItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reviews: ReviewItem[];
  addReview: (newReview: ReviewItem) => Promise<void>;
  updateReview: (id: string, updated: Partial<ReviewItem>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  resetReviewsToDefault: () => Promise<void>;
  offices: OfficeLocation[];
  updateOffice: (id: string, updated: Partial<OfficeLocation>) => Promise<void>;
  addOffice: (newOffice: OfficeLocation) => Promise<void>;
  deleteOffice: (id: string) => Promise<void>;
  websiteText: WebsiteTextConfig;
  updateWebsiteText: (partial: Partial<WebsiteTextConfig>) => Promise<void>;
  resetAllFirmData: () => Promise<void>;
  isSyncing: boolean;
  cloudConnected: boolean;
  lastSyncTime: string | null;
}

const STORAGE_KEYS = {
  FIRM_DETAILS: 'panjiyar_firm_details_v4',
  SERVICES: 'panjiyar_services_v4',
  PROJECTS: 'panjiyar_projects_v4',
  REVIEWS: 'panjiyar_reviews_v4',
  OFFICES: 'panjiyar_offices_v4',
  WEBSITE_TEXT: 'panjiyar_website_text_v4'
};

const FirmDataContext = createContext<FirmDataContextType | undefined>(undefined);

export const FirmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firmDetails, setFirmDetails] = useState<FirmDetailsType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FIRM_DETAILS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phone1 === '600310815') parsed.phone1 = '6000310815';
        return { ...FIRM_DETAILS, ...parsed };
      }
    } catch {
      // Ignored
    }
    return FIRM_DETAILS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignored
    }
    return CORE_SERVICES;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignored
    }
    return INITIAL_PROJECTS;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignored
    }
    return INITIAL_REVIEWS;
  });

  const [offices, setOffices] = useState<OfficeLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignored
    }
    return OUR_OFFICES;
  });

  const [websiteText, setWebsiteText] = useState<WebsiteTextConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEBSITE_TEXT);
      if (saved) {
        return { ...INITIAL_WEBSITE_TEXT, ...JSON.parse(saved) };
      }
    } catch {
      // Ignored
    }
    return INITIAL_WEBSITE_TEXT;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [cloudConnected, setCloudConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Real-time synchronization across all devices and active users via Firestore
  useEffect(() => {
    const docRef = doc(db, 'site_content', 'firm_content');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setCloudConnected(true);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.firmDetails) {
            setFirmDetails((prev) => ({ ...prev, ...data.firmDetails }));
            try {
              localStorage.setItem(STORAGE_KEYS.FIRM_DETAILS, JSON.stringify(data.firmDetails));
            } catch {}
          }
          if (Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
            try {
              localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data.services));
            } catch {}
          }
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            setProjects(data.projects);
            try {
              localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
            } catch {}
          }
          if (Array.isArray(data.reviews)) {
            setReviews(data.reviews);
            try {
              localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(data.reviews));
            } catch {}
          }
          if (Array.isArray(data.offices) && data.offices.length > 0) {
            setOffices(data.offices);
            try {
              localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(data.offices));
            } catch {}
          }
          if (data.websiteText) {
            setWebsiteText((prev) => ({ ...prev, ...data.websiteText }));
            try {
              localStorage.setItem(STORAGE_KEYS.WEBSITE_TEXT, JSON.stringify(data.websiteText));
            } catch {}
          }
          setLastSyncTime(new Date().toLocaleTimeString());
        }
      },
      (err) => {
        console.warn('Firestore firm content sync notice:', err.message);
        setCloudConnected(false);
      }
    );

    // Cross-tab broadcast channel
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('panjiyar_firm_data_sync_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'FIRM_DATA_SYNC' && event.data?.payload) {
            const { key, payload } = event.data;
            if (key === 'firmDetails') setFirmDetails((p) => ({ ...p, ...payload }));
            if (key === 'services') setServices(payload);
            if (key === 'projects') setProjects(payload);
            if (key === 'reviews') setReviews(payload);
            if (key === 'offices') setOffices(payload);
            if (key === 'websiteText') setWebsiteText((p) => ({ ...p, ...payload }));
          }
        };
      }
    } catch {}

    return () => {
      unsubscribe();
      bc?.close();
    };
  }, []);

  const syncToCloud = useCallback(async (partialData: Record<string, unknown>) => {
    setIsSyncing(true);
    try {
      const docRef = doc(db, 'site_content', 'firm_content');
      await setDoc(docRef, { ...partialData, lastUpdatedAt: new Date().toISOString() }, { merge: true });
      setCloudConnected(true);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Could not sync firm data to Cloud Firestore immediately:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const broadcastLocal = (key: string, payload: unknown) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('panjiyar_firm_data_sync_channel');
        bc.postMessage({ type: 'FIRM_DATA_SYNC', key, payload });
        bc.close();
      }
    } catch {}
  };

  const updateFirmDetails = async (partial: Partial<FirmDetailsType>) => {
    const updated = { ...firmDetails, ...partial };
    setFirmDetails(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.FIRM_DETAILS, JSON.stringify(updated));
    } catch {}
    broadcastLocal('firmDetails', updated);
    await syncToCloud({ firmDetails: updated });
  };

  const updateWebsiteText = async (partial: Partial<WebsiteTextConfig>) => {
    const updated = { ...websiteText, ...partial };
    setWebsiteText(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.WEBSITE_TEXT, JSON.stringify(updated));
    } catch {}
    broadcastLocal('websiteText', updated);
    await syncToCloud({ websiteText: updated });
  };

  const updateService = async (id: string, updated: Partial<ServiceItem>) => {
    const newList = services.map((s) => (s.id === id ? { ...s, ...updated } : s));
    setServices(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newList));
    } catch {}
    broadcastLocal('services', newList);
    await syncToCloud({ services: newList });
  };

  const addService = async (newService: ServiceItem) => {
    const newList = [newService, ...services];
    setServices(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newList));
    } catch {}
    broadcastLocal('services', newList);
    await syncToCloud({ services: newList });
  };

  const deleteService = async (id: string) => {
    const newList = services.filter((s) => s.id !== id);
    setServices(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newList));
    } catch {}
    broadcastLocal('services', newList);
    await syncToCloud({ services: newList });
  };

  const updateProject = async (id: string, updated: Partial<ProjectItem>) => {
    const newList = projects.map((p) => (p.id === id ? { ...p, ...updated } : p));
    setProjects(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newList));
    } catch {}
    broadcastLocal('projects', newList);
    await syncToCloud({ projects: newList });
  };

  const addProject = async (newProject: ProjectItem) => {
    const newList = [newProject, ...projects];
    setProjects(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newList));
    } catch {}
    broadcastLocal('projects', newList);
    await syncToCloud({ projects: newList });
  };

  const deleteProject = async (id: string) => {
    const newList = projects.filter((p) => p.id !== id);
    setProjects(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newList));
    } catch {}
    broadcastLocal('projects', newList);
    await syncToCloud({ projects: newList });
  };

  // Reviews Management
  const addReview = async (newReview: ReviewItem) => {
    const newList = [newReview, ...reviews];
    setReviews(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(newList));
    } catch {}
    broadcastLocal('reviews', newList);
    await syncToCloud({ reviews: newList });
  };

  const updateReview = async (id: string, updated: Partial<ReviewItem>) => {
    const newList = reviews.map((r) => (r.id === id ? { ...r, ...updated } : r));
    setReviews(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(newList));
    } catch {}
    broadcastLocal('reviews', newList);
    await syncToCloud({ reviews: newList });
  };

  const deleteReview = async (id: string) => {
    const newList = reviews.filter((r) => r.id !== id);
    setReviews(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(newList));
    } catch {}
    broadcastLocal('reviews', newList);
    await syncToCloud({ reviews: newList });
  };

  const resetReviewsToDefault = async () => {
    setReviews(INITIAL_REVIEWS);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    } catch {}
    broadcastLocal('reviews', INITIAL_REVIEWS);
    await syncToCloud({ reviews: INITIAL_REVIEWS });
  };

  const updateOffice = async (id: string, updated: Partial<OfficeLocation>) => {
    const newList = offices.map((o) => (o.id === id ? { ...o, ...updated } : o));
    setOffices(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(newList));
    } catch {}
    broadcastLocal('offices', newList);
    await syncToCloud({ offices: newList });
  };

  const addOffice = async (newOffice: OfficeLocation) => {
    const newList = [...offices, newOffice];
    setOffices(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(newList));
    } catch {}
    broadcastLocal('offices', newList);
    await syncToCloud({ offices: newList });
  };

  const deleteOffice = async (id: string) => {
    const newList = offices.filter((o) => o.id !== id);
    setOffices(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(newList));
    } catch {}
    broadcastLocal('offices', newList);
    await syncToCloud({ offices: newList });
  };

  const resetAllFirmData = async () => {
    setFirmDetails(FIRM_DETAILS);
    setServices(CORE_SERVICES);
    setProjects(INITIAL_PROJECTS);
    setReviews(INITIAL_REVIEWS);
    setOffices(OUR_OFFICES);
    setWebsiteText(INITIAL_WEBSITE_TEXT);

    try {
      localStorage.removeItem(STORAGE_KEYS.FIRM_DETAILS);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.OFFICES);
      localStorage.removeItem(STORAGE_KEYS.WEBSITE_TEXT);
    } catch {}

    broadcastLocal('firmDetails', FIRM_DETAILS);
    broadcastLocal('services', CORE_SERVICES);
    broadcastLocal('projects', INITIAL_PROJECTS);
    broadcastLocal('reviews', INITIAL_REVIEWS);
    broadcastLocal('offices', OUR_OFFICES);
    broadcastLocal('websiteText', INITIAL_WEBSITE_TEXT);

    await syncToCloud({
      firmDetails: FIRM_DETAILS,
      services: CORE_SERVICES,
      projects: INITIAL_PROJECTS,
      reviews: INITIAL_REVIEWS,
      offices: OUR_OFFICES,
      websiteText: INITIAL_WEBSITE_TEXT
    });
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
        resetAllFirmData,
        isSyncing,
        cloudConnected,
        lastSyncTime
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
