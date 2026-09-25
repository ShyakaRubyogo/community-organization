import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CmsGlobalSettings } from '../types/cms';
import { defaultCmsGlobalSettings } from '../data/cmsSeedDefaults';
import { fetchPublishedSettings, checkCurrentAdmin, CmsAdminUser, logoutCmsAdmin } from '../lib/cmsClient';
import { useRouter } from './RouterContext';
import { isSupabaseConfigured } from '../lib/supabase';

interface CmsContextValue {
  settings: CmsGlobalSettings;
  adminUser: CmsAdminUser | null;
  isAdmin: boolean;
  isPreviewMode: boolean;
  isSupabaseConnected: boolean;
  refreshSettings: () => Promise<void>;
  togglePreviewMode: () => void;
  setAdminUser: (user: CmsAdminUser | null) => void;
  logoutAdmin: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue>({
  settings: defaultCmsGlobalSettings,
  adminUser: null,
  isAdmin: false,
  isPreviewMode: false,
  isSupabaseConnected: false,
  refreshSettings: async () => {},
  togglePreviewMode: () => {},
  setAdminUser: () => {},
  logoutAdmin: async () => {}
});

export const CmsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CmsGlobalSettings>(defaultCmsGlobalSettings);
  const [adminUser, setAdminUser] = useState<CmsAdminUser | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const { path, queryParams, navigate } = useRouter();

  const isSupabaseConnected = Boolean(isSupabaseConfigured);

  const refreshSettings = async () => {
    try {
      const data = await fetchPublishedSettings();
      setSettings(data);
    } catch {
      setSettings(defaultCmsGlobalSettings);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  // Check admin session from Supabase on mount
  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConnected) {
        const admin = await checkCurrentAdmin();
        if (admin) {
          setAdminUser(admin);
        }
      }
    }
    checkAuth();
  }, [isSupabaseConnected]);

  const logoutAdmin = async () => {
    setAdminUser(null);
    setIsPreviewMode(false);
    if (isSupabaseConnected) {
      await logoutCmsAdmin();
    }
  };

  // Sync preview query param with state
  useEffect(() => {
    const previewParam = queryParams.get('preview') === 'true';
    if (previewParam && adminUser) {
      setIsPreviewMode(true);
    } else {
      setIsPreviewMode(false);
    }
  }, [queryParams, adminUser]);

  // Dynamic theme, fonts, and styling effect
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const theme = settings.theme || ({} as any);

    // 1. Helper to safely inject Google Fonts
    const loadFont = (family?: string) => {
      if (!family) return;
      const clean = family.trim().replace(/['"]/g, '');
      if (!clean) return;
      const id = `gf-${clean.toLowerCase().replace(/\s+/g, '-')}`;
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${clean.replace(/\s+/g, '+')}:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap`;
      document.head.appendChild(link);
    };

    // 2. Font Pairing & Google Fonts
    const fontPair = theme.font_pairing || 'fraunces-karla';
    let displayFont = "'Fraunces', Georgia, serif";
    let bodyFont = "'Karla', sans-serif";

    if (fontPair === 'lora-inter') {
      loadFont('Lora');
      loadFont('Inter');
      displayFont = "'Lora', Georgia, serif";
      bodyFont = "'Inter', sans-serif";
    } else if (fontPair === 'cormorant-plusjakarta') {
      loadFont('Cormorant Garamond');
      loadFont('Plus Jakarta Sans');
      displayFont = "'Cormorant Garamond', Georgia, serif";
      bodyFont = "'Plus Jakarta Sans', sans-serif";
    } else if (fontPair === 'playfair-source') {
      loadFont('Playfair Display');
      loadFont('Source Sans 3');
      displayFont = "'Playfair Display', Georgia, serif";
      bodyFont = "'Source Sans 3', sans-serif";
    } else if (fontPair === 'merriweather-sans') {
      loadFont('Merriweather');
      loadFont('Open Sans');
      displayFont = "'Merriweather', Georgia, serif";
      bodyFont = "'Open Sans', sans-serif";
    } else if (fontPair === 'custom-google') {
      if (theme.custom_font_display) {
        loadFont(theme.custom_font_display);
        displayFont = `'${theme.custom_font_display.trim()}', Georgia, serif`;
      }
      if (theme.custom_font_body) {
        loadFont(theme.custom_font_body);
        bodyFont = `'${theme.custom_font_body.trim()}', sans-serif`;
      }
    }

    root.style.setProperty('--font-display', displayFont);
    root.style.setProperty('--font-body', bodyFont);

    // 3. Font Scale
    const scaleMap: Record<string, string> = {
      compact: '94%',
      normal: '100%',
      relaxed: '106%'
    };
    root.style.setProperty('--font-scale', scaleMap[theme.font_scale || 'normal'] || '100%');

    // 4. Base Palette Presets
    const basePalette = theme.base_theme || 'warm-botanical';
    if (basePalette === 'crisp-minimal') {
      root.style.setProperty('--color-bg-canvas', '#FFFFFF');
      root.style.setProperty('--color-surface', '#F9FAFB');
      root.style.setProperty('--color-primary', '#18181B');
    } else if (basePalette === 'warm-earth') {
      root.style.setProperty('--color-bg-canvas', '#FBF6EE');
      root.style.setProperty('--color-surface', '#FFFFFF');
      root.style.setProperty('--color-primary', '#7C3D26');
    } else if (basePalette === 'slate-pine') {
      root.style.setProperty('--color-bg-canvas', '#F3F6F5');
      root.style.setProperty('--color-surface', '#FFFFFF');
      root.style.setProperty('--color-primary', '#1E3A34');
    } else {
      // Default: warm-botanical
      root.style.setProperty('--color-bg-canvas', '#FAF7F0');
      root.style.setProperty('--color-surface', '#FFFFFF');
      root.style.setProperty('--color-primary', '#2C5745');
    }

    // 5. Accent Color & Contrast
    const accent = theme.color_accent || 'ember';
    const accentMap: Record<string, { display: string; hover: string; contrast: string }> = {
      ember: { display: '#EB7D00', hover: '#C86A00', contrast: '#211C0D' },
      ochre: { display: '#D49717', hover: '#B88010', contrast: '#211C0D' },
      terracotta: { display: '#C85A32', hover: '#A94420', contrast: '#FFFFFF' },
      sage: { display: '#3D785C', hover: '#2E5F48', contrast: '#FFFFFF' },
      ocean: { display: '#2563EB', hover: '#1D4ED8', contrast: '#FFFFFF' }
    };

    if (accent === 'custom' && theme.custom_accent_hex) {
      const hex = theme.custom_accent_hex.trim();
      const clean = hex.replace('#', '');
      let contrast = '#FFFFFF';
      if (clean.length === 6) {
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        contrast = yiq >= 140 ? '#211C0D' : '#FFFFFF';
      }
      root.style.setProperty('--color-accent', hex);
      root.style.setProperty('--color-accent-interactive', hex);
      root.style.setProperty('--color-accent-contrast', contrast);
    } else {
      const chosen = accentMap[accent] || accentMap.ember;
      root.style.setProperty('--color-accent', chosen.display);
      root.style.setProperty('--color-accent-interactive', chosen.hover);
      root.style.setProperty('--color-accent-contrast', chosen.contrast);
    }
  }, [settings.theme]);

  const togglePreviewMode = () => {
    if (!adminUser) return;
    const next = !isPreviewMode;
    setIsPreviewMode(next);
    const nextParams = new URLSearchParams(queryParams);
    if (next) {
      nextParams.set('preview', 'true');
    } else {
      nextParams.delete('preview');
    }
    const queryString = nextParams.toString();
    navigate(path + (queryString ? `?${queryString}` : ''));
  };

  return (
    <CmsContext.Provider
      value={{
        settings,
        adminUser,
        isAdmin: Boolean(adminUser),
        isPreviewMode,
        isSupabaseConnected,
        refreshSettings,
        togglePreviewMode,
        setAdminUser,
        logoutAdmin
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => useContext(CmsContext);
