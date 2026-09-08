import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { MediaAsset } from '../../types/database';

interface LightboxModalProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ asset, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !asset) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#211C0D]/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 sm:right-0 p-2 text-[#FAF7F0] hover:text-[#EBE3A7] rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C86A00]"
          aria-label="Close image lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full overflow-hidden rounded-[16px] bg-black max-h-[75vh] flex items-center justify-center">
          <img
            src={asset.url}
            alt={asset.alt_text || 'Initiative media'}
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>

        {asset.caption && (
          <p className="mt-3 text-center font-['Karla'] text-[15px] text-[#FAF7F0]/80 max-w-xl">
            {asset.caption}
          </p>
        )}
      </div>
    </div>
  );
};
