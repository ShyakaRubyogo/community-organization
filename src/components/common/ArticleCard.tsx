import React from 'react';
import { Article } from '../../types/database';
import { Badge } from './Badge';
import { useRouter } from '../../context/RouterContext';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/articles/${article.slug}`);
  };

  const primaryCategory = article.categories?.[0]?.name || 'Article';
  const imageUrl = article.cover_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';

  const authorName = article.author?.name || 'Roots & Canopy Team';
  const authorAvatar = article.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Aug 12, 2026';

  return (
    <div
      onClick={handleClick}
      className="group bg-[#FFFFFF] rounded-[16px] border border-[#E4DCC8] overflow-hidden cursor-pointer transition-all duration-250 ease-out hover:shadow-[0_8px_24px_rgba(33,28,13,0.10)] hover:-translate-y-1 flex flex-col h-full focus-visible:outline-2 focus-visible:outline-[#C86A00]"
      tabIndex={0}
      role="link"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/articles/${article.slug}`);
        }
      }}
    >
      {/* Inset photo with signature clipped-corner radius */}
      <div className="pt-3 px-3">
        <div className="relative aspect-[16/9] w-full overflow-hidden radius-photo bg-[#FAF7F0]">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-250 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="category">{primaryCategory}</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Byline / Date rendered as one readable sentence with 24px circular avatar */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-6 h-6 rounded-full object-cover shrink-0"
              loading="lazy"
            />
            <span className="font-['Karla'] text-[14px] text-[#6B6350] leading-tight">
              By {authorName}, {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-['Fraunces'] font-semibold text-[20px] leading-[28px] text-[#211C0D] line-clamp-2 group-hover:text-[#2C5745] transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mt-2 font-['Karla'] text-[16px] leading-[26px] text-[#4A4437] line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Read more affordance */}
        <div className="mt-4 pt-3 border-t border-[#E4DCC8]/60">
          <span className="font-['Karla'] font-semibold text-[14px] text-[#2C5745] group-hover:underline group-hover:underline-offset-4">
            Read full article
          </span>
        </div>
      </div>
    </div>
  );
};
