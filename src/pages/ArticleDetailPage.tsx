import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { getArticleBySlug, getRelatedArticles } from '../lib/supabase';
import { Article } from '../types/database';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ArticleCard } from '../components/common/ArticleCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

interface ArticleDetailPageProps {
  slug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug }) => {
  const { navigate, setPageMeta } = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (targetSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      const found = await getArticleBySlug(targetSlug);
      if (!found) {
        setError('Article not found. It may have been archived or removed.');
        return;
      }

      setArticle(found);

      setPageMeta(
        found.meta_title || found.title,
        found.meta_description || found.excerpt || 'Community organization article and field notes.'
      );

      const categorySlugs = found.categories?.map((c) => c.slug) || [];
      const related = await getRelatedArticles(found.id, categorySlugs, 3);
      setRelatedArticles(related);
    } catch (err: any) {
      console.error('Error fetching article detail:', err);
      setError(err?.message || 'Could not load article.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(slug);
  }, [slug]);

  if (loading) {
    return <LoadingState message="Loading article & field analysis..." />;
  }

  if (error || !article) {
    return (
      <ErrorState
        title="Article Not Found"
        message={error || 'We could not locate this article.'}
        onBack={() => navigate('/articles')}
        backLabel="Back to all articles"
      />
    );
  }

  const primaryCategory = article.categories?.[0]?.name || 'Field Notes';
  const authorName = article.author?.name || 'Roots & Canopy Staff';
  const authorAvatar = article.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Aug 12, 2026';

  const paragraphs = (article.body || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="pt-[80px]">
      {/* ========================================================================= */}
      {/* 1. ARTICLE HEADER (Centered, max-width 720px) */}
      {/* ========================================================================= */}
      <header className="pt-16 pb-8 bg-[#FAF7F0]">
        <div className="max-w-[720px] mx-auto px-6 sm:px-8 text-center space-y-4">
          <div>
            <Badge variant="category">{primaryCategory}</Badge>
          </div>

          <h1 className="font-['Fraunces'] font-semibold text-[34px] sm:text-[45px] lg:text-[50px] leading-[1.15] text-[#211C0D] tracking-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="font-['Karla'] text-[18px] sm:text-[20px] leading-[30px] text-[#6B6350] max-w-[660px] mx-auto pt-1">
              {article.excerpt}
            </p>
          )}

          {/* Byline + Date Row with Avatar */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover border border-[#E4DCC8]"
            />
            <div className="text-left">
              <span className="font-['Karla'] font-semibold text-[15px] text-[#211C0D] block leading-tight">
                {authorName}
              </span>
              <span className="font-['Karla'] text-[13px] text-[#6B6350]">
                Published {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. COVER IMAGE (Contained max-width 960px, Clipped-Corner Radius) */}
      {/* ========================================================================= */}
      {article.cover_image_url && (
        <section className="bg-[#FAF7F0] pb-10">
          <div className="max-w-[960px] mx-auto px-6 sm:px-8">
            <div className="w-full aspect-[16/9] radius-photo overflow-hidden border border-[#E4DCC8] shadow-md bg-[#FFFFFF]">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. ARTICLE BODY (Centered Prose Column, max-width 680px) */}
      {/* ========================================================================= */}
      <main className="py-8 bg-[#FAF7F0]">
        <article className="max-w-[680px] mx-auto px-6 space-y-6 font-['Karla'] text-[17px] sm:text-[18px] leading-[29px] text-[#4A4437]">
          {paragraphs.map((p, idx) => {
            // Optional pull-quote insertion for second paragraph if long enough
            if (idx === 1 && paragraphs.length > 3) {
              return (
                <React.Fragment key={idx}>
                  <p>{p}</p>
                  <div className="my-8 bg-[#EBE3A7] border-l-4 border-[#2C5745] p-6 rounded-r-[12px] shadow-xs">
                    <blockquote className="font-['Fraunces'] italic font-normal text-[20px] sm:text-[22px] leading-[32px] text-[#211C0D]">
                      “Enduring ecological justice begins not with corporate subsidies, but with neighbors cultivating shared soil.”
                    </blockquote>
                  </div>
                </React.Fragment>
              );
            }
            return <p key={idx}>{p}</p>;
          })}

          {/* Inline Media from Article Media if present */}
          {article.media && article.media.length > 0 && (
            <div className="my-10 space-y-3">
              <div className="w-full aspect-[16/9] radius-photo overflow-hidden border border-[#E4DCC8]">
                <img
                  src={article.media[0].url}
                  alt={article.media[0].alt_text || 'Field observation'}
                  className="w-full h-full object-cover"
                />
              </div>
              {article.media[0].caption && (
                <p className="font-['Karla'] text-[14px] text-[#6B6350] text-center italic">
                  {article.media[0].caption}
                </p>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. AUTHOR BOX (Bordered card, horizontal desktop / stacked mobile) */}
          {/* ========================================================================= */}
          <div className="mt-14 pt-2">
            <div className="bg-[#FFFFFF] rounded-[16px] border border-[#E4DCC8] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0 border border-[#E4DCC8]"
              />
              <div className="text-center sm:text-left space-y-1.5">
                <span className="font-['Karla'] font-medium text-[13px] text-[#2C5745] block uppercase tracking-wider">
                  Written by
                </span>
                <h3 className="font-['Fraunces'] font-semibold text-[22px] text-[#211C0D]">
                  {authorName}
                </h3>
                <p className="font-['Karla'] text-[15px] leading-[24px] text-[#4A4437]">
                  {article.author?.bio ||
                    'Field coordinator and grassroots agroecologist dedicated to localized soil restoration and tree canopy equity.'}
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* ========================================================================= */}
      {/* 5. RELATED ARTICLES (3-card grid) */}
      {/* ========================================================================= */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-[#FFFFFF] border-t border-[#E4DCC8]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="font-['Fraunces'] font-semibold text-[28px] sm:text-[35px] text-[#211C0D]">
                  Related articles & guides
                </h2>
                <p className="font-['Karla'] text-[16px] text-[#6B6350] mt-1">
                  Further dispatches and research from our community stewards.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate('/articles')}
                className="hidden sm:inline-flex"
              >
                View all articles
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. CTA BAND */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF7F0] border-t border-[#E4DCC8]/60">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 flex justify-center">
          <div className="bg-[#EBE3A7] rounded-[16px] border border-[#9C8B5E]/40 p-8 sm:p-12 text-center max-w-[560px] w-full shadow-xs space-y-4">
            <h3 className="font-['Fraunces'] font-semibold text-[25px] sm:text-[31px] text-[#211C0D] leading-tight">
              Support hands-on ecological action
            </h3>
            <p className="font-['Karla'] text-[16px] text-[#3D3319] leading-relaxed">
              Explore our current neighborhood initiatives or join an upcoming weekend planting drive.
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
