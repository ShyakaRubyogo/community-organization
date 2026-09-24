import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ExternalLink, Activity, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { useRouter } from '../context/RouterContext';
import { getInitiativeBySlug, getRelatedInitiatives } from '../lib/supabase';
import { fetchPublishedInitiativeBySlug, cmsInitiativeToInitiative } from '../lib/cmsClient';
import { Initiative, MediaAsset } from '../types/database';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { InitiativeCard } from '../components/common/InitiativeCard';
import { LightboxModal } from '../components/common/LightboxModal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

interface InitiativeDetailPageProps {
  slug: string;
}

export const InitiativeDetailPage: React.FC<InitiativeDetailPageProps> = ({ slug }) => {
  const { navigate, setPageMeta } = useRouter();

  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [relatedInitiatives, setRelatedInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lightbox
  const [activeMedia, setActiveMedia] = useState<MediaAsset | null>(null);

  const loadData = async (targetSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check CMS published views first
      let found: Initiative | null = null;
      const cmsItem = await fetchPublishedInitiativeBySlug(targetSlug);
      if (cmsItem) {
        found = cmsInitiativeToInitiative(cmsItem);
      } else {
        found = await getInitiativeBySlug(targetSlug);
      }

      if (!found) {
        setError('Initiative not found. It may have been archived or moved.');
        return;
      }

      setInitiative(found);

      // Meta tags
      setPageMeta(
        found.meta_title || found.title,
        found.meta_description || found.summary || 'Details on this community initiative.'
      );

      // Related initiatives
      const categorySlugs = found.categories?.map((c) => c.slug) || [];
      const related = await getRelatedInitiatives(found.id, categorySlugs, 3);
      setRelatedInitiatives(related);
    } catch (err: any) {
      console.error('Error fetching initiative details:', err);
      setError(err?.message || 'Could not load initiative details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(slug);
  }, [slug]);

  if (loading) {
    return <LoadingState message="Loading initiative overview & field metrics..." />;
  }

  if (error || !initiative) {
    return (
      <ErrorState
        title="Initiative Not Found"
        message={error || 'We could not locate this initiative.'}
        onBack={() => navigate('/initiatives')}
        backLabel="Back to initiatives"
      />
    );
  }

  const heroImage = initiative.hero_image_url || initiative.cover_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80';

  const formattedStartDate = initiative.start_date
    ? new Date(initiative.start_date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    : null;

  const formattedEndDate = initiative.end_date
    ? new Date(initiative.end_date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    : 'Ongoing';

  // Split plain text body by double newlines into paragraphs
  const paragraphs = (initiative.body || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. DETAIL HERO (Full-bleed 480px/320px, Gradient Overlay, Inset Bottom-Left) */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] bg-[#211C0D] overflow-hidden">
        <img
          src={heroImage}
          alt={initiative.title}
          className="w-full h-full object-cover object-center"
        />

        {/* Gradient overlay per spec */}
        <div className="absolute inset-0 hero-gradient-overlay" />

        {/* Bottom-left content */}
        <div className="absolute inset-x-0 bottom-0 max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pb-8 sm:pb-12 lg:pb-14 z-10">
          <div className="max-w-[760px] space-y-3 text-[#FAF7F0]">
            {/* Category Pills & Status */}
            <div className="flex items-center gap-2 flex-wrap">
              {initiative.categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 rounded-[999px] text-[13px] font-['Karla'] font-semibold bg-[#FAF7F0]/20 text-[#FAF7F0] backdrop-blur-xs"
                >
                  {cat.name}
                </span>
              ))}
              <Badge variant="ongoing">Ongoing</Badge>
            </div>

            {/* Title */}
            <h1 className="font-['Fraunces'] font-semibold text-[32px] sm:text-[42px] lg:text-[49px] leading-[1.15] text-[#FAF7F0] tracking-tight">
              {initiative.title}
            </h1>

            {/* Location & Date meta */}
            <div className="flex items-center gap-4 flex-wrap text-[14px] text-[#FAF7F0]/85 font-['Karla'] pt-1">
              {initiative.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#EBE3A7]" />
                  <span>{initiative.location}</span>
                </div>
              )}
              {formattedStartDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#EBE3A7]" />
                  <span>
                    {formattedStartDate} — {formattedEndDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BODY (2 Columns: Main 66% / Sticky Sidebar 33%) */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 bg-[#FAF7F0]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main Content (66%) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Summary lead */}
              {initiative.summary && (
                <p className="font-['Karla'] text-[19px] sm:text-[20px] leading-[30px] font-normal text-[#211C0D] border-b border-[#E4DCC8] pb-6">
                  {initiative.summary}
                </p>
              )}

              {/* Body prose (constrained to 680px for optimal ~75ch readability) */}
              <div className="max-w-[680px] space-y-5 font-['Karla'] text-[16px] sm:text-[17px] leading-[28px] text-[#4A4437]">
                {initiative.body ? (
                  <div className="space-y-4">
                    <Markdown>{initiative.body}</Markdown>
                  </div>
                ) : (
                  paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar (33%, Sticky on Desktop) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="bg-[#FFFFFF] rounded-[16px] border border-[#E4DCC8] p-6 shadow-xs space-y-5">
                <h3 className="font-['Fraunces'] font-semibold text-[20px] text-[#211C0D] border-b border-[#E4DCC8] pb-3">
                  Quick facts
                </h3>

                {/* Location */}
                {initiative.location && (
                  <div>
                    <span className="font-['Karla'] font-medium text-[13px] text-[#6B6350] block">
                      Geographic focus
                    </span>
                    <span className="font-['Karla'] text-[15px] font-semibold text-[#211C0D]">
                      {initiative.location}
                    </span>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <span className="font-['Karla'] font-medium text-[13px] text-[#6B6350] block">
                    Initiative timeline
                  </span>
                  <span className="font-['Karla'] text-[15px] font-semibold text-[#211C0D]">
                    {formattedStartDate} — {formattedEndDate}
                  </span>
                </div>

                {/* Categories */}
                {initiative.categories && initiative.categories.length > 0 && (
                  <div>
                    <span className="font-['Karla'] font-medium text-[13px] text-[#6B6350] block mb-1.5">
                      Focus area
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {initiative.categories.map((c) => (
                        <Badge key={c.id} variant="category">
                          {c.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* External link if present */}
                {initiative.external_link && (
                  <div className="pt-2 border-t border-[#E4DCC8]">
                    <a
                      href={initiative.external_link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 h-[44px] px-4 rounded-[8px] bg-[#2C5745] text-[#FAF7F0] font-['Karla'] font-semibold text-[15px] hover:bg-[#234639] transition-all"
                    >
                      <span>Visit initiative portal</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. IMPACT METRICS (Light Variant Cards, 4-col desktop) */}
      {/* ========================================================================= */}
      {initiative.impact_metrics && initiative.impact_metrics.length > 0 && (
        <section className="py-16 bg-[#FFFFFF] border-y border-[#E4DCC8]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-10 max-w-[640px]">
              <h2 className="font-['Fraunces'] font-semibold text-[28px] sm:text-[35px] text-[#211C0D]">
                Measured impact & metrics
              </h2>
              <p className="font-['Karla'] text-[16px] text-[#6B6350] mt-1">
                Verified data collected directly by community stewards and field monitoring teams.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {initiative.impact_metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="bg-[#FAF7F0] rounded-[16px] border border-[#E4DCC8] p-6 flex flex-col justify-between"
                >
                  <Activity className="w-6 h-6 text-[#2C5745] mb-4" />
                  <div>
                    <span className="font-['Fraunces'] font-semibold text-[35px] text-[#2C5745] leading-none block">
                      {metric.display_value || `${metric.value} ${metric.unit || ''}`}
                    </span>
                    <span className="font-['Karla'] text-[14px] text-[#6B6350] mt-2 block font-medium">
                      {metric.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. GALLERY (Clipped-Corner Radius, Lightbox) */}
      {/* ========================================================================= */}
      {initiative.media && initiative.media.length > 0 && (
        <section className="py-16 bg-[#FAF7F0]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-10 max-w-[640px]">
              <h2 className="font-['Fraunces'] font-semibold text-[28px] sm:text-[35px] text-[#211C0D]">
                Field photo gallery
              </h2>
              <p className="font-['Karla'] text-[16px] text-[#6B6350] mt-1">
                Scenes from seasonal planting drives, community workshops, and ecological monitoring.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initiative.media.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setActiveMedia(asset)}
                  className="group relative aspect-[4/3] radius-photo overflow-hidden border border-[#E4DCC8] bg-[#FFFFFF] cursor-pointer shadow-xs hover:shadow-md transition-all duration-200"
                  tabIndex={0}
                  role="button"
                  aria-label={asset.caption || asset.alt_text || 'Open photo preview'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveMedia(asset);
                    }
                  }}
                >
                  <img
                    src={asset.thumbnail_url || asset.url}
                    alt={asset.alt_text || 'Field photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250 ease-out"
                    loading="lazy"
                  />
                  {asset.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#211C0D]/90 via-[#211C0D]/50 to-transparent p-4 text-[#FAF7F0] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="font-['Karla'] text-[13px] line-clamp-2">
                        {asset.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. UPDATES (Vertical Timeline with 2px Primary Left Border) */}
      {/* ========================================================================= */}
      {initiative.updates && initiative.updates.length > 0 && (
        <section className="py-16 bg-[#FFFFFF] border-t border-[#E4DCC8]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-10 max-w-[640px]">
              <h2 className="font-['Fraunces'] font-semibold text-[28px] sm:text-[35px] text-[#211C0D]">
                Chronological updates & milestones
              </h2>
              <p className="font-['Karla'] text-[16px] text-[#6B6350] mt-1">
                Progress logs recorded directly by the initiative coordinator and field captains.
              </p>
            </div>

            <div className="max-w-[760px] space-y-8 pl-4 sm:pl-6">
              {initiative.updates.map((upd) => (
                <div
                  key={upd.id}
                  className="border-l-2 border-[#2C5745] pl-6 py-1 space-y-1.5"
                >
                  <span className="font-['Karla'] font-medium text-[13px] text-[#6B6350]">
                    {new Date(upd.update_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <h3 className="font-['Fraunces'] font-semibold text-[20px] text-[#211C0D]">
                    {upd.title}
                  </h3>
                  {upd.body && (
                    <p className="font-['Karla'] text-[16px] leading-[26px] text-[#4A4437]">
                      {upd.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. RELATED INITIATIVES (3-card grid) */}
      {/* ========================================================================= */}
      {relatedInitiatives.length > 0 && (
        <section className="py-16 bg-[#FAF7F0] border-t border-[#E4DCC8]/60">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="font-['Fraunces'] font-semibold text-[28px] sm:text-[35px] text-[#211C0D]">
                  Related initiatives
                </h2>
                <p className="font-['Karla'] text-[16px] text-[#6B6350] mt-1">
                  Other grassroots projects addressing community resilience.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate('/initiatives')}
                className="hidden sm:inline-flex"
              >
                View all initiatives
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedInitiatives.map((rel) => (
                <InitiativeCard key={rel.id} initiative={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. CTA BAND */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF7F0] border-t border-[#E4DCC8]/60">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 flex justify-center">
          <div className="bg-[#EBE3A7] rounded-[16px] border border-[#9C8B5E]/40 p-8 sm:p-12 text-center max-w-[560px] w-full shadow-xs space-y-4">
            <h3 className="font-['Fraunces'] font-semibold text-[25px] sm:text-[31px] text-[#211C0D] leading-tight">
              Explore our stories & articles
            </h3>
            <p className="font-['Karla'] text-[16px] text-[#3D3319] leading-relaxed">
              Read in-depth field reflections, soil analysis guides, and interviews with community stewards.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/articles')}
              >
                Read related articles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        asset={activeMedia}
        isOpen={Boolean(activeMedia)}
        onClose={() => setActiveMedia(null)}
      />
    </div>
  );
};
