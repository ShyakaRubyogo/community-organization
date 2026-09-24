import { supabase, isSupabaseConfigured as supabaseEnvConfigured } from './supabase';
import { deepMergeCms } from './deepMerge';
import { Initiative, Article, TeamMember } from '../types/database';

const isSupabaseConfigured = (): boolean => Boolean(supabaseEnvConfigured && supabase);
import {
  CmsGlobalSettings,
  CmsHomePageContent,
  CmsAboutPageContent,
  CmsArticle,
  CmsInitiative,
  CmsTeamMember
} from '../types/cms';
import {
  defaultCmsGlobalSettings,
  defaultCmsHomePage,
  defaultCmsAboutPage,
  defaultCmsArticles,
  defaultCmsInitiatives,
  defaultCmsTeamMembers
} from '../data/cmsSeedDefaults';

// =========================================================================
// 1. PUBLIC VIEW QUERIES (Safe for anon visitors, zero draft leaks)
// =========================================================================

/**
 * Fetch published site settings (brand, navigation, footer, theme).
 */
export async function fetchPublishedSettings(): Promise<CmsGlobalSettings> {
  if (!isSupabaseConfigured() || !supabase) {
    return defaultCmsGlobalSettings;
  }

  try {
    const { data, error } = await supabase
      .from('cms_settings_published')
      .select('published_content')
      .eq('id', 'global')
      .maybeSingle();

    if (error || !data?.published_content) {
      return defaultCmsGlobalSettings;
    }
    return deepMergeCms(defaultCmsGlobalSettings, data.published_content);
  } catch (err) {
    console.warn('Failed to fetch published settings from Supabase, using fallback:', err);
    return defaultCmsGlobalSettings;
  }
}

/**
 * Fetch published page content (e.g. 'home', 'about').
 */
export async function fetchPublishedPage<T>(pageId: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured() || !supabase) {
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from('cms_pages_published')
      .select('published_content')
      .eq('id', pageId)
      .maybeSingle();

    if (error || !data?.published_content) {
      return fallback;
    }
    return deepMergeCms(fallback, data.published_content);
  } catch (err) {
    console.warn(`Failed to fetch published page ${pageId}, using fallback:`, err);
    return fallback;
  }
}

/**
 * Fetch all published articles.
 */
export async function fetchPublishedArticles(): Promise<CmsArticle[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return defaultCmsArticles.filter(a => a.is_published);
  }

  try {
    const { data, error } = await supabase
      .from('cms_articles_published')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // If error or empty in dev, return seed
      return defaultCmsArticles.filter(a => a.is_published);
    }

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      is_published: true,
      published_at: row.published_at,
      last_published_at: row.last_published_at,
      updated_at: row.updated_at,
      draft_content: row.published_content,
      published_content: row.published_content
    }));
  } catch (err) {
    console.warn('Failed to fetch articles from Supabase, using fallback:', err);
    return defaultCmsArticles.filter(a => a.is_published);
  }
}

/**
 * Fetch published article by slug.
 * STRICT EXISTENCE RULE:
 * If Supabase is reachable and returns null, it authoritatively means the item
 * does not exist or has been unpublished. It strictly returns null (never seedData).
 */
export async function fetchPublishedArticleBySlug(slug: string): Promise<CmsArticle | null> {
  if (!isSupabaseConfigured() || !supabase) {
    // Only in unconfigured/offline dev do we check seedData
    const found = defaultCmsArticles.find(a => a.slug === slug && a.is_published);
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from('cms_articles_published')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      // Genuine network error -> transport fallback
      console.warn('Network error fetching article by slug, using fallback:', error);
      const found = defaultCmsArticles.find(a => a.slug === slug && a.is_published);
      return found || null;
    }

    if (!data) {
      // Authoritative 404: Supabase confirmed it does NOT exist or is unpublished
      return null;
    }

    return {
      id: data.id,
      slug: data.slug,
      is_published: true,
      published_at: data.published_at,
      last_published_at: data.last_published_at,
      updated_at: data.updated_at,
      draft_content: data.published_content,
      published_content: data.published_content
    };
  } catch (err) {
    console.warn('Exception querying article by slug:', err);
    return null;
  }
}

/**
 * Fetch all published initiatives.
 */
export async function fetchPublishedInitiatives(): Promise<CmsInitiative[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return defaultCmsInitiatives.filter(i => i.is_published);
  }

  try {
    const { data, error } = await supabase
      .from('cms_initiatives_published')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultCmsInitiatives.filter(i => i.is_published);
    }

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      is_published: true,
      sort_order: row.sort_order,
      last_published_at: row.last_published_at,
      updated_at: row.last_published_at,
      draft_content: row.published_content,
      published_content: row.published_content
    }));
  } catch (err) {
    console.warn('Failed to fetch initiatives from Supabase, using fallback:', err);
    return defaultCmsInitiatives.filter(i => i.is_published);
  }
}

/**
 * Fetch published initiative by slug.
 * STRICT EXISTENCE RULE: Returns null (hard 404) if Supabase reports no row.
 */
export async function fetchPublishedInitiativeBySlug(slug: string): Promise<CmsInitiative | null> {
  if (!isSupabaseConfigured() || !supabase) {
    const found = defaultCmsInitiatives.find(i => i.slug === slug && i.is_published);
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from('cms_initiatives_published')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.warn('Network error fetching initiative by slug, using fallback:', error);
      const found = defaultCmsInitiatives.find(i => i.slug === slug && i.is_published);
      return found || null;
    }

    if (!data) {
      // Authoritative 404
      return null;
    }

    return {
      id: data.id,
      slug: data.slug,
      is_published: true,
      sort_order: data.sort_order,
      last_published_at: data.last_published_at,
      updated_at: data.last_published_at,
      draft_content: data.published_content,
      published_content: data.published_content
    };
  } catch (err) {
    console.warn('Exception querying initiative by slug:', err);
    return null;
  }
}

/**
 * Fetch all published team members.
 */
export async function fetchPublishedTeamMembers(): Promise<CmsTeamMember[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return defaultCmsTeamMembers.filter(t => t.is_published);
  }

  try {
    const { data, error } = await supabase
      .from('cms_team_members_published')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultCmsTeamMembers.filter(t => t.is_published);
    }

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      is_published: true,
      sort_order: row.sort_order,
      last_published_at: row.last_published_at,
      updated_at: row.last_published_at,
      draft_content: row.published_content,
      published_content: row.published_content
    }));
  } catch (err) {
    console.warn('Failed to fetch team members from Supabase, using fallback:', err);
    return defaultCmsTeamMembers.filter(t => t.is_published);
  }
}

// =========================================================================
// 2. AUTHENTICATION & ADMIN ROLES
// =========================================================================

export interface CmsAdminUser {
  id: string;
  email: string;
  is_demo?: boolean;
}

/**
 * Check if the currently logged-in user is in public.cms_admins
 */
export async function checkCurrentAdmin(): Promise<CmsAdminUser | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('cms_admins')
      .select('id, email')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Send Magic Link OTP to email
 */
export async function sendMagicLink(email: string): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      message: 'Supabase credentials are not configured in this environment.'
    };
  }

  const redirectUrl = `${window.location.origin}/admin`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl
    }
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Check your email for your secure magic sign-in link!' };
}

/**
 * Log out
 */
export async function logoutCmsAdmin(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

// =========================================================================
// 3. ADMIN WRITE & PUBLISH OPERATIONS (Direct to Supabase, no local save)
// =========================================================================

/**
 * Fetch full settings row including draft_content (Admin only)
 */
export async function getAdminSettings(): Promise<{
  draft_content: CmsGlobalSettings;
  published_content: CmsGlobalSettings;
  last_published_at?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('cms_settings')
    .select('draft_content, published_content, last_published_at')
    .eq('id', 'global')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Could not load CMS settings.');
  }

  return {
    draft_content: deepMergeCms(defaultCmsGlobalSettings, data.draft_content),
    published_content: deepMergeCms(defaultCmsGlobalSettings, data.published_content),
    last_published_at: data.last_published_at
  };
}

/**
 * Auto-save settings draft_content (Single atomic statement)
 */
export async function saveDraftSettings(draftContent: CmsGlobalSettings): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required for saving.');
  }

  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('cms_settings')
    .update({
      draft_content: draftContent,
      updated_by: user?.id
    })
    .eq('id', 'global');

  if (error) throw error;
}

/**
 * Publish settings (Atomic promotion via RPC)
 */
export async function publishSettings(): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required for publishing.');
  }

  const { data, error } = await supabase.rpc('publish_cms_settings');
  if (error) throw error;
  return data as string;
}

/**
 * Fetch full page row including draft_content (Admin only)
 */
export async function getAdminPage<T>(pageId: string, fallback: T): Promise<{
  draft_content: T;
  published_content: T;
  last_published_at?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('cms_pages')
    .select('draft_content, published_content, last_published_at')
    .eq('id', pageId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || `Could not load CMS page ${pageId}.`);
  }

  return {
    draft_content: deepMergeCms(fallback, data.draft_content),
    published_content: deepMergeCms(fallback, data.published_content),
    last_published_at: data.last_published_at
  };
}

/**
 * Auto-save page draft_content (Single atomic statement)
 */
export async function saveDraftPage(pageId: string, draftContent: any): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required for saving.');
  }

  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('cms_pages')
    .update({
      draft_content: draftContent,
      updated_by: user?.id
    })
    .eq('id', pageId);

  if (error) throw error;
}

/**
 * Publish page (Atomic promotion via RPC)
 */
export async function publishPage(pageId: string): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required for publishing.');
  }

  const { data, error } = await supabase.rpc('publish_cms_page', {
    target_page_id: pageId
  });
  if (error) throw error;
  return data as string;
}

// -------------------------------------------------------------------------
// Collections: Articles (Admin Operations)
// -------------------------------------------------------------------------

export async function getAdminArticles(): Promise<CmsArticle[]> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('cms_articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveDraftArticle(article: {
  id?: string;
  slug: string;
  draft_content: any;
}): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required for saving.');
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (article.id) {
    // Update existing
    const { error } = await supabase
      .from('cms_articles')
      .update({
        slug: article.slug,
        draft_content: article.draft_content,
        updated_by: user?.id
      })
      .eq('id', article.id);

    if (error) throw error;
    return article.id;
  } else {
    // Insert new draft
    const { data, error } = await supabase
      .from('cms_articles')
      .insert({
        slug: article.slug,
        is_published: false,
        draft_content: article.draft_content,
        published_content: article.draft_content,
        updated_by: user?.id
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }
}

export async function publishArticle(id: string): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required for publishing.');
  }

  const { data, error } = await supabase.rpc('publish_cms_article', {
    target_article_id: id
  });
  if (error) throw error;
  return data as string;
}

export async function unpublishArticle(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required.');
  }

  const { error } = await supabase
    .from('cms_articles')
    .update({ is_published: false })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteArticle(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required.');
  }

  const { error } = await supabase
    .from('cms_articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// -------------------------------------------------------------------------
// Collections: Initiatives (Admin Operations)
// -------------------------------------------------------------------------

export async function getAdminInitiatives(): Promise<CmsInitiative[]> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('cms_initiatives')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function saveDraftInitiative(initiative: {
  id?: string;
  slug: string;
  sort_order?: number;
  draft_content: any;
}): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required.');
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (initiative.id) {
    const { error } = await supabase
      .from('cms_initiatives')
      .update({
        slug: initiative.slug,
        sort_order: initiative.sort_order ?? 0,
        draft_content: initiative.draft_content,
        updated_by: user?.id
      })
      .eq('id', initiative.id);

    if (error) throw error;
    return initiative.id;
  } else {
    const { data, error } = await supabase
      .from('cms_initiatives')
      .insert({
        slug: initiative.slug,
        is_published: false,
        sort_order: initiative.sort_order ?? 0,
        draft_content: initiative.draft_content,
        published_content: initiative.draft_content,
        updated_by: user?.id
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }
}

export async function publishInitiative(id: string): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase connection required.');
  }

  const { data, error } = await supabase.rpc('publish_cms_initiative', {
    target_initiative_id: id
  });
  if (error) throw error;
  return data as string;
}

export async function unpublishInitiative(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase required.');

  const { error } = await supabase
    .from('cms_initiatives')
    .update({ is_published: false })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteInitiative(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase required.');

  const { error } = await supabase
    .from('cms_initiatives')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// -------------------------------------------------------------------------
// Collections: Team Members (Admin Operations)
// -------------------------------------------------------------------------

export async function getAdminTeamMembers(): Promise<CmsTeamMember[]> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('cms_team_members')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function saveDraftTeamMember(member: {
  id?: string;
  slug: string;
  sort_order?: number;
  draft_content: any;
}): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase required.');

  const { data: { user } } = await supabase.auth.getUser();

  if (member.id) {
    const { error } = await supabase
      .from('cms_team_members')
      .update({
        slug: member.slug,
        sort_order: member.sort_order ?? 0,
        draft_content: member.draft_content,
        updated_by: user?.id
      })
      .eq('id', member.id);

    if (error) throw error;
    return member.id;
  } else {
    const { data, error } = await supabase
      .from('cms_team_members')
      .insert({
        slug: member.slug,
        is_published: false,
        sort_order: member.sort_order ?? 0,
        draft_content: member.draft_content,
        published_content: member.draft_content,
        updated_by: user?.id
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }
}

export async function publishTeamMember(id: string): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase required.');

  const { data, error } = await supabase.rpc('publish_cms_team_member', {
    target_team_member_id: id
  });
  if (error) throw error;
  return data as string;
}

export async function unpublishTeamMember(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase required.');

  const { error } = await supabase
    .from('cms_team_members')
    .update({ is_published: false })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTeamMember(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase required.');

  const { error } = await supabase
    .from('cms_team_members')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Type adapters from CMS representation to Database representation for rendering cards & views
 */
export function cmsInitiativeToInitiative(ci: CmsInitiative): Initiative {
  const content = ci.published_content || ci.draft_content;
  return {
    id: ci.id,
    title: content.title,
    slug: ci.slug,
    summary: content.summary,
    body: content.markdown_body,
    cover_image_url: content.hero_image?.url || '',
    hero_image_url: content.hero_image?.url || '',
    location: content.location,
    external_link: content.external_link,
    status: (content.status === 'completed' ? 'archived' : ci.is_published ? 'published' : 'draft') as any,
    start_date: content.start_date,
    end_date: content.end_date,
    is_featured: true,
    published_at: ci.last_published_at || ci.updated_at,
    categories: content.category ? [{
      id: `cat-${content.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: content.category,
      slug: content.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      is_active: true
    }] : [],
    impact_metrics: (content.metrics || []).map((m, idx) => ({
      id: m.id || `m-${idx}`,
      initiative_id: ci.id,
      label: m.label,
      value: 0,
      display_value: m.value,
      sort_order: idx + 1
    })),
    media: (content.gallery_images || []).map((img, idx) => ({
      id: `img-${idx}`,
      url: img.url,
      alt_text: img.alt_text,
      caption: img.caption,
      media_type: 'image'
    }))
  };
}

export function cmsArticleToArticle(ca: CmsArticle): Article {
  const content = ca.published_content || ca.draft_content;
  return {
    id: ca.id,
    title: content.title,
    slug: ca.slug,
    excerpt: content.excerpt,
    body: content.markdown_body,
    cover_image_url: content.cover_image?.url || '',
    status: (ca.is_published ? 'published' : 'draft') as any,
    is_featured: true,
    published_at: ca.published_at || ca.last_published_at || ca.updated_at,
    author: {
      id: 'author-1',
      name: content.author_name || 'Staff Writer',
      slug: (content.author_name || 'staff-writer').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      bio: content.author_role || 'Field Contributor',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      is_published: true
    },
    categories: content.category ? [{
      id: `cat-${content.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: content.category,
      slug: content.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      is_active: true
    }] : []
  };
}

export function cmsTeamMemberToTeamMember(ct: CmsTeamMember): TeamMember {
  const content = ct.published_content || ct.draft_content;
  return {
    id: ct.id,
    name: content.name,
    role: content.role,
    department: content.department,
    bio: content.bio,
    story: content.story,
    photo_url: content.photo_url,
    linkedin_url: content.linkedin_url,
    twitter_url: content.twitter_url,
    sort_order: ct.sort_order,
    is_featured: Boolean(content.is_featured),
    is_published: ct.is_published,
    updated_at: ct.last_published_at || ct.updated_at
  };
}
