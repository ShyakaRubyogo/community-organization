import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please try again.',
  onRetry,
  onBack,
  backLabel = 'Return to home'
}) => {
  return (
    <div className="py-24 px-6 max-w-[640px] mx-auto text-center flex flex-col items-center justify-center min-h-[40vh]">
      <div className="w-14 h-14 rounded-full bg-[#F8DEDE] text-[#A83232] flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="font-['Fraunces'] font-semibold text-[26px] text-[#211C0D] mb-2">
        {title}
      </h2>
      <p className="font-['Karla'] text-[16px] text-[#6B6350] mb-6 max-w-md">
        {message}
      </p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {onRetry && (
          <Button variant="primary" size="md" onClick={onRetry}>
            Try again
          </Button>
        )}
        {onBack && (
          <Button variant="secondary" size="md" onClick={onBack}>
            {backLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
