import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ManagedMedia {
  id: string;
  name: string;
  category: 'logo' | 'favicon' | 'leadership' | 'banners' | 'firm';
  description: string;
  url: string;
  dimensions?: string;
  recommendedAspect?: string;
  updatedAt: string;
}

export interface MediaSettings {
  headerLogo: string;
  footerLogo: string;
  favicon: string;
  founderPhoto: string;
  officePhoto: string;
  heroBadge: string;
  aboutBanner: string;
  customMedia: ManagedMedia[];
  lastSavedAt?: string;
}

const MEDIA_STORAGE_KEY = 'panjiyar_media_settings_v5';

// Default initial system assets
export const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
  headerLogo: '/icai-emblem.svg',
  footerLogo: '/icai-emblem.svg',
  favicon: '/icai-emblem.svg',
  founderPhoto: '',
  officePhoto: '',
  heroBadge: '/icai-emblem.svg',
  aboutBanner: '',
  customMedia: [
    {
      id: 'header-logo',
      name: 'Main Company / Header Logo',
      category: 'logo',
      description: 'The primary emblem displayed on the top sticky navigation header and mobile drawer.',
      url: '/icai-emblem.svg',
      recommendedAspect: 'Square (1:1) or Horizontal (SVG/PNG/WebP)',
      dimensions: 'SVG / High-Res Vector',
      updatedAt: 'Default Firm Asset'
    },
    {
      id: 'footer-logo',
      name: 'Footer Brand Logo',
      category: 'logo',
      description: 'The emblem displayed inside the dark navy global footer (#031C3D).',
      url: '/icai-emblem.svg',
      recommendedAspect: 'Square (1:1) or Horizontal (SVG/PNG/WebP)',
      dimensions: 'SVG / High-Res Vector',
      updatedAt: 'Default Firm Asset'
    },
    {
      id: 'website-favicon',
      name: 'Browser Tab Favicon',
      category: 'favicon',
      description: 'The icon shown in browser tabs, bookmarks, and mobile home screen shortcuts.',
      url: '/icai-emblem.svg',
      recommendedAspect: 'Square (1:1)',
      dimensions: 'SVG, ICO, or 32x32 / 64x64 PNG',
      updatedAt: 'Default ICAI Favicon'
    },
    {
      id: 'founder-photo',
      name: 'Founder Portrait / CA Crest',
      category: 'leadership',
      description: 'Portrait photo of CA Krishna Panjiyar featured in the Founder profile & About page.',
      url: '',
      recommendedAspect: 'Square portrait (1:1 or 4:5)',
      dimensions: '800 x 800 px recommended',
      updatedAt: 'Default Firm Crest'
    },
    {
      id: 'office-photo',
      name: 'Andheri West Office / Reception',
      category: 'firm',
      description: 'Photo of Shourie Complex office or executive conference room in Andheri.',
      url: '',
      recommendedAspect: '16:9 Landscape',
      dimensions: '1200 x 675 px recommended',
      updatedAt: 'Default Firm Skyline'
    },
    {
      id: 'hero-badge',
      name: 'Hero Visiting-Card Crest',
      category: 'banners',
      description: 'Emblem rendered inside the Hero visiting-card geometric container.',
      url: '/icai-emblem.svg',
      recommendedAspect: 'Square (1:1)',
      dimensions: 'Vector / High-Res',
      updatedAt: 'Default Firm Asset'
    },
    {
      id: 'about-banner',
      name: 'About Section Advisory Visual',
      category: 'banners',
      description: 'Secondary visual background or illustration used in firm presentation cards.',
      url: '',
      recommendedAspect: '16:9 or 4:3 Landscape',
      dimensions: '1000 x 600 px',
      updatedAt: 'Default Architecture'
    }
  ]
};

// Firestore document paths
const FIRESTORE_DOCS = {
  MAIN_SETTINGS: 'media_settings',
  SLOT_HEADER_LOGO: 'media_header_logo',
  SLOT_FOOTER_LOGO: 'media_footer_logo',
  SLOT_FAVICON: 'media_favicon',
  SLOT_FOUNDER_PHOTO: 'media_founder_photo',
  SLOT_OFFICE_PHOTO: 'media_office_photo',
  SLOT_HERO_BADGE: 'media_hero_badge',
  SLOT_ABOUT_BANNER: 'media_about_banner',
  SLOT_CUSTOM: 'media_custom_items'
};

interface MediaContextType {
  settings: MediaSettings;
  updateHeaderLogo: (url: string) => Promise<void>;
  updateFooterLogo: (url: string) => Promise<void>;
  updateFavicon: (url: string) => Promise<void>;
  updateFounderPhoto: (url: string) => Promise<void>;
  updateOfficePhoto: (url: string) => Promise<void>;
  updateHeroBadge: (url: string) => Promise<void>;
  updateAboutBanner: (url: string) => Promise<void>;
  updateMediaItem: (id: string, url: string) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;
  saveAllMediaSettings: (newSettings: MediaSettings) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => Promise<boolean>;
  isSyncing: boolean;
  cloudConnected: boolean;
  lastSyncTime: string | null;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

// Helper to dynamically update browser tab favicon link element
export const applyFaviconToDocument = (iconUrl: string) => {
  if (typeof document === 'undefined') return;
  try {
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconUrl;
  } catch (e) {
    console.warn('Failed applying favicon link element:', e);
  }
};

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<MediaSettings>(() => {
    try {
      const saved = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_MEDIA_SETTINGS,
          ...parsed,
          customMedia: Array.isArray(parsed.customMedia) ? parsed.customMedia : DEFAULT_MEDIA_SETTINGS.customMedia
        };
      }
    } catch (e) {
      console.warn('Failed reading media settings from cache:', e);
    }
    return DEFAULT_MEDIA_SETTINGS;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [cloudConnected, setCloudConnected] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Apply favicon to browser on mount and changes
  useEffect(() => {
    if (settings.favicon) {
      applyFaviconToDocument(settings.favicon);
    }
  }, [settings.favicon]);

  // Helper to persist to localStorage safely and notify tabs
  const persistLocally = useCallback((updated: MediaSettings) => {
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Local quota protection
    }
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('panjiyar_media_sync_channel');
        bc.postMessage({ type: 'MEDIA_UPDATE', payload: updated });
        bc.close();
      }
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('panjiyar_media_updated', { detail: updated }));
    }
  }, []);

  // Real-time synchronization across ALL devices and active users via Firestore onSnapshot
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // 1. Primary real-time listener: /site_content/media_settings
    const mainDocRef = doc(db, 'site_content', FIRESTORE_DOCS.MAIN_SETTINGS);
    const mainUnsub = onSnapshot(
      mainDocRef,
      (snapshot) => {
        setCloudConnected(true);
        if (snapshot.exists()) {
          const cloudData = snapshot.data() as Partial<MediaSettings>;
          setSettings((prev) => {
            const next: MediaSettings = {
              ...DEFAULT_MEDIA_SETTINGS,
              ...prev,
              ...cloudData,
              customMedia: Array.isArray(cloudData.customMedia) && cloudData.customMedia.length > 0
                ? cloudData.customMedia
                : prev.customMedia
            };
            persistLocally(next);
            if (next.favicon) {
              applyFaviconToDocument(next.favicon);
            }
            return next;
          });
          setLastSyncTime(new Date().toLocaleTimeString());
        }
      },
      (err) => {
        console.warn('Firestore real-time media listener warning:', err.message);
      }
    );
    unsubscribers.push(mainUnsub);

    // 2. Individual slot listeners for high resilience
    const listenToSlot = (
      docName: string,
      field: keyof Omit<MediaSettings, 'customMedia' | 'lastSavedAt'>
    ) => {
      const slotRef = doc(db, 'site_content', docName);
      const unsub = onSnapshot(
        slotRef,
        (snap) => {
          if (snap.exists()) {
            const d = snap.data();
            if (d && typeof d.url === 'string') {
              setSettings((prev) => {
                if (prev[field] === d.url) return prev;
                const next = { ...prev, [field]: d.url };
                persistLocally(next);
                if (field === 'favicon' && d.url) {
                  applyFaviconToDocument(d.url);
                }
                return next;
              });
              setLastSyncTime(new Date().toLocaleTimeString());
            }
          }
        },
        () => {}
      );
      unsubscribers.push(unsub);
    };

    listenToSlot(FIRESTORE_DOCS.SLOT_HEADER_LOGO, 'headerLogo');
    listenToSlot(FIRESTORE_DOCS.SLOT_FOOTER_LOGO, 'footerLogo');
    listenToSlot(FIRESTORE_DOCS.SLOT_FAVICON, 'favicon');
    listenToSlot(FIRESTORE_DOCS.SLOT_FOUNDER_PHOTO, 'founderPhoto');
    listenToSlot(FIRESTORE_DOCS.SLOT_OFFICE_PHOTO, 'officePhoto');
    listenToSlot(FIRESTORE_DOCS.SLOT_HERO_BADGE, 'heroBadge');
    listenToSlot(FIRESTORE_DOCS.SLOT_ABOUT_BANNER, 'aboutBanner');

    // 3. Cross-tab BroadcastChannel listener for local instantaneous refresh
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('panjiyar_media_sync_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'MEDIA_UPDATE' && event.data?.payload) {
            const incoming = event.data.payload;
            setSettings(incoming);
            if (incoming.favicon) {
              applyFaviconToDocument(incoming.favicon);
            }
          }
        };
      }
    } catch {}

    return () => {
      unsubscribers.forEach((u) => u());
      bc?.close();
    };
  }, [persistLocally]);

  // Central persistence method writing to BOTH media_settings and individual slot
  const persistMediaChange = useCallback(
    async (
      updatedFields: Partial<MediaSettings>,
      slotDocName?: string,
      slotUrl?: string
    ) => {
      setIsSyncing(true);
      const now = new Date().toISOString();
      const nextSettings: MediaSettings = {
        ...settings,
        ...updatedFields,
        lastSavedAt: now
      };

      // 1. Immediately update React state and local storage
      setSettings(nextSettings);
      persistLocally(nextSettings);

      if (nextSettings.favicon) {
        applyFaviconToDocument(nextSettings.favicon);
      }

      // 2. Persist to Cloud Firestore
      try {
        const promises: Promise<unknown>[] = [];

        // Save main media_settings doc (real-time broadcast across all devices)
        const mainDocRef = doc(db, 'site_content', FIRESTORE_DOCS.MAIN_SETTINGS);
        promises.push(setDoc(mainDocRef, nextSettings, { merge: true }));

        // Also save companion dedicated slot document
        if (slotDocName && slotUrl !== undefined) {
          const slotRef = doc(db, 'site_content', slotDocName);
          promises.push(setDoc(slotRef, { url: slotUrl, updatedAt: now }, { merge: true }));
        }

        await Promise.all(promises);
        setCloudConnected(true);
        setLastSyncTime(new Date().toLocaleTimeString());
      } catch (err: unknown) {
        console.error('Failed to write to Cloud Firestore:', err);
        throw err;
      } finally {
        setIsSyncing(false);
      }
    },
    [settings, persistLocally]
  );

  const updateHeaderLogo = async (url: string) => {
    const updatedCustom = settings.customMedia.map((m) =>
      m.id === 'header-logo' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    await persistMediaChange(
      { headerLogo: url, customMedia: updatedCustom },
      FIRESTORE_DOCS.SLOT_HEADER_LOGO,
      url
    );
  };

  const updateFooterLogo = async (url: string) => {
    const updatedCustom = settings.customMedia.map((m) =>
      m.id === 'footer-logo' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    await persistMediaChange(
      { footerLogo: url, customMedia: updatedCustom },
      FIRESTORE_DOCS.SLOT_FOOTER_LOGO,
      url
    );
  };

  const updateFavicon = async (url: string) => {
    const updatedCustom = settings.customMedia.map((m) =>
      m.id === 'website-favicon' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    await persistMediaChange(
      { favicon: url, customMedia: updatedCustom },
      FIRESTORE_DOCS.SLOT_FAVICON,
      url
    );
  };

  const updateFounderPhoto = async (url: string) => {
    const updatedCustom = settings.customMedia.map((m) =>
      m.id === 'founder-photo' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    await persistMediaChange(
      { founderPhoto: url, customMedia: updatedCustom },
      FIRESTORE_DOCS.SLOT_FOUNDER_PHOTO,
      url
    );
  };

  const updateOfficePhoto = async (url: string) => {
    const updatedCustom = settings.customMedia.map((m) =>
      m.id === 'office-photo' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    await persistMediaChange(
      { officePhoto: url, customMedia: updatedCustom },
      FIRESTORE_DOCS.SLOT_OFFICE_PHOTO,
      url
    );
  };

  const updateHeroBadge = async (url: string) => {
    const updatedCustom = settings.customMedia.map((m) =>
      m.id === 'hero-badge' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    await persistMediaChange(
      { heroBadge: url, customMedia: updatedCustom },
      FIRESTORE_DOCS.SLOT_HERO_BADGE,
      url
    );
  };

  const updateAboutBanner = async (url: string) => {
    const updatedCustom = settings.customMedia.map((m) =>
      m.id === 'about-banner' ? { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : m
    );
    await persistMediaChange(
      { aboutBanner: url, customMedia: updatedCustom },
      FIRESTORE_DOCS.SLOT_ABOUT_BANNER,
      url
    );
  };

  const updateMediaItem = async (id: string, url: string) => {
    if (id === 'header-logo') return updateHeaderLogo(url);
    if (id === 'footer-logo') return updateFooterLogo(url);
    if (id === 'website-favicon') return updateFavicon(url);
    if (id === 'founder-photo') return updateFounderPhoto(url);
    if (id === 'office-photo') return updateOfficePhoto(url);
    if (id === 'hero-badge') return updateHeroBadge(url);
    if (id === 'about-banner') return updateAboutBanner(url);

    let exists = false;
    const updatedCustom = settings.customMedia.map((m) => {
      if (m.id === id) {
        exists = true;
        return { ...m, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() };
      }
      return m;
    });

    if (!exists) {
      updatedCustom.push({
        id,
        name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        category: 'banners',
        description: 'Uploaded custom media asset',
        url,
        updatedAt: 'Added ' + new Date().toLocaleDateString()
      });
    }

    await persistMediaChange({ customMedia: updatedCustom });
  };

  const deleteMediaItem = async (id: string) => {
    if (id === 'header-logo') return updateHeaderLogo('/icai-emblem.svg');
    if (id === 'footer-logo') return updateFooterLogo('/icai-emblem.svg');
    if (id === 'website-favicon') return updateFavicon('/icai-emblem.svg');
    if (id === 'founder-photo') return updateFounderPhoto('');
    if (id === 'office-photo') return updateOfficePhoto('');
    if (id === 'hero-badge') return updateHeroBadge('/icai-emblem.svg');
    if (id === 'about-banner') return updateAboutBanner('');

    const updatedCustom = settings.customMedia.filter((m) => m.id !== id);
    await persistMediaChange({ customMedia: updatedCustom });
  };

  const saveAllMediaSettings = async (newSettings: MediaSettings) => {
    await persistMediaChange(newSettings);
  };

  const resetToDefaults = async () => {
    await persistMediaChange(DEFAULT_MEDIA_SETTINGS);
  };

  const exportBackup = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importBackup = async (jsonStr: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        await persistMediaChange({
          ...DEFAULT_MEDIA_SETTINGS,
          ...parsed
        });
        return true;
      }
    } catch {}
    return false;
  };

  return (
    <MediaContext.Provider
      value={{
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
        saveAllMediaSettings,
        resetToDefaults,
        exportBackup,
        importBackup,
        isSyncing,
        cloudConnected,
        lastSyncTime
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
