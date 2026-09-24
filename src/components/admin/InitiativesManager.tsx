import React, { useState, useEffect } from 'react';
import { CmsInitiative, CmsMetricItem } from '../../types/cms';
import { defaultCmsInitiatives } from '../../data/cmsSeedDefaults';
import {
  getAdminInitiatives,
  saveDraftInitiative,
  publishInitiative,
  unpublishInitiative,
  deleteInitiative
} from '../../lib/cmsClient';
import { ImageFieldInput } from './ImageFieldInput';
import { MarkdownEditor } from './MarkdownEditor';
import { Button } from '../common/Button';
import { Plus, Edit2, Check, Send, EyeOff, Trash2, ArrowLeft } from 'lucide-react';

export const InitiativesManager: React.FC = () => {
  const [initiatives, setInitiatives] = useState<CmsInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInitiative, setActiveInitiative] = useState<CmsInitiative | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');

  const loadInitiatives = async () => {
    try {
      setLoading(true);
      const data = await getAdminInitiatives();
      setInitiatives(data);
    } catch {
      setInitiatives(defaultCmsInitiatives);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitiatives();
  }, []);

  const handleCreateNew = () => {
    const fresh: CmsInitiative = {
      id: '',
      slug: 'new-initiative-' + Date.now(),
      is_published: false,
      sort_order: initiatives.length + 1,
      draft_content: {
        title: 'New Program Initiative',
        slug: 'new-initiative-' + Date.now(),
        summary: 'A short overview of the program impact and focus.',
        markdown_body: 'Provide full program details, schedule, and volunteer pathways...',
        category: 'Food Forest & Canopy',
        location: 'Community Park Hub',
        start_date: '2026-03-01',
        status: 'active',
        hero_image: {
          url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&q=80&w=1200',
          alt_text: 'Community garden with raised beds and fruit trees'
        },
        metrics: [
          { id: 'm1', value: '450+', label: 'Participants Engaged' }
        ]
      },
      published_content: {
        title: 'New Program Initiative',
        slug: 'new-initiative-' + Date.now(),
        summary: '',
        markdown_body: '',
        category: '',
        location: '',
        start_date: '',
        status: 'active',
        hero_image: { url: '', alt_text: '' },
        metrics: []
      }
    };
    setActiveInitiative(fresh);
    setIsNew(true);
  };

  const handleSaveDraft = async () => {
    if (!activeInitiative) return;

    if (!/^[a-z0-9-]+$/.test(activeInitiative.slug)) {
      alert('Slug must only contain lowercase alphanumeric characters and single hyphens (e.g. food-forest)');
      return;
    }

    try {
      setSaveStatus('saving');
      const savedId = await saveDraftInitiative({
        id: isNew ? undefined : activeInitiative.id,
        slug: activeInitiative.slug,
        sort_order: activeInitiative.sort_order,
        draft_content: activeInitiative.draft_content
      });

      if (isNew) {
        setActiveInitiative({ ...activeInitiative, id: savedId });
        setIsNew(false);
      }
      setSaveStatus('saved');
      await loadInitiatives();
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err: any) {
      setSaveStatus('error');
      alert(`Save failed: ${err.message}`);
    }
  };

  const handlePublish = async () => {
    if (!activeInitiative || !activeInitiative.id) {
      alert('Save draft first before publishing.');
      return;
    }

    try {
      setPublishStatus('publishing');
      const time = await publishInitiative(activeInitiative.id);
      setActiveInitiative({
        ...activeInitiative,
        is_published: true,
        last_published_at: time,
        published_content: activeInitiative.draft_content
      });
      setPublishStatus('published');
      await loadInitiatives();
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err: any) {
      setPublishStatus('idle');
      alert(`Publishing failed: ${err.message}`);
    }
  };

  const handleUnpublish = async () => {
    if (!activeInitiative || !activeInitiative.id) return;
    if (!confirm('Unpublish this initiative from public view? It will immediately return 404 to public visitors.')) return;

    try {
      await unpublishInitiative(activeInitiative.id);
      setActiveInitiative({ ...activeInitiative, is_published: false });
      await loadInitiatives();
    } catch (err: any) {
      alert(`Unpublish failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this initiative?')) return;
    try {
      await deleteInitiative(id);
      if (activeInitiative?.id === id) setActiveInitiative(null);
      await loadInitiatives();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#6B6350]">Loading initiatives...</div>;
  }

  // --- EDIT / CREATE VIEW ---
  if (activeInitiative) {
    const draft = activeInitiative.draft_content;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16">
        <div className="flex items-center justify-between pb-4 border-b border-[#E4DCC8]">
          <button
            type="button"
            onClick={() => setActiveInitiative(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2C5745] hover:text-[#211C0D]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Initiatives List
          </button>

          <div className="flex items-center gap-3">
            <div className="text-xs font-medium">
              {saveStatus === 'saving' && <span className="text-amber-700">Saving...</span>}
              {saveStatus === 'saved' && <span className="text-emerald-700 font-semibold">● Draft saved</span>}
            </div>

            <Button variant="secondary" size="sm" onClick={handleSaveDraft}>
              Save Draft
            </Button>

            {activeInitiative.is_published ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnpublish}
                className="text-stone-600 hover:text-amber-700 flex items-center gap-1.5 text-xs"
              >
                <EyeOff className="w-3.5 h-3.5" /> Unpublish
              </Button>
            ) : null}

            <Button
              variant="primary"
              size="sm"
              onClick={handlePublish}
              disabled={publishStatus === 'publishing'}
              className="flex items-center gap-1.5"
            >
              {publishStatus === 'published' ? (
                <>
                  <Check className="w-4 h-4" /> Published!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> {activeInitiative.is_published ? 'Update Live' : 'Publish Live'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4DCC8] shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Initiative Title
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) =>
                  setActiveInitiative({
                    ...activeInitiative,
                    draft_content: { ...draft, title: e.target.value }
                  })
                }
                className="w-full text-base font-medium px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={activeInitiative.slug}
                onChange={(e) =>
                  setActiveInitiative({
                    ...activeInitiative,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                  })
                }
                className="w-full text-xs font-mono px-3 py-2.5 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Category
              </label>
              <input
                type="text"
                value={draft.category}
                onChange={(e) =>
                  setActiveInitiative({
                    ...activeInitiative,
                    draft_content: { ...draft, category: e.target.value }
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={draft.location}
                onChange={(e) =>
                  setActiveInitiative({
                    ...activeInitiative,
                    draft_content: { ...draft, location: e.target.value }
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={draft.status}
                onChange={(e) =>
                  setActiveInitiative({
                    ...activeInitiative,
                    draft_content: { ...draft, status: e.target.value as any }
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Sort Order (1, 2, 3...)
              </label>
              <input
                type="number"
                value={activeInitiative.sort_order}
                onChange={(e) =>
                  setActiveInitiative({
                    ...activeInitiative,
                    sort_order: parseInt(e.target.value, 10) || 0
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Short Summary
            </label>
            <textarea
              rows={2}
              value={draft.summary}
              onChange={(e) =>
                setActiveInitiative({
                  ...activeInitiative,
                  draft_content: { ...draft, summary: e.target.value }
                })
              }
              className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          {/* Hero Photo */}
          <ImageFieldInput
            label="Initiative Cover Image"
            helperText="Alt text required for accessibility."
            value={draft.hero_image}
            onChange={(img) =>
              setActiveInitiative({
                ...activeInitiative,
                draft_content: { ...draft, hero_image: img }
              })
            }
          />

          {/* Markdown Content */}
          <MarkdownEditor
            label="Full Initiative Description & Scope (Markdown)"
            value={draft.markdown_body}
            onChange={(val) =>
              setActiveInitiative({
                ...activeInitiative,
                draft_content: { ...draft, markdown_body: val }
              })
            }
            rows={10}
          />
        </div>
      </div>
    );
  }

  // --- LISTING TABLE VIEW ---
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DCC8]">
        <div>
          <h1 className="font-['Fraunces'] font-semibold text-2xl text-[#211C0D]">
            Community Initiatives & Programs
          </h1>
          <p className="font-['Karla'] text-xs text-[#6B6350] mt-1">
            Manage food forests, clean water projects, youth fellowships, and solar initiatives.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Initiative
        </Button>
      </div>

      <div className="bg-[#FFFFFF] rounded-xl border border-[#E4DCC8] overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E4DCC8] bg-[#FAF7F0] text-xs font-semibold text-[#6B6350] uppercase tracking-wider">
              <th className="py-3 px-4">Program & Slug</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4DCC8]/60 text-sm">
            {initiatives.map((init) => {
              const content = init.draft_content || init.published_content;
              return (
                <tr key={init.id || init.slug} className="hover:bg-[#FAF7F0]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#211C0D]">{content?.title || 'Untitled'}</div>
                    <div className="text-xs font-mono text-[#9C8B5E]">/{init.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#6B6350]">
                    {content?.location || 'Regional'}
                  </td>
                  <td className="py-3.5 px-4">
                    {init.is_published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveInitiative(init);
                          setIsNew(false);
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => init.id && handleDelete(init.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
