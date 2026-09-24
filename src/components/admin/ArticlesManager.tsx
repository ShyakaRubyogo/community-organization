import React, { useState, useEffect } from 'react';
import { CmsArticle } from '../../types/cms';
import { defaultCmsArticles } from '../../data/cmsSeedDefaults';
import {
  getAdminArticles,
  saveDraftArticle,
  publishArticle,
  unpublishArticle,
  deleteArticle
} from '../../lib/cmsClient';
import { ImageFieldInput } from './ImageFieldInput';
import { MarkdownEditor } from './MarkdownEditor';
import { Button } from '../common/Button';
import { Plus, Edit2, Check, Send, EyeOff, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';

export const ArticlesManager: React.FC = () => {
  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<CmsArticle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getAdminArticles();
      setArticles(data);
    } catch {
      // In dev fallback, load seed articles
      setArticles(defaultCmsArticles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleCreateNew = () => {
    const freshArticle: CmsArticle = {
      id: '',
      slug: 'new-article-' + Date.now(),
      is_published: false,
      draft_content: {
        title: 'New Article Title',
        slug: 'new-article-' + Date.now(),
        excerpt: '',
        markdown_body: 'Write the article narrative here in Markdown format...',
        category: 'Story',
        read_time_minutes: 5,
        author_name: 'Editorial Team',
        author_role: 'Staff Writer',
        cover_image: {
          url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
          alt_text: 'Community members working together'
        }
      },
      published_content: {
        title: 'New Article Title',
        slug: 'new-article-' + Date.now(),
        excerpt: '',
        markdown_body: '',
        category: 'Story',
        read_time_minutes: 5,
        author_name: '',
        author_role: '',
        cover_image: { url: '', alt_text: '' }
      }
    };
    setActiveArticle(freshArticle);
    setIsNew(true);
  };

  const handleSaveDraft = async () => {
    if (!activeArticle) return;

    // Validate slug: lowercase alphanumeric + hyphen
    if (!/^[a-z0-9-]+$/.test(activeArticle.slug)) {
      alert('Slug must only contain lowercase alphanumeric characters and single hyphens (e.g. food-forest-update)');
      return;
    }

    try {
      setSaveStatus('saving');
      const savedId = await saveDraftArticle({
        id: isNew ? undefined : activeArticle.id,
        slug: activeArticle.slug,
        draft_content: activeArticle.draft_content
      });

      if (isNew) {
        setActiveArticle({ ...activeArticle, id: savedId });
        setIsNew(false);
      }
      setSaveStatus('saved');
      await loadArticles();
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err: any) {
      setSaveStatus('error');
      alert(`Save failed: ${err.message}`);
    }
  };

  const handlePublish = async () => {
    if (!activeArticle || !activeArticle.id) {
      alert('Save draft first before publishing.');
      return;
    }

    try {
      setPublishStatus('publishing');
      const time = await publishArticle(activeArticle.id);
      setActiveArticle({
        ...activeArticle,
        is_published: true,
        last_published_at: time,
        published_content: activeArticle.draft_content
      });
      setPublishStatus('published');
      await loadArticles();
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err: any) {
      setPublishStatus('idle');
      alert(`Publishing failed: ${err.message}`);
    }
  };

  const handleUnpublish = async () => {
    if (!activeArticle || !activeArticle.id) return;
    if (!confirm('Are you sure you want to unpublish this article? It will immediately return 404 to public visitors.')) return;

    try {
      await unpublishArticle(activeArticle.id);
      setActiveArticle({ ...activeArticle, is_published: false });
      await loadArticles();
    } catch (err: any) {
      alert(`Unpublish failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this article and its draft?')) return;
    try {
      await deleteArticle(id);
      if (activeArticle?.id === id) setActiveArticle(null);
      await loadArticles();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#6B6350]">Loading articles...</div>;
  }

  // --- EDIT / CREATE VIEW ---
  if (activeArticle) {
    const draft = activeArticle.draft_content;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16">
        <div className="flex items-center justify-between pb-4 border-b border-[#E4DCC8]">
          <button
            type="button"
            onClick={() => setActiveArticle(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2C5745] hover:text-[#211C0D]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles List
          </button>

          <div className="flex items-center gap-3">
            <div className="text-xs font-medium">
              {saveStatus === 'saving' && <span className="text-amber-700">Saving...</span>}
              {saveStatus === 'saved' && <span className="text-emerald-700 font-semibold">● Draft saved</span>}
            </div>

            <Button variant="secondary" size="sm" onClick={handleSaveDraft}>
              Save Draft
            </Button>

            {activeArticle.is_published ? (
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
                  <Send className="w-4 h-4" /> {activeArticle.is_published ? 'Update Live' : 'Publish Live'}
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
                Article Title
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) =>
                  setActiveArticle({
                    ...activeArticle,
                    draft_content: { ...draft, title: e.target.value }
                  })
                }
                className="w-full text-base font-medium px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                URL Slug <span className="text-stone-400 font-normal">([a-z0-9-])</span>
              </label>
              <input
                type="text"
                value={activeArticle.slug}
                onChange={(e) =>
                  setActiveArticle({
                    ...activeArticle,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                  })
                }
                placeholder="community-orchard-update"
                className="w-full text-xs font-mono px-3 py-2.5 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Category
              </label>
              <input
                type="text"
                value={draft.category}
                onChange={(e) =>
                  setActiveArticle({
                    ...activeArticle,
                    draft_content: { ...draft, category: e.target.value }
                  })
                }
                placeholder="Story, Impact, or Update"
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={draft.author_name || ''}
                onChange={(e) =>
                  setActiveArticle({
                    ...activeArticle,
                    draft_content: {
                      ...draft,
                      author_name: e.target.value
                    }
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Author Role
              </label>
              <input
                type="text"
                value={draft.author_role || ''}
                onChange={(e) =>
                  setActiveArticle({
                    ...activeArticle,
                    draft_content: {
                      ...draft,
                      author_role: e.target.value
                    }
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Short Summary / Excerpt
            </label>
            <textarea
              rows={2}
              value={draft.excerpt}
              onChange={(e) =>
                setActiveArticle({
                  ...activeArticle,
                  draft_content: { ...draft, excerpt: e.target.value }
                })
              }
              className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          {/* Cover Image Input */}
          <ImageFieldInput
            label="Cover Image"
            helperText="Displays on article cards and banner. Alt text is required."
            value={draft.cover_image}
            onChange={(img) =>
              setActiveArticle({
                ...activeArticle,
                draft_content: { ...draft, cover_image: img }
              })
            }
          />

          {/* Markdown Content Editor */}
          <MarkdownEditor
            label="Article Full Narrative (Markdown)"
            value={draft.markdown_body}
            onChange={(val) =>
              setActiveArticle({
                ...activeArticle,
                draft_content: { ...draft, markdown_body: val }
              })
            }
            rows={12}
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
            Articles & Community Stories
          </h1>
          <p className="font-['Karla'] text-xs text-[#6B6350] mt-1">
            Manage thought leadership, field dispatches, and grassroots storytelling.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Article
        </Button>
      </div>

      <div className="bg-[#FFFFFF] rounded-xl border border-[#E4DCC8] overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E4DCC8] bg-[#FAF7F0] text-xs font-semibold text-[#6B6350] uppercase tracking-wider">
              <th className="py-3 px-4">Title & Slug</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4DCC8]/60 text-sm">
            {articles.map((art) => {
              const content = art.draft_content || art.published_content;
              return (
                <tr key={art.id || art.slug} className="hover:bg-[#FAF7F0]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#211C0D]">{content?.title || 'Untitled'}</div>
                    <div className="text-xs font-mono text-[#9C8B5E]">/{art.slug}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E4DCC8] text-[#6B6350]">
                      {content?.category || 'General'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {art.is_published ? (
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
                          setActiveArticle(art);
                          setIsNew(false);
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => art.id && handleDelete(art.id)}
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
