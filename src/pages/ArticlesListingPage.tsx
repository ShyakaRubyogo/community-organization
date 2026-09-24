import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { getCategories, getFeaturedArticle, getArticles } from '../lib/supabase';
import { fetchPublishedArticles, cmsArticleToArticle } from '../lib/cmsClient';
import { useCmsPage } from '../lib/useCmsPage';
import { defaultCmsArticlesPage } from '../data/cmsSeedDefaults';
import { CmsArticlesPageContent } from '../types/cms';
import { Category, Article } from '../types/database';
import { FilterBar } from '../components/common/FilterBar';
import { ArticleCard } from '../components/common/ArticleCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

export const ArticlesListingPage: React.FC = () => {
  const { queryParams, navigate, setPageMeta } = useRouter();
  const { content: cmsArticles } = useCmsPage<CmsArticlesPageContent>('articles', defaultCmsArticlesPage);

  const activeCategoryParam = queryParams.get('category') || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination / Load more
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setPageMeta(
      cmsArticles.seo?.meta_title || 'Articles & Field Notes',
      cmsArticles.seo?.meta_description ||
        'Read in-depth field reports, urban ecology insights, and stories from grassroots community stewards.'
    );
  }, [setPageMeta, cmsArticles.seo]);

  const loadData = async (catSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      const baseCats = await getCategories();
      setCategories(baseCats);

      // Fetch from CMS published collection
      const cmsItems = await fetchPublishedArticles();
      let allArticles = cmsItems.map(cmsArticleToArticle);

      if (allArticles.length === 0) {
        // Fallback to supabase/seed
        const [featArt, list] = await Promise.all([
          getFeaturedArticle(),
          getArticles(catSlug === 'all' ? undefined : catSlug)
        ]);
        setFeaturedArticle(featArt);
        setArticles(list);
        return;
      }

      // Filter by category if requested
      if (catSlug !== 'all') {
        allArticles = allArticles.filter(a =>
          a.categories?.some(c => c.slug === catSlug || c.name.toLowerCase() === catSlug.toLowerCase())
        );
      }

      // Find featured article
      const feat = allArticles.find(a => a.is_featured) || allArticles[0] || null;
      setFeaturedArticle(feat);

      // Grid articles (exclude featured if in 'all' view)
      const grid = (catSlug === 'all' && feat)
        ? allArticles.filter(a => a.id !== feat.id)
        : allArticles;

      setArticles(grid);
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err?.message || 'Failed to load articles.');
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
      navigate('/articles', { scroll: false });
    } else {
      navigate(`/articles?category=${slug}`, { scroll: false });
    }
  };

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <div className="pt-[80px]">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER (Left-aligned, max-width 640px) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F0] pt-16 pb-8 sm:pt-20 sm:pb-12 border-b border-[#E4DCC8]/60">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-[640px] space-y-3">
            <h1 className="font-['Fraunces'] font-semibold text-[38px] sm:text-[49px] leading-tight text-[#211C0D]">
              {cmsArticles.header?.title || 'Articles & Field Notes'}
            </h1>
            <p className="font-['Karla'] text-[18px] sm:text-[19px] leading-[29px] text-[#6B6350]">
              {cmsArticles.header?.subtitle ||
                'Dispatches from the field covering microclimate research, perennial agriculture, watershed stewardship, and youth leadership.'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED ARTICLE (Large horizontal card: 55% img / 45% text) */}
      {/* ========================================================================= */}
      {featuredArticle && activeCategoryParam === 'all' && (
        <section className="py-12 bg-[#FAF7F0] border-b border-[#E4DCC8]/60">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
            <div
              onClick={() => navigate(`/articles/${featuredArticle.slug}`)}
              className="group bg-[#FFFFFF] rounded-[16px] border border-[#E4DCC8] overflow-hidden cursor-pointer shadow-xs hover:shadow-[0_8px_24px_rgba(33,28,13,0.10)] transition-all duration-250 ease-out grid grid-cols-1 lg:grid-cols-12 focus-visible:outline-2 focus-visible:outline-[#C86A00]"
              tabIndex={0}
              role="link"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/articles/${featuredArticle.slug}`);
                }
              }}
            >
              {/* Image Column Left (55%) */}
              <div className="lg:col-span-7 p-3 sm:p-4">
                <div className="relative aspect-[16/9] w-full overflow-hidden radius-photo bg-[#FAF7F0]">
                  <img
                    src={featuredArticle.cover_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="featured">Featured story</Badge>
                  </div>
                </div>
              </div>

              {/* Content Column Right (45%) */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Category Pill */}
                  <div>
                    <Badge variant="category">
                      {featuredArticle.categories?.[0]?.name || 'Community'}
                    </Badge>
                  </div>

                  {/* Title (H4 Fraunces 600, 31px) */}
                  <h2 className="font-['Fraunces'] font-semibold text-[25px] sm:text-[31px] leading-[36px] text-[#211C0D] group-hover:text-[#2C5745] transition-colors">
                    {featuredArticle.title}
                  </h2>

                  {/* Full Excerpt (not clamped) */}
                  {featuredArticle.excerpt && (
                    <p className="font-['Karla'] text-[16px] sm:text-[17px] leading-[27px] text-[#4A4437]">
                      {featuredArticle.excerpt}
                    </p>
                  )}
                </div>

                {/* Byline + Date with Avatar */}
                <div className="pt-6 mt-6 border-t border-[#E4DCC8] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredArticle.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={featuredArticle.author?.name || 'Author'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-['Karla'] text-[14px] text-[#6B6350]">
                      By {featuredArticle.author?.name || 'Staff'},{' '}
                      {featuredArticle.published_at
                        ? new Date(featuredArticle.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Aug 12, 2026'}
                    </span>
                  </div>

                  <span className="font-['Karla'] font-semibold text-[14px] text-[#2C5745] group-hover:underline group-hover:underline-offset-4 hidden sm:inline-block">
                    Read article
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. FILTER BAR & ARTICLE GRID */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 bg-[#FAF7F0] min-h-[50vh]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          {/* Filter Bar */}
          <div className="border-b border-[#E4DCC8]/80 pb-4">
            <FilterBar
              categories={categories}
              activeCategorySlug={activeCategoryParam}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          {/* Loading / Error / Content */}
          {loading ? (
            <LoadingState message="Loading articles..." />
          ) : error ? (
            <ErrorState
              title="Unable to load articles"
              message={error}
              onRetry={() => loadData(activeCategoryParam)}
            />
          ) : visibleArticles.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <p className="font-['Karla'] text-[18px] text-[#6B6350]">
                No articles found in this category yet.
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {visibleArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} />
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
