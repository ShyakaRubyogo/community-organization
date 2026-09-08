import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading content...' }) => {
  return (
    <div className="py-24 px-6 max-w-[1200px] mx-auto flex flex-col items-center justify-center min-h-[40vh]">
      <div className="w-12 h-12 rounded-full border-3 border-[#2C5745]/20 border-t-[#2C5745] animate-spin mb-4" />
      <p className="font-['Karla'] font-medium text-[16px] text-[#6B6350]">
        {message}
      </p>
    </div>
  );
};
