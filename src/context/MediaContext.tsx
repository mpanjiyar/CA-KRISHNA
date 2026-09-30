import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
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

const MEDIA_STORAGE_KEY = 'panjiyar_media_settings_v3';

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
          customMedia: parsed.customMedia || DEFAULT_MEDIA_SETTINGS.customMedia
        };
      }
    } catch (e) {
      console.warn('Failed reading media settings from cache:', e);
    }
    return DEFAULT_MEDIA_SETTINGS;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [cloudConnected, setCloudConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Apply favicon to browser on mount and changes
  useEffect(() => {
    if (settings.favicon) {
      applyFaviconToDocument(settings.favicon);
    }
  }, [settings.favicon]);

  // Real-time synchronization across all devices and active users via Firestore onSnapshot
  useEffect(() => {
    const docRef = doc(db, 'site_content', 'media_settings');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setCloudConnected(true);
        if (snapshot.exists()) {
          const cloudData = snapshot.data() as Partial<MediaSettings>;
          setSettings((prev) => {
            const merged: MediaSettings = {
              ...DEFAULT_MEDIA_SETTINGS,
              ...prev,
              ...cloudData,
              customMedia: cloudData.customMedia || prev.customMedia || DEFAULT_MEDIA_SETTINGS.customMedia
            };
            try {
              localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // Local storage failover
            }
            if (merged.favicon) {
              applyFaviconToDocument(merged.favicon);
            }
            return merged;
          });
          setLastSyncTime(new Date().toLocaleTimeString());
        }
      },
      (error) => {
        console.warn('Firestore real-time media listener notice:', error.message);
        setCloudConnected(false);
      }
    );

    // Cross-tab broadcast listener
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
    } catch {
      // Ignored
    }

    return () => {
      unsubscribe();
      bc?.close();
    };
  }, []);

  // Central persistence handler (Cloud Firestore + Local Storage + BroadcastChannel)
  const saveSettings = useCallback(async (newSettings: MediaSettings) => {
    setIsSyncing(true);
    const stampedSettings = {
      ...newSettings,
      lastSavedAt: new Date().toISOString()
    };

    setSettings(stampedSettings);
    if (stampedSettings.favicon) {
      applyFaviconToDocument(stampedSettings.favicon);
    }

    // 1. Save to local storage for immediate persistence
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(stampedSettings));
    } catch (err) {
      console.warn('LocalStorage quota warning (handled via cloud):', err);
    }

    // 2. Broadcast immediately to all other local tabs
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('panjiyar_media_sync_channel');
        bc.postMessage({ type: 'MEDIA_UPDATE', payload: stampedSettings });
        bc.close();
      }
    } catch {
      // Ignored
    }
    window.dispatchEvent(new CustomEvent('panjiyar_media_updated', { detail: stampedSettings }));

    // 3. Save to Cloud Firestore for real-time synchronization across ALL devices & users
    try {
      const docRef = doc(db, 'site_content', 'media_settings');
      await setDoc(docRef, stampedSettings, { merge: true });
      setCloudConnected(true);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (cloudErr) {
      console.warn('Could not sync to cloud Firestore immediately:', cloudErr);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const updateHeaderLogo = async (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'header-logo' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    await saveSettings({
      ...settings,
      headerLogo: url,
      customMedia: updatedCustom
    });
  };

  const updateFooterLogo = async (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'footer-logo' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    await saveSettings({
      ...settings,
      footerLogo: url,
      customMedia: updatedCustom
    });
  };

  const updateFavicon = async (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'website-favicon' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    await saveSettings({
      ...settings,
      favicon: url,
      customMedia: updatedCustom
    });
  };

  const updateFounderPhoto = async (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'founder-photo' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    await saveSettings({
      ...settings,
      founderPhoto: url,
      customMedia: updatedCustom
    });
  };

  const updateOfficePhoto = async (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'office-photo' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    await saveSettings({
      ...settings,
      officePhoto: url,
      customMedia: updatedCustom
    });
  };

  const updateHeroBadge = async (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'hero-badge' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    await saveSettings({
      ...settings,
      heroBadge: url,
      customMedia: updatedCustom
    });
  };

  const updateAboutBanner = async (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'about-banner' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    await saveSettings({
      ...settings,
      aboutBanner: url,
      customMedia: updatedCustom
    });
  };

  const updateMediaItem = async (id: string, url: string) => {
    let exists = false;
    const updatedCustom = settings.customMedia.map((item) => {
      if (item.id === id) {
        exists = true;
        return { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() };
      }
      return item;
    });

    if (!exists) {
      updatedCustom.push({
        id,
        name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        category: 'banners',
        description: 'Uploaded media asset',
        url,
        updatedAt: 'Added ' + new Date().toLocaleDateString()
      });
    }

    let headerLogo = settings.headerLogo;
    let footerLogo = settings.footerLogo;
    let favicon = settings.favicon;
    let founderPhoto = settings.founderPhoto;
    let officePhoto = settings.officePhoto;
    let heroBadge = settings.heroBadge;
    let aboutBanner = settings.aboutBanner;

    if (id === 'header-logo') headerLogo = url;
    if (id === 'footer-logo') footerLogo = url;
    if (id === 'website-favicon') favicon = url;
    if (id === 'founder-photo') founderPhoto = url;
    if (id === 'office-photo') officePhoto = url;
    if (id === 'hero-badge') heroBadge = url;
    if (id === 'about-banner') aboutBanner = url;

    await saveSettings({
      ...settings,
      headerLogo,
      footerLogo,
      favicon,
      founderPhoto,
      officePhoto,
      heroBadge,
      aboutBanner,
      customMedia: updatedCustom
    });
  };

  const deleteMediaItem = async (id: string) => {
    // If it's one of the core slots, reset to blank or default
    let headerLogo = settings.headerLogo;
    let footerLogo = settings.footerLogo;
    let favicon = settings.favicon;
    let founderPhoto = settings.founderPhoto;
    let officePhoto = settings.officePhoto;
    let heroBadge = settings.heroBadge;
    let aboutBanner = settings.aboutBanner;

    if (id === 'header-logo') headerLogo = '/icai-emblem.svg';
    if (id === 'footer-logo') footerLogo = '/icai-emblem.svg';
    if (id === 'website-favicon') favicon = '/icai-emblem.svg';
    if (id === 'founder-photo') founderPhoto = '';
    if (id === 'office-photo') officePhoto = '';
    if (id === 'hero-badge') heroBadge = '/icai-emblem.svg';
    if (id === 'about-banner') aboutBanner = '';

    const updatedCustom = settings.customMedia.filter((item) => item.id !== id);

    await saveSettings({
      ...settings,
      headerLogo,
      footerLogo,
      favicon,
      founderPhoto,
      officePhoto,
      heroBadge,
      aboutBanner,
      customMedia: updatedCustom
    });
  };

  const resetToDefaults = async () => {
    await saveSettings(DEFAULT_MEDIA_SETTINGS);
  };

  const exportBackup = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importBackup = async (jsonStr: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        await saveSettings({
          ...DEFAULT_MEDIA_SETTINGS,
          ...parsed
        });
        return true;
      }
    } catch {
      // Invalid JSON
    }
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
        saveAllMediaSettings: saveSettings,
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
