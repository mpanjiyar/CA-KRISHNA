import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const MEDIA_STORAGE_KEY = 'panjiyar_media_settings_v2';

// Default initial system assets
const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
  headerLogo: '/icai-emblem.svg',
  footerLogo: '/icai-emblem.svg',
  favicon: '/icai-emblem.svg',
  founderPhoto: '', // Uses authentic ICAI insignia badge by default or custom uploaded photo
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
      recommendedAspect: 'Square (1:1) or Horizontal (SVG/PNG)',
      dimensions: 'SVG / High-Res Vector',
      updatedAt: 'Default Firm Asset'
    },
    {
      id: 'footer-logo',
      name: 'Footer Brand Logo',
      category: 'logo',
      description: 'The emblem displayed inside the dark navy global footer (#031C3D).',
      url: '/icai-emblem.svg',
      recommendedAspect: 'Square (1:1) or Horizontal (SVG/PNG)',
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
  updateHeaderLogo: (url: string) => void;
  updateFooterLogo: (url: string) => void;
  updateFavicon: (url: string) => void;
  updateFounderPhoto: (url: string) => void;
  updateOfficePhoto: (url: string) => void;
  updateMediaItem: (id: string, url: string) => void;
  resetToDefaults: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

// Helper to dynamically update browser tab favicon link element
const applyFaviconToDocument = (iconUrl: string) => {
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
      console.warn('Failed reading media settings:', e);
    }
    return DEFAULT_MEDIA_SETTINGS;
  });

  // Apply favicon to browser on mount and changes
  useEffect(() => {
    if (settings.favicon) {
      applyFaviconToDocument(settings.favicon);
    }
  }, [settings.favicon]);

  // Real-time synchronization across all tabs, windows, and active sessions
  useEffect(() => {
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
      // Fallback to storage event
    }

    const syncFromStorage = () => {
      try {
        const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSettings({
            ...DEFAULT_MEDIA_SETTINGS,
            ...parsed,
            customMedia: parsed.customMedia || DEFAULT_MEDIA_SETTINGS.customMedia
          });
          if (parsed.favicon) {
            applyFaviconToDocument(parsed.favicon);
          }
        }
      } catch (err) {
        console.warn('Storage sync error:', err);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === MEDIA_STORAGE_KEY && e.newValue) {
        syncFromStorage();
      }
    };

    // Auto-sync when tab gains focus or user returns to page
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', syncFromStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    // Heartbeat check every 3s to guarantee background sync
    const interval = setInterval(syncFromStorage, 3000);

    return () => {
      bc?.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', syncFromStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  const saveSettings = (newSettings: MediaSettings) => {
    setSettings(newSettings);
    if (newSettings.favicon) {
      applyFaviconToDocument(newSettings.favicon);
    }
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(newSettings));
      
      // 1. Broadcast via BroadcastChannel
      try {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('panjiyar_media_sync_channel');
          bc.postMessage({ type: 'MEDIA_UPDATE', payload: newSettings });
          bc.close();
        }
      } catch {
        // Fallback
      }

      // 2. Broadcast via window DOM events
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('panjiyar_media_updated', { detail: newSettings }));
    } catch (e) {
      console.error('Failed to store media settings in localStorage:', e);
    }
  };

  const updateHeaderLogo = (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'header-logo' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    saveSettings({
      ...settings,
      headerLogo: url,
      customMedia: updatedCustom
    });
  };

  const updateFooterLogo = (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'footer-logo' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    saveSettings({
      ...settings,
      footerLogo: url,
      customMedia: updatedCustom
    });
  };

  const updateFavicon = (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'website-favicon' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    saveSettings({
      ...settings,
      favicon: url,
      customMedia: updatedCustom
    });
  };

  const updateFounderPhoto = (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'founder-photo' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    saveSettings({
      ...settings,
      founderPhoto: url,
      customMedia: updatedCustom
    });
  };

  const updateOfficePhoto = (url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === 'office-photo' ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    saveSettings({
      ...settings,
      officePhoto: url,
      customMedia: updatedCustom
    });
  };

  const updateMediaItem = (id: string, url: string) => {
    const updatedCustom = settings.customMedia.map((item) =>
      item.id === id ? { ...item, url, updatedAt: 'Updated ' + new Date().toLocaleDateString() } : item
    );
    
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

    saveSettings({
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

  const resetToDefaults = () => {
    saveSettings(DEFAULT_MEDIA_SETTINGS);
  };

  const exportBackup = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importBackup = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        saveSettings({
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
        updateMediaItem,
        resetToDefaults,
        exportBackup,
        importBackup
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
