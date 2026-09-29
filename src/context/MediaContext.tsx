import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ManagedMedia {
  id: string;
  name: string;
  category: 'logo' | 'leadership' | 'banners' | 'firm';
  description: string;
  url: string;
  dimensions?: string;
  recommendedAspect?: string;
  updatedAt: string;
}

export interface MediaSettings {
  headerLogo: string;
  footerLogo: string;
  founderPhoto: string;
  officePhoto: string;
  heroBadge: string;
  aboutBanner: string;
  customMedia: ManagedMedia[];
}

const MEDIA_STORAGE_KEY = 'panjiyar_media_settings_v1';

// Default initial system assets
const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
  headerLogo: '/icai-emblem.svg',
  footerLogo: '/icai-emblem.svg',
  founderPhoto: '', // Uses authentic ICAI insignia badge by default or custom uploaded photo
  officePhoto: '',
  heroBadge: '/icai-emblem.svg',
  aboutBanner: '',
  customMedia: [
    {
      id: 'header-logo',
      name: 'Main Company / Header Logo',
      category: 'logo',
      description: 'The primary emblem displayed on the top sticky navigation header.',
      url: '/icai-emblem.svg',
      recommendedAspect: 'Square (1:1) or Horizontal (SVG/PNG)',
      dimensions: 'SVG / High-Res',
      updatedAt: 'Default Firm Asset'
    },
    {
      id: 'footer-logo',
      name: 'Footer Brand Logo',
      category: 'logo',
      description: 'The emblem displayed inside the dark navy global footer.',
      url: '/icai-emblem.svg',
      recommendedAspect: 'Square (1:1) or Horizontal (SVG/PNG)',
      dimensions: 'SVG / High-Res',
      updatedAt: 'Default Firm Asset'
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
    }
  ]
};

interface MediaContextType {
  settings: MediaSettings;
  updateHeaderLogo: (url: string) => void;
  updateFooterLogo: (url: string) => void;
  updateFounderPhoto: (url: string) => void;
  updateOfficePhoto: (url: string) => void;
  updateMediaItem: (id: string, url: string) => void;
  resetToDefaults: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

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

  const saveSettings = (newSettings: MediaSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(newSettings));
      // Dispatch storage event so other tabs or listeners re-render
      window.dispatchEvent(new Event('storage'));
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
    let founderPhoto = settings.founderPhoto;
    let officePhoto = settings.officePhoto;
    let heroBadge = settings.heroBadge;

    if (id === 'header-logo') headerLogo = url;
    if (id === 'footer-logo') footerLogo = url;
    if (id === 'founder-photo') founderPhoto = url;
    if (id === 'office-photo') officePhoto = url;
    if (id === 'hero-badge') heroBadge = url;

    saveSettings({
      ...settings,
      headerLogo,
      footerLogo,
      founderPhoto,
      officePhoto,
      heroBadge,
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
