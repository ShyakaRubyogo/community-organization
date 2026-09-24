import React, { useState, useEffect } from 'react';
import { CmsTeamMember } from '../../types/cms';
import { defaultCmsTeamMembers } from '../../data/cmsSeedDefaults';
import {
  getAdminTeamMembers,
  saveDraftTeamMember,
  publishTeamMember,
  unpublishTeamMember,
  deleteTeamMember
} from '../../lib/cmsClient';
import { ImageFieldInput } from './ImageFieldInput';
import { MarkdownEditor } from './MarkdownEditor';
import { Button } from '../common/Button';
import { Plus, Edit2, Check, Send, EyeOff, Trash2, ArrowLeft } from 'lucide-react';

export const TeamManager: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<CmsTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMember, setActiveMember] = useState<CmsTeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await getAdminTeamMembers();
      setTeamMembers(data);
    } catch {
      setTeamMembers(defaultCmsTeamMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleCreateNew = () => {
    const fresh: CmsTeamMember = {
      id: '',
      slug: 'team-member-' + Date.now(),
      is_published: false,
      sort_order: teamMembers.length + 1,
      draft_content: {
        name: 'New Team Member',
        role: 'Community Organizer',
        department: 'Operations & Fieldwork',
        bio: 'Dedicated to community leadership and agroforestry.',
        story: 'Extended background on community advocacy, background, and personal mission...',
        photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        is_featured: false
      },
      published_content: {
        name: 'New Team Member',
        role: '',
        department: '',
        bio: '',
        story: '',
        photo_url: '',
        is_featured: false
      }
    };
    setActiveMember(fresh);
    setIsNew(true);
  };

  const handleSaveDraft = async () => {
    if (!activeMember) return;

    if (!/^[a-z0-9-]+$/.test(activeMember.slug)) {
      alert('Slug must only contain lowercase alphanumeric characters and hyphens.');
      return;
    }

    try {
      setSaveStatus('saving');
      const savedId = await saveDraftTeamMember({
        id: isNew ? undefined : activeMember.id,
        slug: activeMember.slug,
        sort_order: activeMember.sort_order,
        draft_content: activeMember.draft_content
      });

      if (isNew) {
        setActiveMember({ ...activeMember, id: savedId });
        setIsNew(false);
      }
      setSaveStatus('saved');
      await loadTeam();
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err: any) {
      setSaveStatus('error');
      alert(`Save failed: ${err.message}`);
    }
  };

  const handlePublish = async () => {
    if (!activeMember || !activeMember.id) {
      alert('Save draft first before publishing.');
      return;
    }

    try {
      setPublishStatus('publishing');
      const time = await publishTeamMember(activeMember.id);
      setActiveMember({
        ...activeMember,
        is_published: true,
        last_published_at: time,
        published_content: activeMember.draft_content
      });
      setPublishStatus('published');
      await loadTeam();
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err: any) {
      setPublishStatus('idle');
      alert(`Publishing failed: ${err.message}`);
    }
  };

  const handleUnpublish = async () => {
    if (!activeMember || !activeMember.id) return;
    if (!confirm('Unpublish this team member from public view? It will immediately return 404 to public visitors.')) return;

    try {
      await unpublishTeamMember(activeMember.id);
      setActiveMember({ ...activeMember, is_published: false });
      await loadTeam();
    } catch (err: any) {
      alert(`Unpublish failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this team member?')) return;
    try {
      await deleteTeamMember(id);
      if (activeMember?.id === id) setActiveMember(null);
      await loadTeam();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#6B6350]">Loading team members...</div>;
  }

  // --- EDIT / CREATE VIEW ---
  if (activeMember) {
    const draft = activeMember.draft_content;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16">
        <div className="flex items-center justify-between pb-4 border-b border-[#E4DCC8]">
          <button
            type="button"
            onClick={() => setActiveMember(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2C5745] hover:text-[#211C0D]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Team List
          </button>

          <div className="flex items-center gap-3">
            <div className="text-xs font-medium">
              {saveStatus === 'saving' && <span className="text-amber-700">Saving...</span>}
              {saveStatus === 'saved' && <span className="text-emerald-700 font-semibold">● Draft saved</span>}
            </div>

            <Button variant="secondary" size="sm" onClick={handleSaveDraft}>
              Save Draft
            </Button>

            {activeMember.is_published ? (
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
                  <Send className="w-4 h-4" /> {activeMember.is_published ? 'Update Live' : 'Publish Live'}
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
                Full Name
              </label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) =>
                  setActiveMember({
                    ...activeMember,
                    draft_content: { ...draft, name: e.target.value }
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
                value={activeMember.slug}
                onChange={(e) =>
                  setActiveMember({
                    ...activeMember,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                  })
                }
                className="w-full text-xs font-mono px-3 py-2.5 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={draft.role}
                onChange={(e) =>
                  setActiveMember({
                    ...activeMember,
                    draft_content: { ...draft, role: e.target.value }
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={draft.department}
                onChange={(e) =>
                  setActiveMember({
                    ...activeMember,
                    draft_content: { ...draft, department: e.target.value }
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={activeMember.sort_order}
                onChange={(e) =>
                  setActiveMember({
                    ...activeMember,
                    sort_order: parseInt(e.target.value, 10) || 0
                  })
                }
                className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Short Bio (Card view)
            </label>
            <textarea
              rows={2}
              value={draft.bio}
              onChange={(e) =>
                setActiveMember({
                  ...activeMember,
                  draft_content: { ...draft, bio: e.target.value }
                })
              }
              className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1">
              Portrait Photo URL
            </label>
            <input
              type="text"
              value={draft.photo_url || ''}
              onChange={(e) =>
                setActiveMember({
                  ...activeMember,
                  draft_content: { ...draft, photo_url: e.target.value }
                })
              }
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D]"
            />
          </div>

          {/* Markdown Extended Story */}
          <MarkdownEditor
            label="Extended Background & Biography (Markdown)"
            value={draft.story || ''}
            onChange={(val) =>
              setActiveMember({
                ...activeMember,
                draft_content: { ...draft, story: val }
              })
            }
            rows={8}
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
            Team & Leadership Directory
          </h1>
          <p className="font-['Karla'] text-xs text-[#6B6350] mt-1">
            Manage grassroots organizers, council members, and field coordinators.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Team Member
        </Button>
      </div>

      <div className="bg-[#FFFFFF] rounded-xl border border-[#E4DCC8] overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E4DCC8] bg-[#FAF7F0] text-xs font-semibold text-[#6B6350] uppercase tracking-wider">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Role & Dept</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4DCC8]/60 text-sm">
            {teamMembers.map((member) => {
              const content = member.draft_content || member.published_content;
              return (
                <tr key={member.id || member.slug} className="hover:bg-[#FAF7F0]/40 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={content?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
                      alt={content?.name || 'Team member'}
                      className="w-9 h-9 rounded-full object-cover border border-[#E4DCC8]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-semibold text-[#211C0D]">{content?.name || 'Untitled'}</div>
                      <div className="text-xs font-mono text-[#9C8B5E]">/{member.slug}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#6B6350]">
                    <div className="font-medium text-[#211C0D]">{content?.role}</div>
                    <div>{content?.department}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {member.is_published ? (
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
                          setActiveMember(member);
                          setIsNew(false);
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => member.id && handleDelete(member.id)}
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
