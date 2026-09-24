import React, { useState, useEffect } from 'react';
import { CmsAboutPageContent } from '../../types/cms';
import { defaultCmsAboutPage } from '../../data/cmsSeedDefaults';
import { getAdminPage, saveDraftPage, publishPage } from '../../lib/cmsClient';
import { ImageFieldInput } from './ImageFieldInput';
import { Button } from '../common/Button';
import { Check, Send, BookOpen, Quote, Shield, Sparkles } from 'lucide-react';

export const AboutPageEditor: React.FC = () => {
  const [draft, setDraft] = useState<CmsAboutPageContent>(defaultCmsAboutPage);
  const [published, setPublished] = useState<CmsAboutPageContent>(defaultCmsAboutPage);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAdminPage<CmsAboutPageContent>('about', defaultCmsAboutPage);
      setDraft(res.draft_content);
      setPublished(res.published_content);
      setLastPublishedAt(res.last_published_at || null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not load About page data from Supabase.');
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
        await saveDraftPage('about', draft);
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
      const time = await publishPage('about');
      setLastPublishedAt(time);
      setPublished(draft);
      setPublishStatus('published');
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err: any) {
      setPublishStatus('idle');
      alert(`Publishing failed: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#6B6350]">Loading About Page editor...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DCC8]">
        <div>
          <h1 className="font-['Fraunces'] font-semibold text-2xl text-[#211C0D]">
            About Page Content Editor
          </h1>
          <p className="font-['Karla'] text-xs text-[#6B6350] mt-1">
            Manage organization story, pull quotes, founding history, and core values.
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
                <Send className="w-4 h-4" /> Publish About Page
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

      {/* SECTION 1: HEADER */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#2C5745]" /> 1. Header Banner
        </h2>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Page Title
          </label>
          <input
            type="text"
            value={draft.header.title}
            onChange={(e) =>
              setDraft({
                ...draft,
                header: { ...draft.header, title: e.target.value }
              })
            }
            className="w-full text-base font-medium px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Subtitle / Summary Statement
          </label>
          <textarea
            rows={2}
            value={draft.header.subtitle}
            onChange={(e) =>
              setDraft({
                ...draft,
                header: { ...draft.header, subtitle: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>
      </div>

      {/* SECTION 2: STORY & PULL-QUOTE */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-5">
        <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
          <Quote className="w-4 h-4 text-[#2C5745]" /> 2. Narrative & Pull Quote (60/40 Grid)
        </h2>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Story Heading
          </label>
          <input
            type="text"
            value={draft.story.heading}
            onChange={(e) =>
              setDraft({
                ...draft,
                story: { ...draft.story, heading: e.target.value }
              })
            }
            className="w-full text-sm font-medium px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Story Paragraph 1
          </label>
          <textarea
            rows={4}
            value={draft.story.paragraph1}
            onChange={(e) =>
              setDraft({
                ...draft,
                story: { ...draft.story, paragraph1: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            Story Paragraph 2
          </label>
          <textarea
            rows={4}
            value={draft.story.paragraph2}
            onChange={(e) =>
              setDraft({
                ...draft,
                story: { ...draft.story, paragraph2: e.target.value }
              })
            }
            className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
          />
        </div>

        {/* Pull Quote Box */}
        <div className="p-4 bg-[#FAF7F0] border-l-4 border-[#2C5745] rounded-r-lg space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Pull Quote Statement
            </label>
            <textarea
              rows={2}
              value={draft.story.pull_quote}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  story: { ...draft.story, pull_quote: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FFFFFF] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase mb-1">
                Attribution Name
              </label>
              <input
                type="text"
                value={draft.story.quote_author}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    story: { ...draft.story, quote_author: e.target.value }
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase mb-1">
                Attribution Role / Title
              </label>
              <input
                type="text"
                value={draft.story.quote_author_role}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    story: { ...draft.story, quote_author_role: e.target.value }
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
              />
            </div>
          </div>
        </div>

        {/* Story Photo */}
        <ImageFieldInput
          label="Story Section Photo"
          helperText="Displays in the right 40% column of the narrative story."
          value={draft.story.story_image}
          onChange={(img) =>
            setDraft({
              ...draft,
              story: { ...draft.story, story_image: img }
            })
          }
        />
      </div>

      {/* SECTION 3: CORE PRINCIPLES */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#2C5745]" /> 3. Core Principles & Values (4 Cards)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {draft.principles.values.map((val, idx) => (
            <div key={val.id || idx} className="p-3 bg-[#FAF7F0] rounded-lg border border-[#E4DCC8] space-y-2">
              <input
                type="text"
                value={val.title}
                onChange={(e) => {
                  const next = [...draft.principles.values];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setDraft({
                    ...draft,
                    principles: { ...draft.principles, values: next }
                  });
                }}
                placeholder="Value Title"
                className="w-full text-sm font-semibold px-2 py-1 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#211C0D]"
              />
              <textarea
                rows={2}
                value={val.description}
                onChange={(e) => {
                  const next = [...draft.principles.values];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setDraft({
                    ...draft,
                    principles: { ...draft.principles, values: next }
                  });
                }}
                placeholder="Description"
                className="w-full text-xs px-2 py-1 bg-[#FFFFFF] border border-[#E4DCC8] rounded text-[#4A4437]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: CTA */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#211C0D] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2C5745]" /> 4. Bottom CTA Section
        </h2>

        <div>
          <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
            CTA Title
          </label>
          <input
            type="text"
            value={draft.cta.title}
            onChange={(e) =>
              setDraft({
                ...draft,
                cta: { ...draft.cta, title: e.target.value }
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
            value={draft.cta.description}
            onChange={(e) =>
              setDraft({
                ...draft,
                cta: { ...draft.cta, description: e.target.value }
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
              value={draft.cta.button_label}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cta: { ...draft.cta, button_label: e.target.value }
                })
              }
              className="w-full text-sm px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Button URL
            </label>
            <input
              type="text"
              value={draft.cta.button_href}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cta: { ...draft.cta, button_href: e.target.value }
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
