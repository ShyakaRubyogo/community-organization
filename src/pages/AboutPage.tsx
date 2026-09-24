import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Users, Leaf, ShieldCheck, HeartHandshake, TreePine } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCmsPage } from '../lib/useCmsPage';
import { CmsAboutPageContent } from '../types/cms';
import { defaultCmsAboutPage } from '../data/cmsSeedDefaults';
import { getOrganizationProfile, getTeamMembers } from '../lib/supabase';
import { fetchPublishedTeamMembers, cmsTeamMemberToTeamMember } from '../lib/cmsClient';
import { OrganizationProfile, TeamMember } from '../types/database';
import { Button } from '../components/common/Button';
import { TeamMemberCard } from '../components/common/TeamMemberCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

export const AboutPage: React.FC = () => {
  const { navigate, setPageMeta } = useRouter();
  const { content: cmsAbout } = useCmsPage<CmsAboutPageContent>('about', defaultCmsAboutPage);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orgProfile, cmsTeam] = await Promise.all([
        getOrganizationProfile(),
        fetchPublishedTeamMembers()
      ]);

      const team = cmsTeam.length > 0
        ? cmsTeam.map(cmsTeamMemberToTeamMember)
        : await getTeamMembers();

      setProfile(orgProfile);
      setTeamMembers(team);

      setPageMeta(
        cmsAbout.seo?.meta_title || `About ${orgProfile.name}`,
        cmsAbout.seo?.meta_description || 'Learn about our grassroots mission, ecological values, history, and community team stewards.'
      );
    } catch (err: any) {
      console.error('Failed to load about page:', err);
      setError(err?.message || 'Could not load organization information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [cmsAbout]);

  if (loading) {
    return <LoadingState message="Loading organization background & team..." />;
  }

  if (error || !profile) {
    return (
      <ErrorState
        title="Could not load About page"
        message={error || 'An unexpected error occurred.'}
        onRetry={loadData}
      />
    );
  }

  const iconMap: Record<string, React.ReactNode> = {
    Users: <Users className="w-8 h-8 text-[#2C5745]" />,
    Leaf: <Leaf className="w-8 h-8 text-[#2C5745]" />,
    ShieldCheck: <ShieldCheck className="w-8 h-8 text-[#2C5745]" />,
    HeartHandshake: <HeartHandshake className="w-8 h-8 text-[#2C5745]" />
  };

  return (
    <div className="pt-[80px]">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER (Left-aligned, max-width 640px) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F0] pt-16 pb-8 sm:pt-20 sm:pb-12 border-b border-[#E4DCC8]/60">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-[640px] space-y-3">
            <h1 className="font-['Fraunces'] font-semibold text-[38px] sm:text-[49px] leading-tight text-[#211C0D]">
              {cmsAbout.header?.title || `About ${profile.name}`}
            </h1>
            <p className="font-['Karla'] text-[18px] sm:text-[19px] leading-[29px] text-[#6B6350]">
              {cmsAbout.header?.subtitle || 'An autonomous community organization restoring shade, clean water, and food sovereignty through collective grassroots stewardship.'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STORY / MISSION / VISION (2 Columns 60/40) */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column (60%): Story + Mission & Vision Sub-blocks */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="font-['Fraunces'] font-semibold text-[25px] sm:text-[31px] text-[#211C0D] mb-4">
                  {cmsAbout.story?.heading || 'Our story & beginnings'}
                </h2>
                <div className="space-y-4 font-['Karla'] text-[16px] sm:text-[17px] leading-[28px] text-[#4A4437] max-w-[680px]">
                  <p>
                    {cmsAbout.story?.paragraph1 || profile.description || 'Founded in 2018 by local community organizers, Roots & Canopy Alliance began with a single volunteer tree-planting day on abandoned vacant lots. Today, we work hand-in-hand with over fifty neighborhood groups, municipal teams, and public schools.'}
                  </p>
                  <p>
                    {cmsAbout.story?.paragraph2 || 'We believe enduring ecological renewal cannot be dictated from afar; it must be built with the hands and hearts of the people who walk these sidewalks every morning. By replacing cracked asphalt with productive community fruit groves, clean water catchments, and living shade, we cultivate both neighborhood health and democratic power.'}
                  </p>
                </div>
              </div>

              {/* Mission & Vision Sub-blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E4DCC8]">
                <div className="space-y-2">
                  <h3 className="font-['Fraunces'] font-semibold text-[20px] text-[#211C0D]">
                    Our mission
                  </h3>
                  <p className="font-['Karla'] text-[15px] leading-[24px] text-[#4A4437]">
                    {profile.mission || 'We unite neighbors, youth, and local stewards to build healthy ecosystems and regenerative communities through hands-on ecological action, urban agriculture, and mutual aid.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-['Fraunces'] font-semibold text-[20px] text-[#211C0D]">
                    Our vision
                  </h3>
                  <p className="font-['Karla'] text-[15px] leading-[24px] text-[#4A4437]">
                    {profile.vision || 'Every neighborhood enjoys shaded streets, nourishing local food, restored watersheds, and sovereign green spaces managed by the people who call them home.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (40%): Pull-quote & Authentic Photo */}
            <div className="lg:col-span-5 space-y-8">
              {/* Pull-quote per 1.1 spec: 4px solid color-primary left border & color-cream background tint */}
              <div className="bg-[#EBE3A7] border-l-4 border-[#2C5745] p-6 sm:p-8 rounded-r-[12px] shadow-xs">
                <blockquote className="font-['Fraunces'] italic font-normal text-[20px] sm:text-[22px] leading-[32px] text-[#211C0D]">
                  “{cmsAbout.story?.pull_quote || 'When neighbors come together with shovels and saplings, we are not just fixing soil—we are healing the social fabric of our entire community.'}”
                </blockquote>
                <div className="mt-4 pt-3 border-t border-[#211C0D]/15 font-['Karla'] text-[14px] text-[#3D3319]">
                  <span className="font-semibold block text-[#211C0D]">{cmsAbout.story?.quote_author || 'Amara Chen'}</span>
                  <span>{cmsAbout.story?.quote_author_role || 'Executive Director & Neighborhood Organizer'}</span>
                </div>
              </div>

              {/* Supporting community photo with clipped-corner radius */}
              <div className="radius-photo overflow-hidden border border-[#E4DCC8] shadow-md bg-[#FFFFFF]">
                <img
                  src={cmsAbout.story?.story_image?.url || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?auto=format&fit=crop&w=800&q=80'}
                  alt={cmsAbout.story?.story_image?.alt_text || 'Community members cultivating the food forest'}
                  className="w-full h-[280px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VALUES / FOCUS AREAS (4 columns desktop) */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF] border-y border-[#E4DCC8]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-12 max-w-[640px]">
            <h2 className="font-['Fraunces'] font-semibold text-[31px] sm:text-[39px] text-[#211C0D]">
              {cmsAbout.principles?.title || 'Our core principles'}
            </h2>
            <p className="font-['Karla'] text-[18px] text-[#6B6350] mt-1">
              {cmsAbout.principles?.subtitle || 'Guiding how we listen, collaborate, and steward living systems across every neighborhood.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(cmsAbout.principles?.values || profile.values || []).map((val, idx) => (
              <div key={(val as any).id || `${val.title}-${idx}`} className="space-y-3">
                <div className="w-12 h-12 rounded-[8px] bg-[#FAF7F0] flex items-center justify-center border border-[#E4DCC8]">
                  {iconMap[val.icon] || <TreePine className="w-8 h-8 text-[#2C5745]" />}
                </div>
                <h3 className="font-['Fraunces'] font-semibold text-[20px] text-[#211C0D]">
                  {val.title}
                </h3>
                <p className="font-['Karla'] text-[15px] leading-[24px] text-[#4A4437]">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TEAM GRID (Roster, clicking opens Bio Modal) */}
      {/* ========================================================================= */}
      <section id="team" className="py-16 lg:py-24 bg-[#FAF7F0] scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-12 max-w-[640px]">
            <h2 className="font-['Fraunces'] font-semibold text-[31px] sm:text-[39px] text-[#211C0D]">
              Our stewards & team
            </h2>
            <p className="font-['Karla'] text-[18px] text-[#6B6350] mt-1">
              Click any team member card to read their background and personal connection to the work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FINAL CTA BAND */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-[#FAF7F0] border-t border-[#E4DCC8]/60">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 flex justify-center">
          <div className="bg-[#EBE3A7] rounded-[16px] border border-[#9C8B5E]/40 p-8 sm:p-12 text-center max-w-[560px] w-full shadow-xs space-y-4">
            <h3 className="font-['Fraunces'] font-semibold text-[25px] sm:text-[31px] text-[#211C0D] leading-tight">
              {cmsAbout.cta?.title || 'Want to get involved?'}
            </h3>
            <p className="font-['Karla'] text-[16px] text-[#3D3319] leading-relaxed">
              {cmsAbout.cta?.description || 'Whether you want to plant a street tree, join our volunteer days, or support a youth fellow, we welcome your hands.'}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(cmsAbout.cta?.button_href || '/initiatives')}
              >
                {cmsAbout.cta?.button_label || 'Explore our initiatives'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
