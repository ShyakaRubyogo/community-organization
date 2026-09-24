import {
  CmsGlobalSettings,
  CmsHomePageContent,
  CmsAboutPageContent,
  CmsInitiativesPageContent,
  CmsArticlesPageContent,
  CmsArticle,
  CmsInitiative,
  CmsTeamMember
} from '../types/cms';
import {
  mockOrganizationProfile,
  mockArticles,
  mockInitiatives,
  mockTeamMembers
} from './seedData';

export const defaultCmsGlobalSettings: CmsGlobalSettings = {
  brand_name: 'Atiak & Abdi',
  tagline: 'Cultivating resilient neighborhoods through community forests, clean water, and food sovereignty.',
  logo_type: 'icon',
  logo_icon: 'TreePine',
  logo_image: {
    url: '',
    alt_text: 'Atiak & Abdi Community Alliance Logo'
  },
  announcement_bar: {
    is_enabled: false,
    text: '🌱 Spring Neighborhood Tree Planting Day is coming up! Join our local hands-on planting team.',
    link_label: 'Learn More',
    link_href: '/initiatives'
  },
  navigation_links: [
    { id: 'nav-home', label: 'Home', href: '/' },
    { id: 'nav-about', label: 'About', href: '/about' },
    { id: 'nav-initiatives', label: 'Initiatives', href: '/initiatives' },
    { id: 'nav-articles', label: 'Articles', href: '/articles' }
  ],
  header_cta: {
    label: 'Get Involved',
    href: '/initiatives',
    is_visible: true
  },
  footer: {
    summary: 'A grassroots ecological organization planting shade, growing fresh food, and building resilient neighborhood systems in partnership with local residents.',
    nonprofit_notice: 'Registered 501(c)(3) community nonprofit organization. Contributions are tax-deductible to the extent allowed by law.',
    quick_links: [
      { id: 'fl-home', label: 'Home Overview', href: '/' },
      { id: 'fl-about', label: 'About Our Team', href: '/about' },
      { id: 'fl-initiatives', label: 'Active Initiatives', href: '/initiatives' },
      { id: 'fl-articles', label: 'Field Articles & Notes', href: '/articles' }
    ],
    focus_links: [
      { id: 'foc-forests', label: 'Community Forests', href: '/initiatives' },
      { id: 'foc-produce', label: 'Urban Food Sovereignty', href: '/initiatives' },
      { id: 'foc-water', label: 'Watershed Protection', href: '/initiatives' },
      { id: 'foc-youth', label: 'Youth Stewardship', href: '/initiatives' }
    ],
    address: '742 Willow Creek Way, Suite 104, East District',
    email: 'hello@atiakabdi.org',
    phone: '(555) 234-5678',
    copyright: `© ${new Date().getFullYear()} Atiak & Abdi Community Alliance. All rights reserved.`,
    socials: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  theme: {
    base_theme: 'warm-botanical',
    font_pairing: 'fraunces-karla',
    font_scale: 'normal',
    color_accent: 'ember',
    custom_accent_hex: '#EB7D00'
  }
};

export const defaultCmsHomePage: CmsHomePageContent = {
  seo: {
    meta_title: 'Atiak & Abdi | Community Alliance',
    meta_description: 'Cultivating resilient neighborhoods through community forests, clean water, and food sovereignty.'
  },
  hero: {
    headline: 'Cultivating resilient neighborhoods through community forests and food sovereignty.',
    description: 'We unite neighbors, youth, and local stewards to build healthy ecosystems and regenerative communities through hands-on ecological action.',
    primary_cta: {
      label: 'View initiatives',
      href: '/initiatives',
      is_visible: true
    },
    secondary_cta: {
      label: 'Read articles',
      href: '/articles',
      is_visible: true
    },
    hero_image: {
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      alt_text: 'Community volunteers planting saplings together in a neighborhood park'
    }
  },
  mission_band: {
    title: 'Rooted in neighborhood trust',
    description: 'Founded by local community organizers, Atiak & Abdi collaborates with neighborhood groups, schools, and volunteers to turn heat islands into productive fruit groves and living water catchments.',
    link_label: 'Learn more about our approach & story',
    link_href: '/about'
  },
  impact_band: {
    metrics: [
      { id: 'm-1', value: '1,420+', label: 'Native canopy trees planted' },
      { id: 'm-2', value: '8,600 lbs', label: 'Organic produce harvested' },
      { id: 'm-3', value: '4.2 mi', label: 'Riparian buffer restored' },
      { id: 'm-4', value: '95+', label: 'Youth fellows mentored' }
    ]
  },
  cta_band: {
    title: 'Ready to cultivate community resilience?',
    description: 'Explore our ongoing neighborhood initiatives, attend a community planting day, or learn how to bring a food forest to your block.',
    button: {
      label: 'Explore our initiatives',
      href: '/initiatives',
      is_visible: true
    }
  }
};

export const defaultCmsAboutPage: CmsAboutPageContent = {
  seo: {
    meta_title: 'About Atiak & Abdi | Community Alliance',
    meta_description: 'Learn about our grassroots mission, ecological values, history, and community team stewards.'
  },
  header: {
    title: 'About Atiak & Abdi',
    subtitle: 'An autonomous community organization restoring shade, clean water, and food sovereignty through collective grassroots stewardship.'
  },
  story: {
    heading: 'Our story & beginnings',
    paragraph1: 'Founded in 2018 by local community organizers, Atiak & Abdi began with a single volunteer tree-planting day on abandoned vacant lots. Today, we work hand-in-hand with over fifty neighborhood groups, municipal teams, and public schools.',
    paragraph2: 'We believe enduring ecological renewal cannot be dictated from afar; it must be built with the hands and hearts of the people who walk these sidewalks every morning. By replacing cracked asphalt with productive community fruit groves, clean water catchments, and living shade, we cultivate both neighborhood health and democratic power.',
    pull_quote: 'When neighbors come together with shovels and saplings, we are not just cooling our streets; we are reweaving the fabric of civic trust.',
    quote_author: 'Elena Rostova',
    quote_author_role: 'Founding Director & Lead Arborist',
    story_image: {
      url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
      alt_text: 'Volunteers and community coordinators gathered in a mature forest canopy'
    }
  },
  principles: {
    title: 'Our core principles',
    subtitle: 'Ecological rigor guided by neighborhood self-determination.',
    values: [
      {
        id: 'val-1',
        title: 'Neighborhood-Led Stewardship',
        description: 'Projects are conceived, guided, and maintained by the people who live on the block, ensuring deep long-term local care.',
        icon: 'Users'
      },
      {
        id: 'val-2',
        title: 'Ecological Integrity',
        description: 'We prioritize native biodiverse species, regenerative soil biology, and resilient water cycles tested for changing climates.',
        icon: 'Leaf'
      },
      {
        id: 'val-3',
        title: 'Environmental Justice',
        description: 'Canopy equity and fresh produce must be distributed fairly, targeting historically disinvested heat island districts.',
        icon: 'ShieldCheck'
      },
      {
        id: 'val-4',
        title: 'Shared Prosperity',
        description: 'Every initiative creates paid youth mentorships, neighborhood skill-building, and communal harvest abundance.',
        icon: 'HeartHandshake'
      }
    ]
  },
  cta: {
    title: 'Want to get involved?',
    description: 'Join our seasonal volunteer workdays or support our community nursery apprenticeships.',
    button_label: 'View active initiatives',
    button_href: '/initiatives'
  }
};

export const defaultCmsInitiativesPage: CmsInitiativesPageContent = {
  seo: {
    meta_title: 'Initiatives | Atiak & Abdi Community Alliance',
    meta_description: 'Discover hands-on community projects actively restoring ecosystems, producing local food, and mentoring youth across our bioregion.'
  },
  header: {
    title: 'Initiatives',
    subtitle: 'Discover hands-on community projects actively restoring ecosystems, producing local food, and mentoring youth across our bioregion.'
  }
};

export const defaultCmsArticlesPage: CmsArticlesPageContent = {
  seo: {
    meta_title: 'Articles & Field Notes | Atiak & Abdi Community Alliance',
    meta_description: 'Dispatches from the field covering microclimate research, perennial agriculture, watershed stewardship, and youth leadership.'
  },
  header: {
    title: 'Articles & Field Notes',
    subtitle: 'Dispatches from the field covering microclimate research, perennial agriculture, watershed stewardship, and youth leadership.'
  }
};

// Seed Articles mapped to CmsArticle structure
export const defaultCmsArticles: CmsArticle[] = mockArticles.map((art) => ({
  id: art.id,
  slug: art.slug,
  is_published: art.status === 'published',
  published_at: art.published_at || new Date().toISOString(),
  last_published_at: art.published_at || new Date().toISOString(),
  updated_at: art.updated_at || new Date().toISOString(),
  draft_content: {
    title: art.title,
    slug: art.slug,
    excerpt: art.excerpt || '',
    markdown_body: art.body || art.excerpt || '',
    cover_image: {
      url: art.cover_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      alt_text: art.title
    },
    category: art.categories?.[0]?.name || 'Field Notes',
    read_time_minutes: 5,
    author_name: art.author?.name || 'Atiak & Abdi Editorial Team',
    author_role: 'Field Contributor'
  },
  published_content: {
    title: art.title,
    slug: art.slug,
    excerpt: art.excerpt || '',
    markdown_body: art.body || art.excerpt || '',
    cover_image: {
      url: art.cover_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      alt_text: art.title
    },
    category: art.categories?.[0]?.name || 'Field Notes',
    read_time_minutes: 5,
    author_name: art.author?.name || 'Atiak & Abdi Editorial Team',
    author_role: 'Field Contributor'
  }
}));

// Seed Initiatives mapped to CmsInitiative structure
export const defaultCmsInitiatives: CmsInitiative[] = mockInitiatives.map((init, i) => ({
  id: init.id,
  slug: init.slug,
  is_published: init.status === 'published',
  sort_order: i + 1,
  last_published_at: init.updated_at || new Date().toISOString(),
  updated_at: init.updated_at || new Date().toISOString(),
  draft_content: {
    title: init.title,
    slug: init.slug,
    summary: init.summary || '',
    markdown_body: init.body || init.summary || '',
    hero_image: {
      url: init.hero_image_url || init.cover_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      alt_text: init.title
    },
    category: init.categories?.[0]?.name || 'Canopy Restoration',
    status: (init.status === 'published' ? 'active' : init.status === 'archived' ? 'completed' : 'upcoming'),
    location: init.location || 'Neighborhood District',
    start_date: init.start_date || '2023-01-01',
    end_date: init.end_date || undefined,
    external_link: init.external_link || undefined,
    metrics: (init.impact_metrics || []).map((m, idx) => ({
      id: `init-m-${idx}`,
      value: String(m.display_value || m.value || ''),
      label: m.label
    })),
    gallery_images: (init.media || []).map((img) => ({
      url: img.url,
      alt_text: img.alt_text || init.title,
      caption: img.caption || undefined
    }))
  },
  published_content: {
    title: init.title,
    slug: init.slug,
    summary: init.summary || '',
    markdown_body: init.body || init.summary || '',
    hero_image: {
      url: init.hero_image_url || init.cover_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      alt_text: init.title
    },
    category: init.categories?.[0]?.name || 'Canopy Restoration',
    status: (init.status === 'published' ? 'active' : init.status === 'archived' ? 'completed' : 'upcoming'),
    location: init.location || 'Neighborhood District',
    start_date: init.start_date || '2023-01-01',
    end_date: init.end_date || undefined,
    external_link: init.external_link || undefined,
    metrics: (init.impact_metrics || []).map((m, idx) => ({
      id: `init-m-${idx}`,
      value: String(m.display_value || m.value || ''),
      label: m.label
    })),
    gallery_images: (init.media || []).map((img) => ({
      url: img.url,
      alt_text: img.alt_text || init.title,
      caption: img.caption || undefined
    }))
  }
}));

// Seed Team Members mapped to CmsTeamMember structure
export const defaultCmsTeamMembers: CmsTeamMember[] = mockTeamMembers.map((tm) => ({
  id: tm.id,
  slug: tm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  is_published: tm.is_published,
  sort_order: tm.sort_order,
  last_published_at: tm.updated_at || new Date().toISOString(),
  updated_at: tm.updated_at || new Date().toISOString(),
  draft_content: {
    name: tm.name,
    role: tm.role,
    department: tm.department || 'Operations',
    bio: tm.bio || '',
    story: tm.story || '',
    photo_url: tm.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedin_url: tm.linkedin_url || undefined,
    twitter_url: tm.twitter_url || undefined,
    is_featured: tm.is_featured
  },
  published_content: {
    name: tm.name,
    role: tm.role,
    department: tm.department || 'Operations',
    bio: tm.bio || '',
    story: tm.story || '',
    photo_url: tm.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedin_url: tm.linkedin_url || undefined,
    twitter_url: tm.twitter_url || undefined,
    is_featured: tm.is_featured
  }
}));
