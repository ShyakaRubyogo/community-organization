import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { getCategories, getInitiatives } from '../lib/supabase';
import { fetchPublishedInitiatives, cmsInitiativeToInitiative } from '../lib/cmsClient';
import { useCmsPage } from '../lib/useCmsPage';
import { defaultCmsInitiativesPage } from '../data/cmsSeedDefaults';
import { CmsInitiativesPageContent } from '../types/cms';
import { Category, Initiative } from '../types/database';
import { FilterBar } from '../components/common/FilterBar';
import { InitiativeCard } from '../components/common/InitiativeCard';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

export const InitiativesListingPage: React.FC = () => {
  const { queryParams, navigate, setPageMeta } = useRouter();
  const { content: cmsInitiatives } = useCmsPage<CmsInitiativesPageContent>('initiatives', defaultCmsInitiativesPage);

  const activeCategoryParam = queryParams.get('category') || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination / Load more state
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setPageMeta(
      cmsInitiatives.seo?.meta_title || 'Initiatives',
      cmsInitiatives.seo?.meta_description ||
        'Explore our active community initiatives in urban forestry, food sovereignty, watershed restoration, and youth apprenticeships.'
    );
  }, [setPageMeta, cmsInitiatives.seo]);

  const loadData = async (catSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch base categories
      const baseCats = await getCategories();

      // Fetch CMS published initiatives
      const cmsInits = await fetchPublishedInitiatives();
      let converted = cmsInits.map(cmsInitiativeToInitiative);

      // If no CMS initiatives returned or fallback needed
      if (converted.length === 0) {
        converted = await getInitiatives(catSlug === 'all' ? undefined : catSlug);
      } else if (catSlug !== 'all') {
        converted = converted.filter(i => 
          i.categories?.some(c => c.slug === catSlug || c.name.toLowerCase() === catSlug.toLowerCase())
        );
      }

      setCategories(baseCats);
      setInitiatives(converted);
    } catch (err: any) {
      console.error('Error fetching initiatives:', err);
      setError(err?.message || 'Failed to load initiatives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeCategoryParam);
    setVisibleCount(6);
  }, [activeCategoryParam]);

  const handleCategorySelect = (slug: string) => {
    if (slug === 'all') {
      navigate('/initiatives', { scroll: false });
    } else {
      navigate(`/initiatives?category=${slug}`, { scroll: false });
    }
  };

  const visibleInitiatives = initiatives.slice(0, visibleCount);
  const hasMore = visibleCount < initiatives.length;

  return (
    <div className="pt-[80px]">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER (Left-aligned, max-width 640px) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F0] pt-16 pb-8 sm:pt-20 sm:pb-12 border-b border-[#E4DCC8]/60">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-[640px] space-y-3">
            <h1 className="font-['Fraunces'] font-semibold text-[38px] sm:text-[49px] leading-tight text-[#211C0D]">
              {cmsInitiatives.header?.title || 'Initiatives'}
            </h1>
            <p className="font-['Karla'] text-[18px] sm:text-[19px] leading-[29px] text-[#6B6350]">
              {cmsInitiatives.header?.subtitle ||
                'Discover hands-on community projects actively restoring ecosystems, producing local food, and mentoring youth across our bioregion.'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FILTER BAR & LISTING GRID */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 bg-[#FAF7F0] min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          {/* Filter Bar */}
          <div className="border-b border-[#E4DCC8]/80 pb-4">
            <FilterBar
              categories={categories}
              activeCategorySlug={activeCategoryParam}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          {/* Loading */}
          {loading ? (
            <LoadingState message="Loading community initiatives..." />
          ) : error ? (
            <ErrorState
              title="Unable to load initiatives"
              message={error}
              onRetry={() => loadData(activeCategoryParam)}
            />
          ) : visibleInitiatives.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <p className="font-['Karla'] text-[18px] text-[#6B6350]">
                No initiatives found for this category yet.
              </p>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => handleCategorySelect('all')}
                >
                  Clear filter
                </Button>
              </div>
            </div>
          ) : (
            /* Cards Grid */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {visibleInitiatives.map((init) => (
                  <InitiativeCard key={init.id} initiative={init} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-8">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                  >
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
