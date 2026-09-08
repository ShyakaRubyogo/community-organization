import React from 'react';
import { Sparkles } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'category' | 'featured' | 'ongoing' | 'completed' | 'draft';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'category',
  className = ''
}) => {
  let styleClasses = '';

  switch (variant) {
    case 'category':
      styleClasses = 'bg-[#2C5745]/[0.08] text-[#2C5745] font-semibold text-[13px]';
      break;
    case 'featured':
      styleClasses = 'bg-[#EBE3A7] text-[#211C0D] font-semibold text-[13px]';
      break;
    case 'ongoing':
      styleClasses = 'bg-[#DCEEE1] text-[#1B6B42] font-semibold text-[13px]';
      break;
    case 'completed':
      styleClasses = 'bg-[#F0ECDD] text-[#6B6350] font-medium text-[13px]';
      break;
    case 'draft':
      styleClasses = 'bg-[#F7E9C9] text-[#8A5A00] font-medium text-[13px]';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-[999px] font-['Karla'] capitalize tracking-normal ${styleClasses} ${className}`}
    >
      {variant === 'featured' && <Sparkles className="w-3 h-3 text-[#211C0D]" />}
      {children}
    </span>
  );
};
