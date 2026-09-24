-- =========================================================================
-- GREENFIELD CMS MIGRATION: Schema, Views, RLS, Storage & Publishing RPCs
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. CMS ADMINS TABLE & HARDENED AUTH FUNCTION
CREATE TABLE IF NOT EXISTS public.cms_admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cms_admins ENABLE ROW LEVEL SECURITY;

-- Hardened admin check: STABLE, SECURITY DEFINER, explicit search_path
CREATE OR REPLACE FUNCTION public.is_cms_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cms_admins WHERE id = auth.uid()
  );
$$;

-- Non-recursive policy for admin table
CREATE POLICY "Admins can view admin list"
  ON public.cms_admins
  FOR SELECT
  TO authenticated
  USING (public.is_cms_admin());

-- 4. GLOBAL SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.cms_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_cms_settings_updated_at
  BEFORE UPDATE ON public.cms_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Only authenticated CMS admins can select/modify base table
CREATE POLICY "Admins manage cms_settings"
  ON public.cms_settings
  FOR ALL
  TO authenticated
  USING (public.is_cms_admin())
  WITH CHECK (public.is_cms_admin());

-- 5. CMS PAGES TABLE
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  title TEXT NOT NULL,
  draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins manage cms_pages"
  ON public.cms_pages
  FOR ALL
  TO authenticated
  USING (public.is_cms_admin())
  WITH CHECK (public.is_cms_admin());

-- 6. CMS INITIATIVES TABLE
CREATE TABLE IF NOT EXISTS public.cms_initiatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.cms_initiatives ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_cms_initiatives_updated_at
  BEFORE UPDATE ON public.cms_initiatives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins manage cms_initiatives"
  ON public.cms_initiatives
  FOR ALL
  TO authenticated
  USING (public.is_cms_admin())
  WITH CHECK (public.is_cms_admin());

-- 7. CMS ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.cms_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.cms_articles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_cms_articles_updated_at
  BEFORE UPDATE ON public.cms_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins manage cms_articles"
  ON public.cms_articles
  FOR ALL
  TO authenticated
  USING (public.is_cms_admin())
  WITH CHECK (public.is_cms_admin());

-- 8. CMS TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.cms_team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.cms_team_members ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_cms_team_members_updated_at
  BEFORE UPDATE ON public.cms_team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins manage cms_team_members"
  ON public.cms_team_members
  FOR ALL
  TO authenticated
  USING (public.is_cms_admin())
  WITH CHECK (public.is_cms_admin());

-- 9. MEDIA ASSETS TABLE (Raster Only: JPEG, PNG, WEBP)
CREATE TABLE IF NOT EXISTS public.cms_media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
  size_bytes INTEGER NOT NULL CHECK (size_bytes <= 5242880),
  alt_text TEXT NOT NULL DEFAULT '',
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cms_media_assets ENABLE ROW LEVEL SECURITY;

-- Admins manage media assets
CREATE POLICY "Admins manage media assets"
  ON public.cms_media_assets
  FOR ALL
  TO authenticated
  USING (public.is_cms_admin())
  WITH CHECK (public.is_cms_admin());

-- =========================================================================
-- 10. PUBLIC-FACING SECURE VIEWS (DRAFT LEAK & ADMIN UUID REMEDIATION)
-- =========================================================================

-- View: Published Settings
CREATE OR REPLACE VIEW public.cms_settings_published
WITH (security_barrier = true) AS
SELECT
  id,
  published_content,
  last_published_at
FROM public.cms_settings;

-- View: Published Pages
CREATE OR REPLACE VIEW public.cms_pages_published
WITH (security_barrier = true) AS
SELECT
  id,
  slug,
  title,
  published_content,
  last_published_at
FROM public.cms_pages;

-- View: Published Initiatives
CREATE OR REPLACE VIEW public.cms_initiatives_published
WITH (security_barrier = true) AS
SELECT
  id,
  slug,
  sort_order,
  published_content,
  last_published_at
FROM public.cms_initiatives
WHERE is_published = true;

-- View: Published Articles
CREATE OR REPLACE VIEW public.cms_articles_published
WITH (security_barrier = true) AS
SELECT
  id,
  slug,
  published_at,
  published_content,
  last_published_at,
  updated_at
FROM public.cms_articles
WHERE is_published = true;

-- View: Published Team Members
CREATE OR REPLACE VIEW public.cms_team_members_published
WITH (security_barrier = true) AS
SELECT
  id,
  slug,
  sort_order,
  published_content,
  last_published_at
FROM public.cms_team_members
WHERE is_published = true;

-- View: Public Media Assets (Strips uploaded_by to prevent admin UUID leak)
CREATE OR REPLACE VIEW public.cms_media_assets_published
WITH (security_barrier = true) AS
SELECT
  id,
  storage_path,
  public_url,
  file_name,
  mime_type,
  size_bytes,
  alt_text,
  caption,
  created_at
FROM public.cms_media_assets;

-- 11. GRANT SELECT ON VIEWS ONLY TO ANON & AUTHENTICATED
GRANT SELECT ON public.cms_settings_published TO anon, authenticated;
GRANT SELECT ON public.cms_pages_published TO anon, authenticated;
GRANT SELECT ON public.cms_initiatives_published TO anon, authenticated;
GRANT SELECT ON public.cms_articles_published TO anon, authenticated;
GRANT SELECT ON public.cms_team_members_published TO anon, authenticated;
GRANT SELECT ON public.cms_media_assets_published TO anon, authenticated;

-- REVOKE ALL DIRECT SELECT ON BASE TABLES CONTAINING DRAFT DATA OR ADMIN UUIDs
REVOKE SELECT ON public.cms_settings FROM anon;
REVOKE SELECT ON public.cms_pages FROM anon;
REVOKE SELECT ON public.cms_initiatives FROM anon;
REVOKE SELECT ON public.cms_articles FROM anon;
REVOKE SELECT ON public.cms_team_members FROM anon;
REVOKE SELECT ON public.cms_media_assets FROM anon;

-- =========================================================================
-- 12. ATOMIC PUBLISH FUNCTIONS (SECURITY INVOKER, RETURNS TIMESTAMPTZ)
-- =========================================================================

-- Publish Page
CREATE OR REPLACE FUNCTION public.publish_cms_page(target_page_id TEXT)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
DECLARE
  publish_time TIMESTAMPTZ := NOW();
BEGIN
  UPDATE public.cms_pages
  SET
    published_content = draft_content,
    last_published_at = publish_time,
    updated_by = auth.uid()
  WHERE id = target_page_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Page with id % not found or permission denied.', target_page_id;
  END IF;

  RETURN publish_time;
END;
$$;

-- Publish Settings
CREATE OR REPLACE FUNCTION public.publish_cms_settings()
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
DECLARE
  publish_time TIMESTAMPTZ := NOW();
BEGIN
  UPDATE public.cms_settings
  SET
    published_content = draft_content,
    last_published_at = publish_time,
    updated_by = auth.uid()
  WHERE id = 'global';

  RETURN publish_time;
END;
$$;

-- Publish Article (Dedicated function with hardcoded SQL)
CREATE OR REPLACE FUNCTION public.publish_cms_article(target_article_id UUID)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
DECLARE
  publish_time TIMESTAMPTZ := NOW();
BEGIN
  UPDATE public.cms_articles
  SET
    published_content = draft_content,
    is_published = true,
    published_at = COALESCE(published_at, publish_time),
    last_published_at = publish_time,
    updated_by = auth.uid()
  WHERE id = target_article_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Article with id % not found or permission denied.', target_article_id;
  END IF;

  RETURN publish_time;
END;
$$;

-- Publish Initiative (Dedicated function with hardcoded SQL)
CREATE OR REPLACE FUNCTION public.publish_cms_initiative(target_initiative_id UUID)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
DECLARE
  publish_time TIMESTAMPTZ := NOW();
BEGIN
  UPDATE public.cms_initiatives
  SET
    published_content = draft_content,
    is_published = true,
    last_published_at = publish_time,
    updated_by = auth.uid()
  WHERE id = target_initiative_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Initiative with id % not found or permission denied.', target_initiative_id;
  END IF;

  RETURN publish_time;
END;
$$;

-- Publish Team Member (Dedicated function with hardcoded SQL)
CREATE OR REPLACE FUNCTION public.publish_cms_team_member(target_team_member_id UUID)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth
AS $$
DECLARE
  publish_time TIMESTAMPTZ := NOW();
BEGIN
  UPDATE public.cms_team_members
  SET
    published_content = draft_content,
    is_published = true,
    last_published_at = publish_time,
    updated_by = auth.uid()
  WHERE id = target_team_member_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Team member with id % not found or permission denied.', target_team_member_id;
  END IF;

  RETURN publish_time;
END;
$$;

-- =========================================================================
-- 13. STORAGE BUCKET POLICIES (cms-media)
-- =========================================================================
-- Note: Create the bucket 'cms-media' as PUBLIC in the Supabase Dashboard,
-- then apply these storage policies:

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND policyname = 'Public read cms-media objects'
  ) THEN
    CREATE POLICY "Public read cms-media objects"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'cms-media');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND policyname = 'Admin upload cms-media objects'
  ) THEN
    CREATE POLICY "Admin upload cms-media objects"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'cms-media'
        AND public.is_cms_admin()
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND policyname = 'Admin delete cms-media objects'
  ) THEN
    CREATE POLICY "Admin delete cms-media objects"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'cms-media'
        AND public.is_cms_admin()
      );
  END IF;
END $$;
