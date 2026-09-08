import React from 'react';
import { MapPin } from 'lucide-react';
import { Initiative } from '../../types/database';
import { Badge } from './Badge';
import { useRouter } from '../../context/RouterContext';

interface InitiativeCardProps {
  initiative: Initiative;
}

export const InitiativeCard: React.FC<InitiativeCardProps> = ({ initiative }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/initiatives/${initiative.slug}`);
  };

  const primaryCategory = initiative.categories?.[0]?.name || 'Initiative';
  const imageUrl = initiative.cover_image_url || initiative.hero_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      onClick={handleClick}
      className="group bg-[#FFFFFF] rounded-[16px] border border-[#E4DCC8] overflow-hidden cursor-pointer transition-all duration-250 ease-out hover:shadow-[0_8px_24px_rgba(33,28,13,0.10)] hover:-translate-y-1 flex flex-col h-full focus-visible:outline-2 focus-visible:outline-[#C86A00]"
      tabIndex={0}
      role="link"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/initiatives/${initiative.slug}`);
        }
      }}
    >
      {/* Inset photo with signature clipped-corner radius */}
      <div className="pt-3 px-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden radius-photo bg-[#FAF7F0]">
          <img
            src={imageUrl}
            alt={initiative.title}
            className="w-full h-full object-cover transition-transform duration-250 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
          {initiative.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="featured">Featured</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Location Meta */}
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            <Badge variant="category">{primaryCategory}</Badge>
            {initiative.location && (
              <div className="flex items-center gap-1 text-[13px] text-[#6B6350] font-['Karla']">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2C5745]" />
                <span className="truncate max-w-[180px]">{initiative.location}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-['Fraunces'] font-semibold text-[20px] leading-[28px] text-[#211C0D] line-clamp-2 group-hover:text-[#2C5745] transition-colors">
            {initiative.title}
          </h3>

          {/* Summary */}
          {initiative.summary && (
            <p className="mt-2 font-['Karla'] text-[16px] leading-[26px] text-[#4A4437] line-clamp-3">
              {initiative.summary}
            </p>
          )}
        </div>

        {/* Action footnote */}
        <div className="mt-4 pt-3 border-t border-[#E4DCC8]/60 flex items-center justify-between">
          <span className="font-['Karla'] font-semibold text-[14px] text-[#2C5745] group-hover:underline group-hover:underline-offset-4">
            View initiative details
          </span>
          <span className="text-[13px] text-[#6B6350] font-['Karla']">
            {initiative.impact_metrics?.[0]?.display_value || 'Active community project'}
          </span>
        </div>
      </div>
    </div>
  );
};
