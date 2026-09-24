export interface CmsImageField {
  url: string;
  alt_text: string;
  caption?: string;
  asset_id?: string;
}

export interface CmsButtonField {
  label: string;
  href: string;
  is_visible: boolean;
  open_in_new_tab?: boolean;
}

export interface CmsMetricItem {
  id: string;
  value: string;
  label: string;
}

export interface CmsNavLink {
  id: string;
  label: string;
  href: string;
}

export interface CmsGlobalSettings {
  brand_name: string;
  tagline: string;
  logo_type?: 'icon' | 'image' | 'text';
  logo_icon?: 'TreePine' | 'Leaf' | 'Sprout' | 'Sun' | 'Heart' | 'Globe' | 'Mountain';
  logo_image?: CmsImageField;
  announcement_bar?: {
    is_enabled: boolean;
    text: string;
    link_label?: string;
    link_href?: string;
  };
  navigation_links: CmsNavLink[];
  header_cta: CmsButtonField;
  footer: {
    summary: string;
    nonprofit_notice: string;
    quick_links: CmsNavLink[];
    focus_links: CmsNavLink[];
    address: string;
    email: string;
    phone: string;
    copyright: string;
    socials: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  theme: {
    base_theme?: 'warm-botanical' | 'crisp-minimal' | 'warm-earth' | 'slate-pine';
    font_pairing: 'fraunces-karla' | 'lora-inter' | 'cormorant-plusjakarta' | 'playfair-source' | 'merriweather-sans' | 'custom-google';
    custom_font_display?: string;
    custom_font_body?: string;
    font_scale?: 'compact' | 'normal' | 'relaxed';
    color_accent: 'ember' | 'ochre' | 'terracotta' | 'sage' | 'ocean' | 'custom';
    custom_accent_hex?: string;
  };
}

export interface CmsHomePageContent {
  seo: {
    meta_title: string;
    meta_description: string;
  };
  hero: {
    headline: string;
    description: string;
    primary_cta: CmsButtonField;
    secondary_cta: CmsButtonField;
    hero_image: CmsImageField;
  };
  mission_band: {
    title: string;
    description: string;
    link_label: string;
    link_href: string;
  };
  impact_band: {
    metrics: CmsMetricItem[];
  };
  cta_band: {
    title: string;
    description: string;
    button: CmsButtonField;
  };
}

export interface CmsAboutPageContent {
  seo: {
    meta_title: string;
    meta_description: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
  story: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    pull_quote: string;
    quote_author: string;
    quote_author_role: string;
    story_image: CmsImageField;
  };
  principles: {
    title: string;
    subtitle: string;
    values: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    button_label: string;
    button_href: string;
  };
}

export interface CmsInitiativesPageContent {
  seo: {
    meta_title: string;
    meta_description: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
}

export interface CmsArticlesPageContent {
  seo: {
    meta_title: string;
    meta_description: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
}

export interface CmsArticle {
  id: string;
  slug: string;
  is_published: boolean;
  published_at?: string;
  draft_content: {
    title: string;
    slug: string;
    excerpt: string;
    markdown_body: string;
    cover_image: CmsImageField;
    category: string;
    read_time_minutes: number;
    author_name: string;
    author_role: string;
  };
  published_content: {
    title: string;
    slug: string;
    excerpt: string;
    markdown_body: string;
    cover_image: CmsImageField;
    category: string;
    read_time_minutes: number;
    author_name: string;
    author_role: string;
  };
  last_published_at?: string;
  updated_at?: string;
}

export interface CmsInitiative {
  id: string;
  slug: string;
  is_published: boolean;
  sort_order: number;
  draft_content: {
    title: string;
    slug: string;
    summary: string;
    markdown_body: string;
    hero_image: CmsImageField;
    category: string;
    status: 'active' | 'completed' | 'upcoming';
    location: string;
    start_date: string;
    end_date?: string;
    external_link?: string;
    metrics: CmsMetricItem[];
    gallery_images?: CmsImageField[];
  };
  published_content: {
    title: string;
    slug: string;
    summary: string;
    markdown_body: string;
    hero_image: CmsImageField;
    category: string;
    status: 'active' | 'completed' | 'upcoming';
    location: string;
    start_date: string;
    end_date?: string;
    external_link?: string;
    metrics: CmsMetricItem[];
    gallery_images?: CmsImageField[];
  };
  last_published_at?: string;
  updated_at?: string;
}

export interface CmsTeamMember {
  id: string;
  slug: string;
  is_published: boolean;
  sort_order: number;
  draft_content: {
    name: string;
    role: string;
    department: string;
    bio: string;
    story: string;
    photo_url: string;
    linkedin_url?: string;
    twitter_url?: string;
    is_featured: boolean;
  };
  published_content: {
    name: string;
    role: string;
    department: string;
    bio: string;
    story: string;
    photo_url: string;
    linkedin_url?: string;
    twitter_url?: string;
    is_featured: boolean;
  };
  last_published_at?: string;
  updated_at?: string;
}
