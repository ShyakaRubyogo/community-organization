/**
 * Database Types matching the Supabase SQL schema 1-to-1.
 */

export interface OrganizationProfile {
  id: number;
  name: string;
  legal_name?: string | null;
  tagline?: string | null;
  mission?: string | null;
  vision?: string | null;
  description?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  hero_image_url?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
  social_links: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  footer_text?: string | null;
  // Extended fields as specified in Technical Requirements:
  values?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  global_metrics?: Array<{
    label: string;
    value: string;
    notes?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string | null;
  bio?: string | null;
  story?: string | null;
  photo_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  sort_order: number;
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  avatar_url?: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Initiative {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  body?: string | null;
  cover_image_url?: string | null;
  hero_image_url?: string | null;
  location?: string | null;
  external_link?: string | null;
  status: 'draft' | 'published' | 'archived';
  start_date?: string | null;
  end_date?: string | null;
  is_featured: boolean;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
  // Joined relation fields for convenience
  categories?: Category[];
  impact_metrics?: ImpactMetric[];
  updates?: InitiativeUpdate[];
  media?: MediaAsset[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  cover_image_url?: string | null;
  author_id?: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
  // Joined relation fields
  author?: Author | null;
  categories?: Category[];
  media?: MediaAsset[];
}

export interface MediaAsset {
  id: string;
  url: string;
  thumbnail_url?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  media_type: 'image' | 'video' | 'document' | 'other';
  created_at?: string;
  updated_at?: string;
}

export interface ImpactMetric {
  id: string;
  initiative_id: string;
  label: string;
  value?: number | null;
  unit?: string | null;
  display_value?: string | null;
  notes?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface InitiativeUpdate {
  id: string;
  initiative_id: string;
  title: string;
  body?: string | null;
  update_date: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
