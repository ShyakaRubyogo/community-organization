import React, { useState, useEffect } from 'react';
import { CmsHomePageContent, CmsMetricItem } from '../../types/cms';
import { defaultCmsHomePage } from '../../data/cmsSeedDefaults';
import { getAdminPage, saveDraftPage, publishPage } from '../../lib/cmsClient';
import { ImageFieldInput } from './ImageFieldInput';
import { Button } from '../common/Button';
import { Check, Send, Sparkles, Layout, BarChart2, MessageSquare, Plus, Trash2 } from 'lucide-react';

export const HomePageEditor: React.FC = () => {
  const [draft, setDraft] = useState<CmsHomePageContent>(defaultCmsHomePage);
  const [published, setPublished] = useState<CmsHomePageContent>(defaultCmsHomePage);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAdminPage<CmsHomePageContent>('home', defaultCmsHomePage);
      setDraft(res.draft_content);
      setPublished(res.published_content);
      setLastPublishedAt(res.last_published_at || null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not load Home page data from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Debounced auto-save
  useEffect(() => {
    if (loading) return;

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await saveDraftPage('home', draft);
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
      const time = await publishPage('home');
      setLastPublishedAt(time);
      setPublished(draft);
      setPublishStatus('published');
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err: any) {
      setPublishStatus('idle');
      alert(`Publishing failed: ${err.message}`);
    }
  };

  const updateMetric = (idx: number, field: keyof CmsMetricItem, val: string) => {
    const next = [...draft.impact_band.metrics];
    next[idx] = { ...next[idx], [field]: val };
    setDraft({
      ...draft,
      impact_band: { ...draft.impact_band, metrics: next }
    });
  };

  const addMetric = () => {
    const id = `m-${Date.now()}`;
    setDraft({
      ...draft,
      impact_band: {
        ...draft.impact_band,
        metrics: [...draft.impact_band.metrics, { id, value: '100+', label: 'New Metric Label' }]
      }
    });
  };

  const removeMetric = (idx: number) => {
    setDraft({
      ...draft,
      impact_band: {
        ...draft.impact_band,
        metrics: draft.impact_band.metrics.filter((_, i) => i !== idx)
      }
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#6B6350]">Loading Home Page editor...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DCC8]">
        <div>
          <h1 className="font-['Fraunces'] font-semibold text-2xl text-[#211C0D]">
            Home Page Content Editor
          </h1>
          <p className="font-['Karla'] text-xs text-[#6B6350] mt-1">
            Section-by-section control over headlines, mission statements, and key impact statistics.
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
                <Check className="w-4 h-4" /> Published Live!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Publish Home Page
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

      {/* SECTION 1: HERO */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-5">
        <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
          <Layout className="w-4 h-4 text-[#2C5745]" /> 1. Hero Section (60/40 Asymmetric)
        </h2>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Main Headline (H1)
          </label>
          <textarea
            rows={2}
            value={draft.hero.headline}
            onChange={(e) =>
              setDraft({
                ...draft,
                hero: { ...draft.hero, headline: e.target.value }
              })
            }
            className="w-full text-base font-medium px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Supporting Narrative Blurb
          </label>
          <textarea
            rows={3}
            value={draft.hero.description}
            onChange={(e) =>
              setDraft({
                ...draft,
                hero: { ...draft.hero, description: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#E4DCC8]">
            <h3 className="text-xs font-semibold text-[#211C0D] uppercase mb-2">Primary CTA Button</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Button Label (e.g. View initiatives)"
                value={draft.hero.primary_cta.label}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    hero: {
                      ...draft.hero,
                      primary_cta: { ...draft.hero.primary_cta, label: e.target.value }
                    }
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
              />
              <input
                type="text"
                placeholder="Target URL (/initiatives)"
                value={draft.hero.primary_cta.href}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    hero: {
                      ...draft.hero,
                      primary_cta: { ...draft.hero.primary_cta, href: e.target.value }
                    }
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#E4DCC8]">
            <h3 className="text-xs font-semibold text-[#211C0D] uppercase mb-2">Secondary CTA Button</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Button Label (e.g. Read articles)"
                value={draft.hero.secondary_cta.label}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    hero: {
                      ...draft.hero,
                      secondary_cta: { ...draft.hero.secondary_cta, label: e.target.value }
                    }
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
              />
              <input
                type="text"
                placeholder="Target URL (/articles)"
                value={draft.hero.secondary_cta.href}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    hero: {
                      ...draft.hero,
                      secondary_cta: { ...draft.hero.secondary_cta, href: e.target.value }
                    }
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
              />
            </div>
          </div>
        </div>

        {/* Hero Photo with enforced alt text */}
        <ImageFieldInput
          label="Hero Photo Asset"
          helperText="Renders within the clipped-corner frame with subtle organic SVG flourish."
          value={draft.hero.hero_image}
          onChange={(img) =>
            setDraft({
              ...draft,
              hero: { ...draft.hero, hero_image: img }
            })
          }
        />
      </div>

      {/* SECTION 2: MISSION STATEMENT BAND */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#2C5745]" /> 2. Centered Mission Band
        </h2>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={draft.mission_band.title}
            onChange={(e) =>
              setDraft({
                ...draft,
                mission_band: { ...draft.mission_band, title: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Mission Paragraph
          </label>
          <textarea
            rows={3}
            value={draft.mission_band.description}
            onChange={(e) =>
              setDraft({
                ...draft,
                mission_band: { ...draft.mission_band, description: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Link Text
            </label>
            <input
              type="text"
              value={draft.mission_band.link_label}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  mission_band: { ...draft.mission_band, link_label: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Link Target URL
            </label>
            <input
              type="text"
              value={draft.mission_band.link_href}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  mission_band: { ...draft.mission_band, link_href: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: IMPACT STATS BAND */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#2C5745]" /> 3. Impact Band Stats (4 Slots)
          </h2>
          <Button variant="ghost" size="sm" onClick={addMetric} className="flex items-center gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Metric
          </Button>
        </div>

        <p className="text-xs text-[#6B6350]">
          These numbers display in high-contrast display font on the dark heritage bar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {draft.impact_band.metrics.map((metric, idx) => (
            <div key={metric.id || idx} className="p-3 bg-[#FAF7F0] rounded-lg border border-[#E4DCC8] flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A4437] uppercase">Stat Number / Unit</label>
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                    placeholder="e.g. 1,420+"
                    className="w-full text-base font-bold px-2 py-1 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A4437] uppercase">Label / Description</label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                    placeholder="e.g. Native canopy trees planted"
                    className="w-full text-xs px-2 py-1 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
                  />
                </div>
              </div>

              {draft.impact_band.metrics.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMetric(idx)}
                  className="p-1.5 text-stone-400 hover:text-red-600 transition-colors mt-2"
                  title="Remove Metric"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: CALL TO ACTION BAND */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2C5745]" /> 4. Final Community CTA Card
        </h2>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Card Title
          </label>
          <input
            type="text"
            value={draft.cta_band.title}
            onChange={(e) =>
              setDraft({
                ...draft,
                cta_band: { ...draft.cta_band, title: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={draft.cta_band.description}
            onChange={(e) =>
              setDraft({
                ...draft,
                cta_band: { ...draft.cta_band, description: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Button Label
            </label>
            <input
              type="text"
              value={draft.cta_band.button.label}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cta_band: {
                    ...draft.cta_band,
                    button: { ...draft.cta_band.button, label: e.target.value }
                  }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Button Target URL
            </label>
            <input
              type="text"
              value={draft.cta_band.button.href}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cta_band: {
                    ...draft.cta_band,
                    button: { ...draft.cta_band.button, href: e.target.value }
                  }
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
