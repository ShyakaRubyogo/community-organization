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
  ? createClient(supabaseUrl.trim().replace(/\/+$/, ''), supabaseAnonKey.trim())
  : null;

/**
 * Fetch organization profile (resolved from memory fallback; CMS branding lives in cms_settings_published)
 */
export async function getOrganizationProfile(): Promise<OrganizationProfile> {
  return mockOrganizationProfile;
}

/**
 * Fetch published team members
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  return [...mockTeamMembers].sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Fetch active categories
 */
export async function getCategories(): Promise<Category[]> {
  return mockCategories.filter(c => c.is_active);
}

/**
 * Fetch featured initiatives for homepage
 */
export async function getFeaturedInitiatives(limit: number = 3): Promise<Initiative[]> {
  const featured = mockInitiatives
    .filter(i => i.status === 'published' && i.is_featured)
    .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime());

  if (featured.length >= limit) return featured.slice(0, limit);
  return mockInitiatives
    .filter(i => i.status === 'published')
    .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime())
    .slice(0, limit);
}

/**
 * Fetch initiatives with optional category filtering
 */
export async function getInitiatives(categorySlug?: string): Promise<Initiative[]> {
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
  const fallback = mockInitiatives.filter(i => i.id !== currentId && i.status === 'published');
  return fallback.slice(0, limit);
}

/**
 * Fetch featured article for homepage or listing hero
 */
export async function getFeaturedArticle(): Promise<Article | null> {
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
    list = list.filter(a =>
      a.categories?.some(c => c.slug === categorySlug || c.name.toLowerCase() === categorySlug.toLowerCase())
    );
  }

  list.sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime());

  if (limit && limit > 0) {
    return list.slice(0, limit);
  }
  return list;
}

/**
 * Fetch single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const found = mockArticles.find(a => a.slug === slug && a.status === 'published');
  return found || null;
}

/**
 * Fetch related articles
 */
export async function getRelatedArticles(currentId: string, categorySlugs: string[], limit: number = 3): Promise<Article[]> {
  const candidates = mockArticles.filter(a =>
    a.id !== currentId &&
    a.status === 'published' &&
    a.categories?.some(c => categorySlugs.includes(c.slug))
  );

  if (candidates.length >= limit) return candidates.slice(0, limit);
  const fallback = mockArticles.filter(a => a.id !== currentId && a.status === 'published');
  return fallback.slice(0, limit);
}

/**
 * Fetch impact metrics
 */
export async function getImpactMetrics(): Promise<ImpactMetric[]> {
  const metrics: ImpactMetric[] = [
    {
      id: 'metric-1',
      initiative_id: 'init-1',
      label: 'Native Canopy Trees Planted',
      value: 4280,
      display_value: '4,280',
      notes: 'Planted across urban heat corridors in 14 partner neighborhoods.',
      sort_order: 1
    },
    {
      id: 'metric-2',
      initiative_id: 'init-2',
      label: 'Lbs Fresh Produce Harvested',
      value: 86400,
      display_value: '86,400',
      notes: 'Distributed free to local food cooperatives and senior centers.',
      sort_order: 2
    },
    {
      id: 'metric-3',
      initiative_id: 'init-3',
      label: 'Gallons Stormwater Filtered',
      value: 1200000,
      display_value: '1.2M',
      notes: 'Diverted from city drains via bioswales and neighborhood rain gardens.',
      sort_order: 3
    },
    {
      id: 'metric-4',
      initiative_id: 'init-4',
      label: 'Youth Environmental Stewards',
      value: 310,
      display_value: '310',
      notes: 'Paid high school apprentices trained in urban arboriculture and stream health.',
      sort_order: 4
    }
  ];
  return metrics;
}
