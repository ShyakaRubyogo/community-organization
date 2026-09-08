import {
  OrganizationProfile,
  Category,
  Author,
  TeamMember,
  Initiative,
  Article,
  MediaAsset
} from '../types/database';

export const mockMediaAssets: Record<string, MediaAsset> = {
  treePlantingHero: {
    id: 'media-01',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    alt_text: 'Community members and volunteers planting saplings together in a sunlit field',
    caption: 'Volunteers gathering for our Spring Planting Day in the eastern community corridor.',
    media_type: 'image'
  },
  foodForest1: {
    id: 'media-02',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?auto=format&fit=crop&w=600&q=80',
    alt_text: 'Lush organic community garden beds with ripe heirloom vegetables and flowers',
    caption: 'The Southside community food forest after its second harvest cycle.',
    media_type: 'image'
  },
  streamRestoration: {
    id: 'media-03',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    alt_text: 'Clean mountain stream flowing through revitalized native riparian buffers',
    caption: 'Native willow plantings along Pine Creek bio-filtering seasonal storm runoff.',
    media_type: 'image'
  },
  youthLearning: {
    id: 'media-04',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    alt_text: 'Diverse group of youth apprentices observing soil quality outdoors',
    caption: 'Youth fellows learning soil biology and pH testing during the summer workshop series.',
    media_type: 'image'
  },
  seedlingNursery: {
    id: 'media-05',
    url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80',
    alt_text: 'Rows of young native oak and fruit saplings in the community shadehouse',
    caption: 'Over 1,200 native saplings acclimatizing in the Eastside shadehouse.',
    media_type: 'image'
  },
  harvestBasket: {
    id: 'media-06',
    url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80',
    alt_text: 'Wooden crates overflowing with fresh kale, tomatoes, and stone fruit',
    caption: 'Weekly fresh harvest baskets ready for free neighborhood distribution.',
    media_type: 'image'
  },
  waterTesting: {
    id: 'media-07',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    alt_text: 'Community water stewardship technician taking water samples at stream edge',
    caption: 'Monthly water quality monitoring data published openly for community review.',
    media_type: 'image'
  }
};

export const mockOrganizationProfile: OrganizationProfile = {
  id: 1,
  name: 'Roots & Canopy Alliance',
  legal_name: 'Roots and Canopy Community Alliance Nonprofit',
  tagline: 'Cultivating resilient neighborhoods through community forests, clean water, and food sovereignty.',
  mission: 'We unite neighbors, youth, and local stewards to build healthy ecosystems and regenerative communities through hands-on ecological action, urban agriculture, and mutual aid.',
  vision: 'Every neighborhood enjoys shaded streets, nourishing local food, restored watersheds, and sovereign green spaces managed by the people who call them home.',
  description: 'Founded in 2018 by local neighborhood organizers and grassroots ecologists, Roots & Canopy Alliance began with a single volunteer tree-planting day on abandoned vacant lots. Today, we collaborate with over fifty neighborhood associations, public schools, and community centers to turn asphalt heat islands into productive fruit groves, living water catchments, and outdoor learning hubs. We believe lasting environmental justice is built through shared labor, localized knowledge, and unwavering trust.',
  logo_url: null,
  favicon_url: null,
  hero_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1400&q=80',
  contact_email: 'hello@rootsandcanopy.org',
  phone: '(555) 349-2810',
  address: '742 Willow Creek Way, Suite 104, Portland, OR 97202',
  social_links: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    youtube: 'https://youtube.com'
  },
  footer_text: 'Roots & Canopy Alliance is an autonomous community benefit organization registered as a 501(c)(3) nonprofit. All contributions directly support local tree canopy expansion, free community produce, and youth ecological apprenticeships.',
  values: [
    {
      title: 'Community-driven',
      description: 'Every project is initiated, co-designed, and stewarded by local residents who know their neighborhoods best.',
      icon: 'Users'
    },
    {
      title: 'Ecological Stewardship',
      description: 'We work in deep harmony with native plant species, living soils, and natural watershed hydrology to foster enduring resilience.',
      icon: 'Leaf'
    },
    {
      title: 'Deep Transparency',
      description: 'From seedling counts to budget allocations, we operate with radical openness, sharing every insight with our community.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Inclusive Empowerment',
      description: 'We cultivate leadership among youth and historically underserved residents, turning climate anxiety into tangible neighborhood power.',
      icon: 'HeartHandshake'
    }
  ],
  global_metrics: [
    { label: 'Communities supported', value: '50+' },
    { label: 'Beneficiaries reached', value: '12,400+' },
    { label: 'Active initiatives', value: '18' },
    { label: 'Volunteers involved', value: '450+' }
  ]
};

export const mockCategories: Category[] = [
  {
    id: 'cat-urban-forestry',
    name: 'Urban Forestry',
    slug: 'urban-forestry',
    description: 'Expanding the neighborhood tree canopy to cool urban heat islands and purify air.',
    is_active: true
  },
  {
    id: 'cat-food-sovereignty',
    name: 'Food Sovereignty',
    slug: 'food-sovereignty',
    description: 'Establishing perennial food forests, community orchards, and accessible garden hubs.',
    is_active: true
  },
  {
    id: 'cat-watershed-restoration',
    name: 'Watershed Restoration',
    slug: 'watershed-restoration',
    description: 'Reviving urban streams, rain gardens, and natural drainage corridors.',
    is_active: true
  },
  {
    id: 'cat-youth-ecology',
    name: 'Youth Ecology',
    slug: 'youth-ecology',
    description: 'Paid hands-on apprenticeships, outdoor education, and green career pathways for teens.',
    is_active: true
  }
];

export const mockAuthors: Author[] = [
  {
    id: 'author-maria',
    name: 'Maria Santos',
    slug: 'maria-santos',
    bio: 'Lead Agroecologist and co-founder of the Southside Seed Bank with twelve years of urban soil rehabilitation experience.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    is_published: true
  },
  {
    id: 'author-marcus',
    name: 'Marcus Vance',
    slug: 'marcus-vance',
    bio: 'Watershed biologist and community educator leading youth stream monitoring across our regional river basins.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    is_published: true
  },
  {
    id: 'author-elena',
    name: 'Elena Rostova',
    slug: 'elena-rostova',
    bio: 'Community coordinator and landscape architect specializing in green schoolyards and shade equity.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    is_published: true
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Amara Chen',
    role: 'Executive Director',
    department: 'Leadership & Strategy',
    bio: 'Grassroots organizer with 15 years in urban environmental justice and civic coalition building.',
    story: 'Amara grew up in the industrial corridor of the Eastside where shade trees were practically non-existent. After completing her degree in urban planning, she returned to her childhood neighborhood to organize block captains and launch the initial tree canopy census that sparked Roots & Canopy Alliance.',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://x.com',
    sort_order: 1,
    is_featured: true,
    is_published: true
  },
  {
    id: 'team-2',
    name: 'David Okafor',
    role: 'Director of Forestry Operations',
    department: 'Ecosystem Stewardship',
    bio: 'Certified arborist dedicated to species diversity, native seed saving, and urban heat mitigation.',
    story: 'David spent eight years managing municipal conservation districts before deciding to dedicate his technical forestry skills directly to grassroots neighborhood crews. He oversees our shadehouse propagation and tree health monitoring.',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://x.com',
    sort_order: 2,
    is_featured: true,
    is_published: true
  },
  {
    id: 'team-3',
    name: 'Maria Santos',
    role: 'Lead Agroecologist',
    department: 'Food Sovereignty',
    bio: 'Soil ecologist bridging indigenous planting knowledge with modern community food forest design.',
    story: 'Maria believes that a resilient neighborhood is one that can nourish its residents without corporate supply dependencies. She created the community seed library and mentors local garden stewards across four districts.',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://x.com',
    sort_order: 3,
    is_featured: true,
    is_published: true
  },
  {
    id: 'team-4',
    name: 'Marcus Vance',
    role: 'Youth Ecology Coordinator',
    department: 'Community Education',
    bio: 'Biologist and educator facilitating paid teen apprenticeships in stream monitoring and tree stewardship.',
    story: 'Marcus transitioned from academic lab research to community fieldwork after realizing that true environmental recovery requires training the next generation of youth to fall in love with their local waterways.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://x.com',
    sort_order: 4,
    is_featured: true,
    is_published: true
  },
  {
    id: 'team-5',
    name: 'Elena Rostova',
    role: 'Landscape Architect & Spatial Designer',
    department: 'Planning & Design',
    bio: 'Designing accessible public community parklets, rain gardens, and multi-generational gathering spaces.',
    story: 'Elena specializes in turning concrete medians and neglected rights-of-way into functional rain gardens that absorb stormwater while providing tranquil resting spots for neighborhood elders.',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://x.com',
    sort_order: 5,
    is_featured: false,
    is_published: true
  },
  {
    id: 'team-6',
    name: 'Julian Navarro',
    role: 'Volunteer & Community Organizer',
    department: 'Community Engagement',
    bio: 'Lifelong resident focused on bilingual outreach, neighborhood door-knocking, and tool-lending library logistics.',
    story: 'Julian joined Roots & Canopy as a teenage volunteer and now coordinates over 400 active volunteers across seasonal planting drives, community compost days, and bilingual gardening workshops.',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://x.com',
    sort_order: 6,
    is_featured: false,
    is_published: true
  }
];

export const mockInitiatives: Initiative[] = [
  {
    id: 'init-urban-canopy',
    title: 'Urban Canopy & Community Groves',
    slug: 'urban-canopy-initiative',
    summary: 'Planting 3,000 climate-adapted shade trees and establishing ten neighborhood community groves across urban heat corridors.',
    body: `Urban heat islands disproportionately burden low-income neighborhoods with surface temperatures up to twelve degrees higher than leafier districts. The Urban Canopy & Community Groves initiative combats this environmental disparity through focused, resident-led tree planting along pedestrian walkways, school perimeters, and neighborhood transit stops.

Each planting site is selected in consultation with local residents who take ownership of the young saplings. We install native and climate-resilient species—including drought-tolerant Valley Oaks, London Planes, and flowering redbuds—paired with passive tree-basin water catchments to reduce summer watering needs.

Beyond cooling ambient temperatures, expanding the urban canopy reduces ground-level ozone, buffers roadway noise, and provides a restorative green presence that demonstrably enhances mental well-being across our communities. Every tree is tagged with a QR code linking to open care guides and watering schedules maintained by neighborhood volunteer block stewards.`,
    cover_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
    location: 'Eastside Corridors & Greenways',
    external_link: 'https://canopy.rootsandcanopy.org',
    status: 'published',
    start_date: '2024-03-15',
    end_date: null,
    is_featured: true,
    published_at: '2024-03-20T10:00:00Z',
    meta_title: 'Urban Canopy & Community Groves | Roots & Canopy Alliance',
    meta_description: 'Discover how we are planting 3,000 shade trees to mitigate urban heat islands and bring green equity to our neighborhoods.',
    categories: [mockCategories[0]],
    impact_metrics: [
      {
        id: 'metric-1',
        initiative_id: 'init-urban-canopy',
        label: 'Trees planted to date',
        value: 1840,
        unit: 'trees',
        display_value: '1,840 trees',
        sort_order: 1
      },
      {
        id: 'metric-2',
        initiative_id: 'init-urban-canopy',
        label: 'Ambient cooling observed',
        value: 4.2,
        unit: '°F',
        display_value: '4.2°F drop',
        sort_order: 2
      },
      {
        id: 'metric-3',
        initiative_id: 'init-urban-canopy',
        label: 'Neighborhood block stewards',
        value: 142,
        unit: 'stewards',
        display_value: '142 stewards',
        sort_order: 3
      },
      {
        id: 'metric-4',
        initiative_id: 'init-urban-canopy',
        label: 'Square feet of asphalt depaved',
        value: 36000,
        unit: 'sq ft',
        display_value: '36,000 sq ft',
        sort_order: 4
      }
    ],
    updates: [
      {
        id: 'update-1',
        initiative_id: 'init-urban-canopy',
        title: 'Fall Planting Blitz surpasses 500 new saplings',
        body: 'Over 180 community members turned out across three consecutive Saturdays to depave dead grass medians and plant native oak groves along 8th Avenue.',
        update_date: '2025-10-18',
        sort_order: 1
      },
      {
        id: 'update-2',
        initiative_id: 'init-urban-canopy',
        title: 'Neighborhood Tree Basin Water Catchment Deployed',
        body: 'Installed 65 curb-cut bioswales in partnership with the local municipal drainage board, capturing 45,000 gallons of seasonal storm runoff directly to tree roots.',
        update_date: '2025-07-22',
        sort_order: 2
      },
      {
        id: 'update-3',
        initiative_id: 'init-urban-canopy',
        title: 'Launch of the Eastside Community Nursery',
        body: 'Constructed our first community-managed shadehouse to propagate native saplings locally from harvested acorns and wild seeds.',
        update_date: '2024-04-10',
        sort_order: 3
      }
    ],
    media: [
      mockMediaAssets.treePlantingHero,
      mockMediaAssets.seedlingNursery,
      mockMediaAssets.youthLearning
    ]
  },
  {
    id: 'init-community-food-forests',
    title: 'Community Seed & Food Forests',
    slug: 'community-food-forests',
    summary: 'Transforming unused vacant parcels into multi-layered public food forests that provide free organic fruit, herbs, and heritage greens.',
    body: `Food sovereignty means communities having democratic control over how their food is grown, harvested, and distributed. Our Community Seed & Food Forests initiative converts neglected civic easements and vacant lots into productive, perennial food ecosystems.

Unlike conventional annual gardens that require constant tilling and heavy inputs, our food forests mimic natural woodland ecology. We plant tall canopy fruit and nut trees (figs, persimmons, walnuts), understory berries (blackberries, currants), perennial culinary and medicinal herbs, and root crops that rebuild mycorrhizal soil fungi.

All food grown within these commons is completely free for neighborhood residents to forage and enjoy. We also host monthly harvest workshops, free seedling exchanges, and communal culinary gatherings to celebrate heritage recipes and preserve culinary traditions.`,
    cover_image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?auto=format&fit=crop&w=1200&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?auto=format&fit=crop&w=1600&q=80',
    location: 'Southside Commons & Valley Hub',
    external_link: 'https://foodforest.rootsandcanopy.org',
    status: 'published',
    start_date: '2023-09-01',
    end_date: null,
    is_featured: true,
    published_at: '2023-09-15T09:00:00Z',
    meta_title: 'Community Seed & Food Forests | Roots & Canopy Alliance',
    meta_description: 'Building public perennial food forests that yield free organic harvest and preserve heirloom seed varieties for our community.',
    categories: [mockCategories[1]],
    impact_metrics: [
      {
        id: 'metric-food-1',
        initiative_id: 'init-community-food-forests',
        label: 'Pounds of fresh organic produce distributed',
        value: 14200,
        unit: 'lbs',
        display_value: '14,200 lbs',
        sort_order: 1
      },
      {
        id: 'metric-food-2',
        initiative_id: 'init-community-food-forests',
        label: 'Active food forest sites established',
        value: 8,
        unit: 'sites',
        display_value: '8 sites',
        sort_order: 2
      },
      {
        id: 'metric-food-3',
        initiative_id: 'init-community-food-forests',
        label: 'Heirloom seed varieties conserved',
        value: 94,
        unit: 'varieties',
        display_value: '94 varieties',
        sort_order: 3
      },
      {
        id: 'metric-food-4',
        initiative_id: 'init-community-food-forests',
        label: 'Families receiving monthly produce baskets',
        value: 380,
        unit: 'families',
        display_value: '380 families',
        sort_order: 4
      }
    ],
    updates: [
      {
        id: 'update-food-1',
        initiative_id: 'init-community-food-forests',
        title: 'Record summer harvest distributes over 4,000 lbs of stone fruit',
        body: 'Our third-year plum and apricot trees yielded bountiful harvests shared across senior housing centers and community pantries.',
        update_date: '2025-08-30',
        sort_order: 1
      },
      {
        id: 'update-food-2',
        initiative_id: 'init-community-food-forests',
        title: 'Heritage Corn & Bean Seed Exchange gathers 120 gardeners',
        body: 'Gardeners shared heirloom seed stock passed down through generations, strengthening regional genetic diversity.',
        update_date: '2025-03-14',
        sort_order: 2
      }
    ],
    media: [
      mockMediaAssets.foodForest1,
      mockMediaAssets.harvestBasket,
      mockMediaAssets.seedlingNursery
    ]
  },
  {
    id: 'init-watershed-restoration',
    title: 'Watershed Restoration & Living Streams',
    slug: 'clean-watershed-coalition',
    summary: 'Restoring native riparian corridors, daylighting buried creek beds, and training citizen scientists to monitor urban water quality.',
    body: `Water is the circulatory system of our ecological bioregion. Decades of heavy industrialization and asphalt paving channeled Pine Creek and its tributary streams into underground concrete culverts, destroying salmon spawning beds and elevating neighborhood flash flooding risks.

The Watershed Restoration & Living Streams program brings community members together to heal our waterways. We replace invasive non-native blackberries with thousands of native willows, dogwoods, and alders whose dense root structures stabilize eroded banks and cool stream water for migrating aquatic life.

Volunteers and local high school science classes participate in monthly chemical and macro-invertebrate water sampling. By sharing this open-access data with municipal leaders, our coalition has helped secure state conservation protections for over six miles of critical urban riparian habitat.`,
    cover_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    location: 'Pine Creek & Lower Estuary Basin',
    external_link: 'https://watershed.rootsandcanopy.org',
    status: 'published',
    start_date: '2023-04-22',
    end_date: null,
    is_featured: true,
    published_at: '2023-05-01T08:00:00Z',
    meta_title: 'Watershed Restoration & Living Streams | Roots & Canopy Alliance',
    meta_description: 'Restoring native riparian corridors, daylighting creeks, and empowering community water monitors.',
    categories: [mockCategories[2]],
    impact_metrics: [
      {
        id: 'metric-water-1',
        initiative_id: 'init-watershed-restoration',
        label: 'Miles of riverbank restored',
        value: 6.8,
        unit: 'miles',
        display_value: '6.8 miles',
        sort_order: 1
      },
      {
        id: 'metric-water-2',
        initiative_id: 'init-watershed-restoration',
        label: 'Native riparian trees planted',
        value: 5200,
        unit: 'trees',
        display_value: '5,200 trees',
        sort_order: 2
      },
      {
        id: 'metric-water-3',
        initiative_id: 'init-watershed-restoration',
        label: 'Community water samples analyzed',
        value: 860,
        unit: 'samples',
        display_value: '860 samples',
        sort_order: 3
      },
      {
        id: 'metric-water-4',
        initiative_id: 'init-watershed-restoration',
        label: 'Tons of trash & scrap metal removed',
        value: 24,
        unit: 'tons',
        display_value: '24 tons',
        sort_order: 4
      }
    ],
    updates: [
      {
        id: 'update-water-1',
        initiative_id: 'init-watershed-restoration',
        title: 'Native Coho Salmon observed spawning in Pine Creek Upper Reach',
        body: 'For the first time in over twenty-two years, wildlife biologists documented returning native coho salmon swimming past the restored willow weir.',
        update_date: '2025-11-04',
        sort_order: 1
      },
      {
        id: 'update-water-2',
        initiative_id: 'init-watershed-restoration',
        title: 'Daylighting celebration at Pine Creek Confluence',
        body: 'Celebrated the removal of 800 feet of concrete culvert, restoring a natural meandering channel with gravel spawning beds.',
        update_date: '2024-09-18',
        sort_order: 2
      }
    ],
    media: [
      mockMediaAssets.streamRestoration,
      mockMediaAssets.waterTesting,
      mockMediaAssets.treePlantingHero
    ]
  },
  {
    id: 'init-youth-climate',
    title: 'Youth Ecology & Green Jobs Fellowship',
    slug: 'youth-climate-fellowship',
    summary: 'A paid 9-month ecological training fellowship for young adults entering green trades, urban forestry, and environmental justice careers.',
    body: `Young people inherit the steepest ecological challenges of our era, yet rarely have paid entry pathways into living-wage environmental careers. The Youth Ecology & Green Jobs Fellowship provides comprehensive 9-month paid cohorts for high school seniors and young adults ages 17 to 24.

Fellows earn a dignified hourly living wage while acquiring hands-on proficiencies in nursery horticulture, arborist rope techniques, GIS urban canopy mapping, and stormwater bioretention construction.

Alongside hard ecological skills, fellows lead environmental workshops for elementary schools, engage municipal decision-makers at council hearings, and complete capstone projects directly serving their home neighborhoods. Over 85% of program graduates successfully transition into conservation apprenticeships, park services, or higher environmental degree programs.`,
    cover_image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
    location: 'Civic Youth Center & Community Field Sites',
    external_link: null,
    status: 'published',
    start_date: '2024-01-10',
    end_date: null,
    is_featured: false,
    published_at: '2024-01-15T10:00:00Z',
    meta_title: 'Youth Ecology & Green Jobs Fellowship | Roots & Canopy Alliance',
    meta_description: 'Empowering young adults with paid green career training, ecological stewardship, and community organizing skills.',
    categories: [mockCategories[3]],
    impact_metrics: [
      {
        id: 'metric-youth-1',
        initiative_id: 'init-youth-climate',
        label: 'Fellows graduated to date',
        value: 64,
        unit: 'fellows',
        display_value: '64 fellows',
        sort_order: 1
      },
      {
        id: 'metric-youth-2',
        initiative_id: 'init-youth-climate',
        label: 'Paid living-wage hours logged',
        value: 18500,
        unit: 'hours',
        display_value: '18,500 hrs',
        sort_order: 2
      },
      {
        id: 'metric-youth-3',
        initiative_id: 'init-youth-climate',
        label: 'Career placement rate in green trades',
        value: 87,
        unit: '%',
        display_value: '87%',
        sort_order: 3
      },
      {
        id: 'metric-youth-4',
        initiative_id: 'init-youth-climate',
        label: 'Student workshop attendees reached',
        value: 2300,
        unit: 'students',
        display_value: '2,300 students',
        sort_order: 4
      }
    ],
    updates: [
      {
        id: 'update-youth-1',
        initiative_id: 'init-youth-climate',
        title: 'Class of 2025 cohort graduates with state arborist credentials',
        body: 'Twenty-four fellows completed their field training, with sixteen immediately placed in positions with municipal parks and restoration non-profits.',
        update_date: '2025-06-12',
        sort_order: 1
      }
    ],
    media: [
      mockMediaAssets.youthLearning,
      mockMediaAssets.seedlingNursery
    ]
  }
];

export const mockArticles: Article[] = [
  {
    id: 'art-urban-resilience',
    title: 'Planting Seeds of Urban Resilience: How Street Canopies Transform Neighborhood Health',
    slug: 'planting-seeds-of-urban-resilience',
    excerpt: 'Examining the empirical connection between continuous street tree shade, cardiovascular health, and reduced summer asthma flare-ups across working-class neighborhoods.',
    body: `Walk down a treeless boulevard in late July at three in the afternoon, and the physical toll of concrete becomes immediate. Thermal imaging reveals asphalt surface temperatures exceeding 135 degrees Fahrenheit, radiating heat well into the humid evening and preventing homes from cooling down naturally.

For the past five years, our community field crews have paired tree-planting drives with microclimate air quality stations. The data paints an undeniable story: blocks with mature tree canopies experience daytime temperatures four to eight degrees lower than adjacent barren corridors. More crucially, respiratory emergency visits drop measurably on streets lined with deciduous shade trees that intercept particulate matter and diesel soot.

Yet tree equity remains an unresolved civil rights question in modern cities. Historical redlining maps correlate almost perfectly with today’s shade deficits. In our alliance, we reject the notion that leafy streets are a luxury amenity reserved for affluent zip codes. By mobilizing neighbors to choose, plant, and care for their own street trees, we are not just adding greenery—we are reclaiming public health and neighborhood dignity from the ground up.

As we look toward the upcoming planting season, our collective priority remains expanding community groves in the areas that need cooling most urgently. Every sapling planted today is a living promise of shade, breathable air, and cooler summers for our children.`,
    cover_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    author_id: 'author-maria',
    author: mockAuthors[0],
    status: 'published',
    is_featured: true,
    published_at: '2026-08-12T09:00:00Z',
    meta_title: 'Planting Seeds of Urban Resilience | Roots & Canopy Alliance',
    meta_description: 'How street trees reduce asthma, lower surface heat, and restore health equity across urban communities.',
    categories: [mockCategories[0]],
    media: [mockMediaAssets.treePlantingHero, mockMediaAssets.seedlingNursery]
  },
  {
    id: 'art-food-sovereignty-guide',
    title: 'Nourishing Neighborhoods: A Grassroots Guide to Multi-Layered Food Forests',
    slug: 'nourishing-neighborhoods-food-sovereignty-guide',
    excerpt: 'Why perennial food systems outperform traditional row gardens in water conservation, soil microbiology, and year-round food security for urban families.',
    body: `Most traditional garden projects start with great excitement in April, only to struggle under July weeds and August heat waves when volunteer fatigue sets in. Annual vegetables like tomatoes and lettuces demand relentless watering, weeding, and compost replenishment.

Perennial food forestry changes this equation fundamentally. By mimicking the seven vertical layers of a natural forest edge—from deep-rooted walnut and chestnut trees down to berry shrubs, perennial herbs, and underground tubers—a food forest develops its own internal nutrient cycling and pest resilience.

In our Southside site, deep-rooted comfrey plants mine subsoil minerals and deposit them onto the surface as natural mulch each autumn. Nitrogen-fixing clover eliminates the need for chemical fertilizers. Within three seasons, the soil carbon content tripled, allowing the soil to retain moisture through even the driest midsummer stretches.

Most importantly, food forests invite genuine community foraging. Children learn that snacks do not only come from plastic wrappers in convenience stores—they grow on thornless blackberry canes and fig branches hanging low over public sidewalks, free for anyone in need.`,
    cover_image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?auto=format&fit=crop&w=1200&q=80',
    author_id: 'author-maria',
    author: mockAuthors[0],
    status: 'published',
    is_featured: false,
    published_at: '2026-07-28T14:30:00Z',
    meta_title: 'Nourishing Neighborhoods: Food Forest Guide | Roots & Canopy Alliance',
    meta_description: 'Learn how perennial food forests build soil microbiology, conserve water, and provide sovereign community nutrition.',
    categories: [mockCategories[1]],
    media: [mockMediaAssets.foodForest1, mockMediaAssets.harvestBasket]
  },
  {
    id: 'art-youth-climate-voices',
    title: 'Youth Voices on the Climate Frontline: Beyond Anxiety to Tangible Action',
    slug: 'youth-voices-on-the-climate-frontline',
    excerpt: 'Meet three graduates of our Youth Ecology Fellowship who turned eco-anxiety into hands-on leadership, habitat restoration, and living-wage careers.',
    body: `Survey after survey documents that over seventy percent of young people feel profound anxiety regarding the ecological future. When climate discourse is confined to doom-laden headlines and political paralysis, hopelessness is an understandable response.

The antidote to despair is communal physical action. In our Youth Ecology Fellowship, teens don’t just read about climate science on screens—they dig bioswales with shovels, take GPS tree inventories in their own neighborhoods, and test local stream water for dissolved oxygen and micro-pollutants.

"Before the fellowship, I felt like the world was burning and nobody cared," explains Tiana Rodriguez, an 18-year-old fellow from the Valley district. "The first time we planted fifty native dogwoods along the creek, and I watched the water clear up after rain, I realized change is physical. It lives in your hands."

Today, Tiana and her fellow apprentices are leading weekend workshops for middle-schoolers and advising our regional watershed council on youth conservation priorities. When we pay young leaders fair wages to heal their own surroundings, we aren't just restoring land—we are regenerating our collective sense of possibility.`,
    cover_image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    author_id: 'author-marcus',
    author: mockAuthors[1],
    status: 'published',
    is_featured: false,
    published_at: '2026-06-19T11:15:00Z',
    meta_title: 'Youth Voices on the Climate Frontline | Roots & Canopy Alliance',
    meta_description: 'How paid youth ecological fellowships turn climate despair into tangible neighborhood leadership and green jobs.',
    categories: [mockCategories[3]],
    media: [mockMediaAssets.youthLearning]
  },
  {
    id: 'art-clean-watersheds-revive',
    title: 'How Clean Watersheds Revive Community Health and Biodiversity',
    slug: 'how-clean-watersheds-revive-community-health',
    excerpt: 'The remarkable return of native coho salmon to Pine Creek reveals the healing power of daylighted streams and native riparian buffer zones.',
    body: `For over fifty years, Pine Creek was treated as little more than an open sewer before being buried inside a dark underground concrete pipe beneath industrial storage yards. Older residents recalled swimming in its waters as children, but younger generations grew up never knowing a living stream flowed right beneath their feet.

In 2022, our coalition launched a concerted campaign to daylight an 800-foot reach of the creek at the community park confluence. Working alongside municipal hydrologists and hundreds of volunteer weeders, we removed cracked asphalt, re-carved natural meanders, and planted over five thousand native willow and sedge cuttings.

Last November, an astonishing milestone occurred: our citizen science monitors spotted five pairs of native coho salmon swimming up through the daylighted reach to spawn in gravel beds that had been sealed under concrete for half a century.

Clean water connects every aspect of urban life. When we give water room to breathe and filter through living soil, we reduce street flooding, lower ambient air temperatures, and restore a sacred bond between urban dwellers and the wild creatures sharing our home.`,
    cover_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    author_id: 'author-marcus',
    author: mockAuthors[1],
    status: 'published',
    is_featured: false,
    published_at: '2026-05-14T08:45:00Z',
    meta_title: 'How Clean Watersheds Revive Community Health | Roots & Canopy Alliance',
    meta_description: 'The return of spawning salmon to daylighted Pine Creek shows the power of citizen science and riparian restoration.',
    categories: [mockCategories[2]],
    media: [mockMediaAssets.streamRestoration, mockMediaAssets.waterTesting]
  },
  {
    id: 'art-annual-impact-report',
    title: 'Our Annual Community Impact Report: Five Years of Grassroots Growth',
    slug: 'our-annual-community-impact-report-2025',
    excerpt: 'Reflecting on 1,800+ trees planted, 14,000 lbs of free food harvested, and the expanding community coalition powering our collective future.',
    body: `Five years ago, Roots & Canopy Alliance was an idea scribbled on a legal pad in a neighborhood coffee shop. Today, it is an autonomous movement of over 450 active volunteers, six dedicated staff stewards, and dozens of civic partners united in common cause.

This year’s annual review reflects our deepest community commitment: radical transparency and shared accountability. Over the past twelve months, we completed our largest depaving drive to date, established two new perennial food forests in food-insecure transit corridors, and mentored twenty-four youth fellows who logged more than 18,000 paid hours of ecological fieldwork.

None of this happens in isolation. It happens because block captains water saplings during drought emergencies; because elders share heirloom seeds that survived generations of migration; and because everyday neighbors believe that our streets deserve shade, beauty, and life.

Thank you for standing with us, getting your boots muddy, and cultivating a cooler, greener, and more compassionate home for everyone.`,
    cover_image_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80',
    author_id: 'author-elena',
    author: mockAuthors[2],
    status: 'published',
    is_featured: false,
    published_at: '2026-03-02T12:00:00Z',
    meta_title: 'Our Annual Community Impact Report | Roots & Canopy Alliance',
    meta_description: 'A five-year retrospective on trees planted, food distributed, and community stewardship across our alliance.',
    categories: [mockCategories[0], mockCategories[1]],
    media: [mockMediaAssets.seedlingNursery, mockMediaAssets.treePlantingHero]
  }
];
