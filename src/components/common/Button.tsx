import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  asLink = false,
  href,
  onClick,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-[36px] px-4 text-[14px]',
    md: 'h-[44px] px-6 text-[15px]',
    lg: 'h-[52px] px-8 text-[16px]'
  }[size];

  // Base font is Karla 600, radius 8px, line-height 1
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = disabled
        ? 'bg-[#E4DCC8] text-[#9C8B5E] cursor-not-allowed border-none'
        : 'bg-[#2C5745] text-[#FAF7F0] border-none hover:bg-[#234639] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(44,87,69,0.25)] active:bg-[#1C362C] active:translate-y-0 active:shadow-none transition-all duration-150 ease-in-out cursor-pointer';
      break;

    case 'secondary':
      variantClasses = disabled
        ? 'bg-transparent border-2 border-[#E4DCC8] text-[#9C8B5E] cursor-not-allowed'
        : 'bg-transparent border-2 border-[#2C5745] text-[#2C5745] hover:bg-[#2C5745]/[0.08] active:bg-[#2C5745]/[0.15] transition-colors duration-150 ease-in-out cursor-pointer';
      break;

    case 'ghost':
      variantClasses = disabled
        ? 'bg-transparent border-none text-[#9C8B5E] cursor-not-allowed px-1'
        : 'bg-transparent border-none text-[#2C5745] hover:underline hover:underline-offset-4 transition-all duration-150 ease-in-out px-1 cursor-pointer';
      break;

    case 'accent':
      variantClasses = disabled
        ? 'bg-[#E4DCC8] text-[#9C8B5E] cursor-not-allowed border-none'
        : 'bg-[#EB7D00] text-[#211C0D] border-none hover:bg-[#CC6D00] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(235,125,0,0.25)] active:bg-[#C86A00] active:translate-y-0 active:shadow-none transition-all duration-150 ease-in-out cursor-pointer';
      break;
  }

  const combinedClasses = `inline-flex items-center justify-center font-semibold font-['Karla'] rounded-[8px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#C86A00] focus-visible:outline-offset-2 ${variant !== 'ghost' ? sizeClasses : 'text-[15px] h-auto py-2'} ${variantClasses} ${className}`;

  const dynamicStyle: React.CSSProperties = { ...props.style };
  if (!disabled) {
    if (variant === 'accent') {
      dynamicStyle.backgroundColor = 'var(--color-accent, #EB7D00)';
      dynamicStyle.color = 'var(--color-accent-contrast, #211C0D)';
    } else if (variant === 'primary') {
      dynamicStyle.backgroundColor = 'var(--color-primary, #2C5745)';
    }
  }

  if (asLink && href) {
    return (
      <a
        href={href}
        onClick={onClick as any}
        className={combinedClasses}
        style={dynamicStyle}
        tabIndex={disabled ? -1 : 0}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </button>
  );
};
