import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  OrganizationProfile,
  Category,
  TeamMember,
  Initiative,
  Article,
  ImpactMetric
} from '../types/database';
import {
  mockOrganizationProfile,
  mockCategories,
  mockTeamMembers,
  mockInitiatives,
  mockArticles
} from '../data/seedData';

// Safe environment variable retrieval
const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_SUPABASE_URL
  : '';
const supabaseAnonKey = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== ''
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch organization profile
 */
export async function getOrganizationProfile(): Promise<OrganizationProfile> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('organization_profile')
        .select('*')
        .eq('id', 1)
        .single();

      if (!error && data) {
        return {
          ...mockOrganizationProfile,
          ...data,
          values: data.values || mockOrganizationProfile.values,
          global_metrics: data.global_metrics || mockOrganizationProfile.global_metrics
        };
      }
    } catch {
      // Fall through to mock data
    }
  }
  return mockOrganizationProfile;
}

/**
 * Fetch published team members
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as TeamMember[];
      }
    } catch {
      // Fall through
    }
  }
  return [...mockTeamMembers].sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Fetch active categories
 */
export async function getCategories(): Promise<Category[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // Fall through
    }
  }
  return mockCategories.filter(c => c.is_active);
}

/**
 * Fetch featured initiatives for homepage
 */
export async function getFeaturedInitiatives(limit: number = 3): Promise<Initiative[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('initiatives')
        .select(`
          *,
          initiative_categories (
            category_id,
            categories (*)
          )
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          categories: item.initiative_categories?.map((ic: any) => ic.categories).filter(Boolean) || []
        })) as Initiative[];
      }
    } catch {
      // Fall through
    }
  }
  const featured = mockInitiatives
    .filter(i => i.status === 'published' && i.is_featured)
    .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime());

  if (featured.length >= limit) return featured.slice(0, limit);
  // Fallback: latest published overall if fewer than limit exist
  return mockInitiatives
    .filter(i => i.status === 'published')
    .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime())
    .slice(0, limit);
}

/**
 * Fetch initiatives with optional category filtering
 */
export async function getInitiatives(categorySlug?: string): Promise<Initiative[]> {
  if (supabase) {
    try {
      let query = supabase
        .from('initiatives')
        .select(`
          *,
          initiative_categories!inner (
            category_id,
            categories!inner (*)
          )
        `)
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('published_at', { ascending: false });

      if (categorySlug && categorySlug !== 'all') {
        query = query.eq('initiative_categories.categories.slug', categorySlug);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          categories: item.initiative_categories?.map((ic: any) => ic.categories).filter(Boolean) || []
        })) as Initiative[];
      }
    } catch {
      // Fall through
    }
  }

  let list = mockInitiatives.filter(i => i.status === 'published');
  if (categorySlug && categorySlug !== 'all') {
    list = list.filter(i => i.categories?.some(c => c.slug === categorySlug));
  }
  return list.sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime();
  });
}

/**
 * Fetch single initiative by slug
 */
export async function getInitiativeBySlug(slug: string): Promise<Initiative | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('initiatives')
        .select(`
          *,
          impact_metrics (*),
          initiative_updates (*),
          initiative_categories (
            category_id,
            categories (*)
          ),
          initiative_media (
            sort_order,
            media_assets (*)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        return {
          ...data,
          categories: data.initiative_categories?.map((ic: any) => ic.categories).filter(Boolean) || [],
          impact_metrics: (data.impact_metrics || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
          updates: (data.initiative_updates || []).sort((a: any, b: any) => new Date(b.update_date).getTime() - new Date(a.update_date).getTime()),
          media: data.initiative_media?.map((im: any) => im.media_assets).filter(Boolean) || []
        } as Initiative;
      }
    } catch {
      // Fall through
    }
  }

  const found = mockInitiatives.find(i => i.slug === slug && i.status === 'published');
  return found || null;
}

/**
 * Fetch related initiatives sharing a category
 */
export async function getRelatedInitiatives(currentId: string, categoryIds: string[], limit: number = 3): Promise<Initiative[]> {
  const candidates = mockInitiatives.filter(i =>
    i.id !== currentId &&
    i.status === 'published' &&
    i.categories?.some(c => categoryIds.includes(c.id) || categoryIds.includes(c.slug))
  );

  if (candidates.length >= limit) return candidates.slice(0, limit);
  // Fallback: any other published initiatives
  const fallback = mockInitiatives.filter(i => i.id !== currentId && i.status === 'published');
  return fallback.slice(0, limit);
}

/**
 * Fetch featured article for homepage or listing hero
 */
export async function getFeaturedArticle(): Promise<Article | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors (*),
          article_categories (
            categories (*)
          )
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        return {
          ...data,
          author: data.authors,
          categories: data.article_categories?.map((ac: any) => ac.categories).filter(Boolean) || []
        } as Article;
      }
    } catch {
      // Fall through
    }
  }

  const featured = mockArticles.find(a => a.status === 'published' && a.is_featured);
  return featured || mockArticles[0] || null;
}

/**
 * Fetch articles with optional category filtering and slug exclusion
 */
export async function getArticles(categorySlug?: string, excludeSlug?: string, limit?: number): Promise<Article[]> {
  let list = mockArticles.filter(a => a.status === 'published');

  if (excludeSlug) {
    list = list.filter(a => a.slug !== excludeSlug);
  }

  if (categorySlug && categorySlug !== 'all') {
    list = list.filter(a => a.categories?.some(c => c.slug === categorySlug));
  }

  list = list.sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime());

  if (limit) {
    return list.slice(0, limit);
  }
  return list;
}

/**
 * Fetch single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors (*),
          article_categories (
            categories (*)
          ),
          article_media (
            sort_order,
            media_assets (*)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        return {
          ...data,
          author: data.authors,
          categories: data.article_categories?.map((ac: any) => ac.categories).filter(Boolean) || [],
          media: data.article_media?.map((am: any) => am.media_assets).filter(Boolean) || []
        } as Article;
      }
    } catch {
      // Fall through
    }
  }

  const found = mockArticles.find(a => a.slug === slug && a.status === 'published');
  return found || null;
}

/**
 * Fetch related articles sharing at least one category
 */
export async function getRelatedArticles(currentId: string, categorySlugs: string[], limit: number = 3): Promise<Article[]> {
  const candidates = mockArticles.filter(a =>
    a.id !== currentId &&
    a.status === 'published' &&
    a.categories?.some(c => categorySlugs.includes(c.slug) || categorySlugs.includes(c.id))
  );

  if (candidates.length >= limit) return candidates.slice(0, limit);
  const fallback = mockArticles.filter(a => a.id !== currentId && a.status === 'published');
  return fallback.slice(0, limit);
}

/**
 * Get Impact Highlights metrics for Home
 */
export async function getImpactHighlights(): Promise<Array<{ label: string; value: string; notes?: string }>> {
  const profile = await getOrganizationProfile();
  if (profile.global_metrics && profile.global_metrics.length > 0) {
    return profile.global_metrics;
  }
  return [
    { label: 'Communities supported', value: '50+' },
    { label: 'Beneficiaries reached', value: '12,400+' },
    { label: 'Active initiatives', value: '18' },
    { label: 'Volunteers involved', value: '450+' }
  ];
}
