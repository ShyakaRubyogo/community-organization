/**
 * Standalone Idempotent CMS Database Seeder
 * Run via: npx tsx scripts/seed-cms.ts
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.
 */

import { createClient } from '@supabase/supabase-js';
import {
  defaultCmsGlobalSettings,
  defaultCmsHomePage,
  defaultCmsAboutPage,
  defaultCmsInitiativesPage,
  defaultCmsArticlesPage,
  defaultCmsArticles,
  defaultCmsInitiatives,
  defaultCmsTeamMembers
} from '../src/data/cmsSeedDefaults';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\x1b[31mError:\x1b[0m SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to run this script.');
  console.error('Example: SUPABASE_URL="https://xyz.supabase.co" SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..." npx tsx scripts/seed-cms.ts');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedCms() {
  console.log('\x1b[36mStarting Idempotent CMS Greenfield Seed...\x1b[0m\n');

  // 1. Seed Global Settings
  const { data: existingSettings } = await supabase
    .from('cms_settings')
    .select('id')
    .eq('id', 'global')
    .maybeSingle();

  if (!existingSettings) {
    console.log('Seeding cms_settings (global)...');
    const { error } = await supabase.from('cms_settings').insert({
      id: 'global',
      draft_content: defaultCmsGlobalSettings,
      published_content: defaultCmsGlobalSettings,
      last_published_at: new Date().toISOString()
    });
    if (error) console.error('Failed to seed settings:', error.message);
    else console.log('✓ cms_settings seeded successfully.');
  } else {
    console.log('↷ cms_settings already exists, skipping.');
  }

  // 2. Seed Pages (home, about)
  const { count: pagesCount } = await supabase
    .from('cms_pages')
    .select('*', { count: 'exact', head: true });

  if (!pagesCount || pagesCount === 0) {
    console.log('Seeding cms_pages (home, about, initiatives, articles)...');
    const pages = [
      {
        id: 'home',
        slug: 'home',
        title: 'Home Page',
        draft_content: defaultCmsHomePage,
        published_content: defaultCmsHomePage,
        last_published_at: new Date().toISOString()
      },
      {
        id: 'about',
        slug: 'about',
        title: 'About Page',
        draft_content: defaultCmsAboutPage,
        published_content: defaultCmsAboutPage,
        last_published_at: new Date().toISOString()
      },
      {
        id: 'initiatives',
        slug: 'initiatives',
        title: 'Initiatives Page',
        draft_content: defaultCmsInitiativesPage,
        published_content: defaultCmsInitiativesPage,
        last_published_at: new Date().toISOString()
      },
      {
        id: 'articles',
        slug: 'articles',
        title: 'Articles Page',
        draft_content: defaultCmsArticlesPage,
        published_content: defaultCmsArticlesPage,
        last_published_at: new Date().toISOString()
      }
    ];
    const { error } = await supabase.from('cms_pages').insert(pages);
    if (error) console.error('Failed to seed pages:', error.message);
    else console.log('✓ cms_pages seeded successfully (4 pages).');
  } else {
    console.log('↷ cms_pages already populated, skipping.');
  }

  // 3. Seed Initiatives
  const { count: initiativesCount } = await supabase
    .from('cms_initiatives')
    .select('*', { count: 'exact', head: true });

  if (!initiativesCount || initiativesCount === 0) {
    console.log(`Seeding cms_initiatives (${defaultCmsInitiatives.length} items)...`);
    const records = defaultCmsInitiatives.map((init) => ({
      id: init.id,
      slug: init.slug,
      is_published: true,
      sort_order: init.sort_order,
      draft_content: init.draft_content,
      published_content: init.published_content,
      last_published_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('cms_initiatives').insert(records);
    if (error) console.error('Failed to seed initiatives:', error.message);
    else console.log(`✓ cms_initiatives seeded successfully (${records.length} items).`);
  } else {
    console.log('↷ cms_initiatives already populated, skipping.');
  }

  // 4. Seed Articles
  const { count: articlesCount } = await supabase
    .from('cms_articles')
    .select('*', { count: 'exact', head: true });

  if (!articlesCount || articlesCount === 0) {
    console.log(`Seeding cms_articles (${defaultCmsArticles.length} items)...`);
    const records = defaultCmsArticles.map((art) => ({
      id: art.id,
      slug: art.slug,
      is_published: true,
      published_at: art.published_at,
      draft_content: art.draft_content,
      published_content: art.published_content,
      last_published_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('cms_articles').insert(records);
    if (error) console.error('Failed to seed articles:', error.message);
    else console.log(`✓ cms_articles seeded successfully (${records.length} items).`);
  } else {
    console.log('↷ cms_articles already populated, skipping.');
  }

  // 5. Seed Team Members
  const { count: teamCount } = await supabase
    .from('cms_team_members')
    .select('*', { count: 'exact', head: true });

  if (!teamCount || teamCount === 0) {
    console.log(`Seeding cms_team_members (${defaultCmsTeamMembers.length} items)...`);
    const records = defaultCmsTeamMembers.map((tm) => ({
      id: tm.id,
      slug: tm.slug,
      is_published: true,
      sort_order: tm.sort_order,
      draft_content: tm.draft_content,
      published_content: tm.published_content,
      last_published_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('cms_team_members').insert(records);
    if (error) console.error('Failed to seed team members:', error.message);
    else console.log(`✓ cms_team_members seeded successfully (${records.length} items).`);
  } else {
    console.log('↷ cms_team_members already populated, skipping.');
  }

  console.log('\n\x1b[32m✔ Seeding Complete.\x1b[0m');
}

seedCms().catch((err) => {
  console.error('\x1b[31mFatal Seeding Error:\x1b[0m', err);
  process.exit(1);
});
