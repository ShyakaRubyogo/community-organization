import React, { useState, useEffect } from 'react';
import { CmsGlobalSettings, CmsNavLink, CmsImageField } from '../../types/cms';
import { defaultCmsGlobalSettings } from '../../data/cmsSeedDefaults';
import { getAdminSettings, saveDraftSettings, publishSettings } from '../../lib/cmsClient';
import { useCms } from '../../context/CmsContext';
import { Button } from '../common/Button';
import { ImageFieldInput } from './ImageFieldInput';
import {
  Plus,
  Trash2,
  Check,
  Sparkles,
  Globe,
  Compass,
  Palette,
  Send,
  TreePine,
  Leaf,
  Sprout,
  Sun,
  Heart,
  Mountain,
  Type,
  Bell
} from 'lucide-react';

export const SettingsEditor: React.FC = () => {
  const { refreshSettings } = useCms();
  const [draft, setDraft] = useState<CmsGlobalSettings>(defaultCmsGlobalSettings);
  const [published, setPublished] = useState<CmsGlobalSettings>(defaultCmsGlobalSettings);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load from Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAdminSettings();
      // Merge with defaults to ensure any missing fields are safely populated
      setDraft({
        ...defaultCmsGlobalSettings,
        ...res.draft_content,
        theme: {
          ...defaultCmsGlobalSettings.theme,
          ...(res.draft_content?.theme || {})
        }
      });
      setPublished(res.published_content);
      setLastPublishedAt(res.last_published_at || null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not load settings from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Debounced auto-save to draft_content
  useEffect(() => {
    if (loading) return;

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await saveDraftSettings(draft);
        setSaveStatus('saved');
      } catch (err: any) {
        setSaveStatus('error');
        setErrorMessage(err.message || 'Failed to auto-save draft.');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [draft]);

  const handlePublish = async () => {
    try {
      setPublishStatus('publishing');
      const publishedTime = await publishSettings();
      setLastPublishedAt(publishedTime);
      setPublished(draft);
      setPublishStatus('published');
      await refreshSettings();
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err: any) {
      setPublishStatus('idle');
      alert(`Publishing failed: ${err.message}`);
    }
  };

  // Nav link helpers
  const updateNavLink = (index: number, field: keyof CmsNavLink, val: string) => {
    const next = [...draft.navigation_links];
    next[index] = { ...next[index], [field]: val };
    setDraft({ ...draft, navigation_links: next });
  };

  const addNavLink = () => {
    const id = `nav-${Date.now()}`;
    setDraft({
      ...draft,
      navigation_links: [...draft.navigation_links, { id, label: 'New Link', href: '/' }]
    });
  };

  const removeNavLink = (index: number) => {
    setDraft({
      ...draft,
      navigation_links: draft.navigation_links.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#6B6350]">Loading settings...</div>;
  }

  const logoType = draft.logo_type || 'icon';
  const logoIcon = draft.logo_icon || 'TreePine';

  const iconOptions: { id: typeof logoIcon; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'TreePine', label: 'Pine Tree', icon: TreePine },
    { id: 'Leaf', label: 'Leaf', icon: Leaf },
    { id: 'Sprout', label: 'Sprout', icon: Sprout },
    { id: 'Sun', label: 'Sun', icon: Sun },
    { id: 'Heart', label: 'Heart', icon: Heart },
    { id: 'Globe', label: 'Globe', icon: Globe },
    { id: 'Mountain', label: 'Mountain', icon: Mountain }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DCC8]">
        <div>
          <h1 className="font-['Fraunces'] font-semibold text-2xl text-[#211C0D]">
            Global Site Settings & Branding
          </h1>
          <p className="font-['Karla'] text-xs text-[#6B6350] mt-1">
            Intuitive controls for logo, brand name, navigation labels, typography, and color palette.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-medium">
            {saveStatus === 'saving' && <span className="text-amber-700">Auto-saving draft...</span>}
            {saveStatus === 'saved' && <span className="text-emerald-700 font-semibold">● Draft saved</span>}
            {saveStatus === 'error' && <span className="text-red-600">Save failed</span>}
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handlePublish}
            disabled={publishStatus === 'publishing'}
            className="flex items-center gap-2 shadow-xs"
          >
            {publishStatus === 'publishing' ? (
              'Publishing...'
            ) : publishStatus === 'published' ? (
              <>
                <Check className="w-4 h-4" /> Published!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Publish Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {lastPublishedAt && (
        <div className="text-xs text-[#6B6350] bg-[#FAF7F0] px-4 py-2 rounded-lg border border-[#E4DCC8]/60 flex items-center justify-between">
          <span>Live published version active</span>
          <span>Last published: {new Date(lastPublishedAt).toLocaleString()}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
          {errorMessage}
        </div>
      )}

      {/* SECTION 1: BRAND IDENTITY & NAVBAR LOGO */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-5">
        <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#2C5745]" /> Brand Identity & Navbar Logo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Organization Brand Name
            </label>
            <input
              type="text"
              value={draft.brand_name}
              onChange={(e) => setDraft({ ...draft, brand_name: e.target.value })}
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D] focus:outline-none focus:ring-1 focus:ring-[#2C5745]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Core Tagline
            </label>
            <input
              type="text"
              value={draft.tagline}
              onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D] focus:outline-none focus:ring-1 focus:ring-[#2C5745]"
            />
          </div>
        </div>

        {/* Logo Format Selector */}
        <div className="pt-3 border-t border-[#E4DCC8] space-y-3">
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider">
            Navbar Logo Presentation
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'icon', label: 'Curated Icon + Name', desc: 'Symbol badge next to brand name' },
              { id: 'image', label: 'Custom Logo Image', desc: 'Upload or link your organization logo' },
              { id: 'text', label: 'Typographic Text', desc: 'Clean brand title alone' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDraft({ ...draft, logo_type: opt.id as any })}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  logoType === opt.id
                    ? 'border-[#2C5745] bg-[#2C5745]/5 ring-1 ring-[#2C5745]'
                    : 'border-[#E4DCC8] hover:bg-[#FAF7F0]'
                }`}
              >
                <div className="text-xs font-semibold text-[#211C0D]">{opt.label}</div>
                <div className="text-[11px] text-[#6B6350] mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>

          {/* Option A: Curated Icon Picker */}
          {logoType === 'icon' && (
            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E4DCC8] space-y-2">
              <span className="text-xs font-medium text-[#4A4437]">Select Nature Symbol:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {iconOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = logoIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDraft({ ...draft, logo_icon: item.id })}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#2C5745] text-[#FAF7F0] border-[#2C5745] shadow-xs'
                          : 'bg-[#FFFFFF] text-[#211C0D] border-[#E4DCC8] hover:border-[#2C5745]/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Option B: Custom Image Logo */}
          {logoType === 'image' && (
            <div className="space-y-2">
              <ImageFieldInput
                label="Organization Logo Image"
                value={
                  draft.logo_image || {
                    url: '',
                    alt_text: `${draft.brand_name} logo`
                  }
                }
                onChange={(val) => setDraft({ ...draft, logo_image: val })}
                helperText="Provide a transparent PNG or SVG logo. Appears in the top navbar at 36px height."
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: NAVIGATION & CTA */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#2C5745]" /> Primary Header Navigation
            </h2>
            <p className="text-xs text-[#6B6350] mt-0.5">
              Easily rename labels (e.g. change "About" to "Team") without touching routes or code.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={addNavLink} className="flex items-center gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Link
          </Button>
        </div>

        <div className="space-y-2.5">
          {draft.navigation_links.map((link, idx) => (
            <div key={link.id || idx} className="flex items-center gap-3 p-2.5 bg-[#FAF7F0] rounded-lg border border-[#E4DCC8]/70">
              <div className="w-24 sm:w-32 shrink-0">
                <span className="text-[11px] font-semibold text-[#9C8B5E] uppercase block mb-0.5">
                  Label
                </span>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateNavLink(idx, 'label', e.target.value)}
                  placeholder="e.g. Team"
                  className="w-full text-sm px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D] font-medium"
                />
              </div>

              <div className="flex-1">
                <span className="text-[11px] font-semibold text-[#9C8B5E] uppercase block mb-0.5">
                  Target Route
                </span>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateNavLink(idx, 'href', e.target.value)}
                  placeholder="/about"
                  className="w-full text-sm px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => removeNavLink(idx)}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                  title="Remove Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Header CTA Button */}
        <div className="pt-4 border-t border-[#E4DCC8] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Header CTA Label
            </label>
            <input
              type="text"
              value={draft.header_cta?.label || ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  header_cta: { ...draft.header_cta, label: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Header CTA URL
            </label>
            <input
              type="text"
              value={draft.header_cta?.href || ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  header_cta: { ...draft.header_cta, href: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="cta-vis"
              checked={draft.header_cta?.is_visible ?? true}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  header_cta: { ...draft.header_cta, is_visible: e.target.checked }
                })
              }
              className="rounded text-[#2C5745] focus:ring-[#2C5745] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="cta-vis" className="text-xs font-medium text-[#211C0D] cursor-pointer">
              Show CTA button in navbar
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 3: TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2C5745]" /> Top Announcement Banner
          </h2>
          <label className="flex items-center gap-2 text-xs font-medium text-[#211C0D] cursor-pointer">
            <input
              type="checkbox"
              checked={draft.announcement_bar?.is_enabled ?? false}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  announcement_bar: {
                    text: draft.announcement_bar?.text || '🌱 Welcome to our community alliance!',
                    link_label: draft.announcement_bar?.link_label || 'Learn more →',
                    link_href: draft.announcement_bar?.link_href || '/initiatives',
                    is_enabled: e.target.checked
                  }
                })
              }
              className="rounded text-[#2C5745] focus:ring-[#2C5745] w-4 h-4 cursor-pointer"
            />
            <span>Enable banner on public site</span>
          </label>
        </div>

        {draft.announcement_bar?.is_enabled && (
          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E4DCC8] space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Banner Message Text
              </label>
              <input
                type="text"
                value={draft.announcement_bar?.text || ''}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    announcement_bar: { ...draft.announcement_bar!, text: e.target.value }
                  })
                }
                placeholder="e.g. Spring Neighborhood Tree Planting Day is Saturday, April 18th!"
                className="w-full text-sm px-3 py-2 bg-[#FFFFFF] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                  Optional Link Label
                </label>
                <input
                  type="text"
                  value={draft.announcement_bar?.link_label || ''}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      announcement_bar: { ...draft.announcement_bar!, link_label: e.target.value }
                    })
                  }
                  placeholder="Learn more →"
                  className="w-full text-sm px-3 py-2 bg-[#FFFFFF] border border-[#E4DCC8] rounded-md text-[#211C0D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                  Target Route / URL
                </label>
                <input
                  type="text"
                  value={draft.announcement_bar?.link_href || ''}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      announcement_bar: { ...draft.announcement_bar!, link_href: e.target.value }
                    })
                  }
                  placeholder="/initiatives"
                  className="w-full text-sm px-3 py-2 bg-[#FFFFFF] border border-[#E4DCC8] rounded-md text-[#211C0D]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: THEME, FONTS & ACCENTS */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#2C5745]" /> Curated Theme & Visual Styling
          </h2>
          <p className="text-xs text-[#6B6350] mt-0.5">
            Balanced typography pairings and coherent palettes that protect readability while matching your brand.
          </p>
        </div>

        {/* 1. Base Palette Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider">
            Base Canvas & Tone Palette
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'warm-botanical',
                name: 'Warm Botanical',
                desc: 'Cream canvas & forest green (Default)',
                bg: '#FAF7F0',
                primary: '#2C5745'
              },
              {
                id: 'crisp-minimal',
                name: 'Crisp Minimalist',
                desc: 'Pure white & modern charcoal',
                bg: '#FFFFFF',
                primary: '#18181B'
              },
              {
                id: 'warm-earth',
                name: 'Sand & Terracotta',
                desc: 'Soft linen & fired clay',
                bg: '#FBF6EE',
                primary: '#7C3D26'
              },
              {
                id: 'slate-pine',
                name: 'Slate & Pine',
                desc: 'Cool mist & deep evergreen',
                bg: '#F3F6F5',
                primary: '#1E3A34'
              }
            ].map((p) => {
              const isSelected = (draft.theme?.base_theme || 'warm-botanical') === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      theme: { ...draft.theme, base_theme: p.id as any }
                    })
                  }
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#2C5745] bg-[#2C5745]/5 ring-1 ring-[#2C5745]'
                      : 'border-[#E4DCC8] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: p.bg }}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: p.primary }}
                    />
                  </div>
                  <div className="text-xs font-semibold text-[#211C0D]">{p.name}</div>
                  <div className="text-[11px] text-[#6B6350] mt-0.5">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Brand Accent Color with Custom Hex Support */}
        <div className="space-y-3 pt-4 border-t border-[#E4DCC8]">
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider">
            Primary Brand Accent Color
          </label>
          <div className="flex flex-wrap gap-2.5 items-center">
            {[
              { id: 'ember', label: 'Ember Orange', hex: '#EB7D00' },
              { id: 'ochre', label: 'Golden Ochre', hex: '#D49717' },
              { id: 'terracotta', label: 'Terracotta', hex: '#C85A32' },
              { id: 'sage', label: 'Pine Sage', hex: '#3D785C' },
              { id: 'ocean', label: 'Ocean Slate', hex: '#2563EB' }
            ].map((swatch) => {
              const isSelected = draft.theme?.color_accent === swatch.id;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      theme: { ...draft.theme, color_accent: swatch.id as any }
                    })
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#211C0D] bg-white ring-2 ring-[#211C0D]/20 shadow-xs font-semibold'
                      : 'border-[#E4DCC8] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span>{swatch.label}</span>
                </button>
              );
            })}

            {/* Custom Hex Option */}
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  theme: {
                    ...draft.theme,
                    color_accent: 'custom',
                    custom_accent_hex: draft.theme?.custom_accent_hex || '#EB7D00'
                  }
                })
              }
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all ${
                draft.theme?.color_accent === 'custom'
                  ? 'border-[#211C0D] bg-white ring-2 ring-[#211C0D]/20 shadow-xs font-semibold'
                  : 'border-[#E4DCC8] hover:bg-[#FAF7F0]'
              }`}
            >
              <span className="text-xs">🎨 Custom Hex</span>
            </button>
          </div>

          {draft.theme?.color_accent === 'custom' && (
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E4DCC8] flex items-center gap-4 max-w-sm">
              <input
                type="color"
                value={draft.theme?.custom_accent_hex || '#EB7D00'}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    theme: { ...draft.theme, custom_accent_hex: e.target.value }
                  })
                }
                className="w-10 h-10 rounded border border-[#E4DCC8] cursor-pointer p-0.5 bg-white"
              />
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-[#6B6350] uppercase block">
                  Brand Hex Code
                </label>
                <input
                  type="text"
                  value={draft.theme?.custom_accent_hex || '#EB7D00'}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      theme: { ...draft.theme, custom_accent_hex: e.target.value }
                    })
                  }
                  placeholder="#EB7D00"
                  className="text-xs px-2 py-1 bg-white border border-[#E4DCC8] rounded w-full font-mono uppercase"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Typography Pairings & Custom Google Font */}
        <div className="space-y-3 pt-4 border-t border-[#E4DCC8]">
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider">
            Typography Pairing (Headlines + Body)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'fraunces-karla', label: 'Fraunces & Karla', desc: 'Soft-serif display + clean humanist sans (Default)' },
              { id: 'lora-inter', label: 'Lora & Inter', desc: 'Editorial literary serif + high-legibility geometric sans' },
              { id: 'cormorant-plusjakarta', label: 'Cormorant & Plus Jakarta', desc: 'Heritage elegant serif + modern clean sans' },
              { id: 'playfair-source', label: 'Playfair Display & Source Sans', desc: 'High-contrast boutique display + clean body' },
              { id: 'merriweather-sans', label: 'Merriweather & Open Sans', desc: 'Sturdy warm serif + versatile open sans' },
              { id: 'custom-google', label: 'Custom Google Font', desc: 'Specify any Google Font family names' }
            ].map((pairing) => (
              <label
                key={pairing.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  draft.theme?.font_pairing === pairing.id
                    ? 'border-[#2C5745] bg-[#2C5745]/5 ring-1 ring-[#2C5745]'
                    : 'border-[#E4DCC8] hover:bg-[#FAF7F0]'
                }`}
              >
                <input
                  type="radio"
                  name="font-pair"
                  checked={draft.theme?.font_pairing === pairing.id}
                  onChange={() =>
                    setDraft({
                      ...draft,
                      theme: { ...draft.theme, font_pairing: pairing.id as any }
                    })
                  }
                  className="mt-1 text-[#2C5745] focus:ring-[#2C5745]"
                />
                <div>
                  <div className="text-xs font-semibold text-[#211C0D]">{pairing.label}</div>
                  <div className="text-[11px] text-[#6B6350]">{pairing.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {draft.theme?.font_pairing === 'custom-google' && (
            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E4DCC8] space-y-3">
              <div className="text-xs text-[#6B6350]">
                Enter any public Google Font family name. The site will automatically inject and apply it.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#211C0D] uppercase mb-1">
                    Display / Headline Font
                  </label>
                  <input
                    type="text"
                    value={draft.theme?.custom_font_display || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        theme: { ...draft.theme, custom_font_display: e.target.value }
                      })
                    }
                    placeholder="e.g. Outfit, Cinzel, Space Grotesk"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E4DCC8] rounded text-[#211C0D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#211C0D] uppercase mb-1">
                    Body / Paragraph Font
                  </label>
                  <input
                    type="text"
                    value={draft.theme?.custom_font_body || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        theme: { ...draft.theme, custom_font_body: e.target.value }
                      })
                    }
                    placeholder="e.g. Work Sans, DM Sans, Plus Jakarta Sans"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E4DCC8] rounded text-[#211C0D]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Font Sizing Scale */}
        <div className="space-y-2 pt-4 border-t border-[#E4DCC8]">
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider">
            Overall Font Sizing Scale
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'compact', label: 'Compact', desc: '94% base scale (Denser fit)' },
              { id: 'normal', label: 'Balanced', desc: '100% standard (Default)' },
              { id: 'relaxed', label: 'Relaxed', desc: '106% base scale (Larger text)' }
            ].map((scale) => {
              const isSelected = (draft.theme?.font_scale || 'normal') === scale.id;
              return (
                <button
                  key={scale.id}
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      theme: { ...draft.theme, font_scale: scale.id as any }
                    })
                  }
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#2C5745] bg-[#2C5745]/5 ring-1 ring-[#2C5745]'
                      : 'border-[#E4DCC8] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#211C0D]">{scale.label}</div>
                  <div className="text-[11px] text-[#6B6350] mt-0.5">{scale.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 5: FOOTER & CONTACT */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#211C0D]">
          Footer Content & Contact Details
        </h2>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Organization Summary (Footer Left Column)
          </label>
          <textarea
            rows={2}
            value={draft.footer?.summary || ''}
            onChange={(e) =>
              setDraft({
                ...draft,
                footer: { ...draft.footer, summary: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            501(c)(3) Nonprofit Notice
          </label>
          <input
            type="text"
            value={draft.footer?.nonprofit_notice || ''}
            onChange={(e) =>
              setDraft({
                ...draft,
                footer: { ...draft.footer, nonprofit_notice: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Physical Address
            </label>
            <input
              type="text"
              value={draft.footer?.address || ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  footer: { ...draft.footer, address: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              value={draft.footer?.email || ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  footer: { ...draft.footer, email: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Phone
            </label>
            <input
              type="text"
              value={draft.footer?.phone || ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  footer: { ...draft.footer, phone: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
