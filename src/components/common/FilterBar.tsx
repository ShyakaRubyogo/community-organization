import React from 'react';
import { Category } from '../../types/database';

interface FilterBarProps {
  categories: Category[];
  activeCategorySlug: string;
  onSelectCategory: (slug: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  activeCategorySlug,
  onSelectCategory
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 flex-nowrap sm:flex-wrap">
        {/* 'All' pill */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`shrink-0 px-4 py-1.5 rounded-[999px] font-['Karla'] font-semibold text-[14px] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C86A00] ${
            activeCategorySlug === 'all' || !activeCategorySlug
              ? 'bg-[#2C5745] text-[#FAF7F0] shadow-xs'
              : 'bg-[#2C5745]/[0.08] text-[#2C5745] hover:bg-[#2C5745]/15'
          }`}
        >
          All
        </button>

        {/* Category Pills */}
        {categories.map((category) => {
          const isActive = activeCategorySlug === category.slug;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.slug)}
              className={`shrink-0 px-4 py-1.5 rounded-[999px] font-['Karla'] font-semibold text-[14px] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C86A00] ${
                isActive
                  ? 'bg-[#2C5745] text-[#FAF7F0] shadow-xs'
                  : 'bg-[#2C5745]/[0.08] text-[#2C5745] hover:bg-[#2C5745]/15'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
