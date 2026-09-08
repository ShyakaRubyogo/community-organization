import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import {
  getOrganizationProfile,
  getFeaturedInitiatives,
  getArticles,
  getTeamMembers,
  getImpactHighlights
} from '../lib/supabase';
import {
  OrganizationProfile,
  Initiative,
  Article,
  TeamMember
} from '../types/database';
import { Button } from '../components/common/Button';
import { InitiativeCard } from '../components/common/InitiativeCard';
import { ArticleCard } from '../components/common/ArticleCard';
import { TeamMemberCard } from '../components/common/TeamMemberCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

export const HomePage: React.FC = () => {
  const { navigate, setPageMeta } = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [impactHighlights, setImpactHighlights] = useState<Array<{ label: string; value: string }>>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orgProfile, featuredInits, latestArticles, team, highlights] = await Promise.all([
        getOrganizationProfile(),
        getFeaturedInitiatives(3),
        getArticles(undefined, undefined, 3),
        getTeamMembers(),
        getImpactHighlights()
      ]);

      setProfile(orgProfile);
      setInitiatives(featuredInits);
      setArticles(latestArticles);
      setTeamMembers(team.filter(t => t.is_featured || t.sort_order <= 4));
      setImpactHighlights(highlights);

      setPageMeta(
        orgProfile.name,
        orgProfile.tagline || 'Cultivating resilient neighborhoods through community forests, clean water, and food sovereignty.'
      );
    } catch (err: any) {
      console.error('Failed to load homepage data:', err);
      setError(err?.message || 'Could not load community organization information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading community initiatives & impact..." />;
  }

  if (error || !profile) {
    return (
      <ErrorState
        title="Could not load homepage"
        message={error || 'An unexpected error occurred while loading content.'}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="pt-[80px]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (60/40 Asymmetric, Organic Blob flourish, Single Load-in) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F0] py-16 sm:py-20 lg:py-24 overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* 60% Column Left: Text & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6"
            >
              <h1 className="font-['Fraunces'] font-semibold text-[38px] sm:text-[48px] lg:text-[56px] leading-[1.1] text-[#211C0D] tracking-tight">
                {profile.tagline || 'Cultivating resilient neighborhoods through community forests and food sovereignty.'}
              </h1>

              <p className="font-['Karla'] text-[18px] sm:text-[19px] leading-[29px] text-[#4A4437] max-w-[640px]">
                {profile.mission || 'We unite neighbors, youth, and local stewards to build healthy ecosystems and regenerative communities through hands-on ecological action.'}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/initiatives')}
                >
                  View initiatives
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/articles')}
                >
                  Read articles
                </Button>
              </div>
            </motion.div>

            {/* 40% Column Right: Image with decorative organic blob flourish */}
            <div className="lg:col-span-5 relative">
              {/* Soft organic blob SVG flourish behind photo (color-primary 8% & color-cream 30%) */}
              <svg
                className="absolute -top-10 -left-10 w-[125%] h-[125%] pointer-events-none -z-0"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M410,310Q370,420,260,430Q150,440,95,345Q40,250,90,150Q140,50,255,65Q370,80,410,140Q450,200,410,310Z"
                  fill="#EBE3A7"
                  fillOpacity="0.35"
                />
                <path
                  d="M390,300Q350,400,250,410Q150,420,105,335Q60,250,100,160Q140,70,245,85Q350,100,390,150Q430,200,390,300Z"
                  fill="#2C5745"
                  fillOpacity="0.08"
                />
              </svg>

              {/* Photo with signature clipped-corner radius */}
              <div className="relative z-10 w-full aspect-[4/3] sm:aspect-[5/4] radius-photo overflow-hidden shadow-[0_12px_36px_rgba(33,28,13,0.12)] border border-[#E4DCC8]/80 bg-[#FFFFFF]">
                <img
                  src={profile.hero_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'}
                  alt="Community members planting together"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MISSION / OVERVIEW (Centered single column) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F0] py-16 lg:py-24 border-t border-[#E4DCC8]/60">
        <div className="max-w-[720px] mx-auto px-6 sm:px-8 text-center space-y-4">
          <h2 className="font-['Fraunces'] font-semibold text-[31px] sm:text-[39px] text-[#211C0D] tracking-tight">
            Rooted in neighborhood trust
          </h2>
          <p className="font-['Karla'] text-[18px] sm:text-[19px] leading-[29px] text-[#4A4437]">
            {profile.description || 'Founded by local community organizers, Roots & Canopy Alliance collaborates with neighborhood groups, schools, and volunteers to turn heat islands into productive fruit groves and living water catchments.'}
          </p>
          <div className="pt-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/about')}
            >
              Learn more about our approach & story
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED INITIATIVES (Header + 3-card grid) */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0] border-t border-[#E4DCC8]/60">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-['Fraunces'] font-semibold text-[31px] sm:text-[39px] leading-tight text-[#211C0D]">
                Featured initiatives
              </h2>
              <p className="font-['Karla'] text-[18px] text-[#6B6350] mt-1 max-w-[640px]">
                Ground-level ecological projects led by local block captains and youth apprentices.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/initiatives')}
              className="self-start sm:self-auto"
            >
              View all initiatives
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {initiatives.map((init) => (
              <InitiativeCard key={init.id} initiative={init} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LATEST ARTICLES (Header + 3-card grid on color-surface #FFFFFF band) */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF] border-y border-[#E4DCC8]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-['Fraunces'] font-semibold text-[31px] sm:text-[39px] leading-tight text-[#211C0D]">
                Latest articles & field notes
              </h2>
              <p className="font-['Karla'] text-[18px] text-[#6B6350] mt-1 max-w-[640px]">
                Reflections, soil data, and educational guides straight from our neighborhood field teams.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/articles')}
              className="self-start sm:self-auto"
            >
              View all articles
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. IMPACT HIGHLIGHTS (Full-bleed #211C0D band, 4-stat row in #EB7D00) */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-[#211C0D] text-[#FAF7F0]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#FAF7F0]/15">
            {impactHighlights.map((stat, idx) => (
              <div
                key={idx}
                className={`text-center flex flex-col justify-center ${
                  idx > 0 ? 'lg:px-6' : 'lg:pr-6'
                }`}
              >
                <span className="font-['Fraunces'] font-semibold text-[44px] lg:text-[49px] text-[#EB7D00] leading-tight">
                  {stat.value}
                </span>
                <span className="font-['Karla'] font-medium text-[16px] text-[#FAF7F0] mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TEAM PREVIEW (Avatar row + link to About) */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-[680px] mx-auto mb-12 space-y-2">
            <h2 className="font-['Fraunces'] font-semibold text-[31px] sm:text-[39px] text-[#211C0D]">
              Meet the people behind the work
            </h2>
            <p className="font-['Karla'] text-[18px] text-[#6B6350]">
              Arborists, agroecologists, youth mentors, and neighborhood coordinators working side-by-side.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-[900px] mx-auto">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} avatarOnly />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="ghost"
              onClick={() => navigate('/about#team')}
            >
              Meet the full team & leadership
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CTA BAND (Centered, Heritage Cream #EBE3A7 background) */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0] border-t border-[#E4DCC8]/60">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 flex justify-center">
          <div className="bg-[#EBE3A7] rounded-[16px] border border-[#9C8B5E]/40 p-8 sm:p-12 text-center max-w-[560px] w-full shadow-xs space-y-4">
            <h3 className="font-['Fraunces'] font-semibold text-[25px] sm:text-[31px] text-[#211C0D] leading-tight">
              Ready to cultivate community resilience?
            </h3>
            <p className="font-['Karla'] text-[16px] text-[#3D3319] leading-relaxed">
              Explore our ongoing neighborhood initiatives, attend a community planting day, or learn how to bring a food forest to your block.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/initiatives')}
              >
                Explore our initiatives
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
