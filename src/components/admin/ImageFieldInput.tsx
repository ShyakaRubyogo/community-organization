import React from 'react';
import { CmsImageField } from '../../types/cms';
import { Image as ImageIcon } from 'lucide-react';

interface ImageFieldInputProps {
  label: string;
  value: CmsImageField;
  onChange: (value: CmsImageField) => void;
  helperText?: string;
}

export const ImageFieldInput: React.FC<ImageFieldInputProps> = ({
  label,
  value,
  onChange,
  helperText
}) => {
  const isAltTextMissing = !value.alt_text || value.alt_text.trim() === '';

  return (
    <div className="space-y-3 p-4 bg-[#FAF7F0] border border-[#E4DCC8] rounded-xl">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#211C0D] flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-[#2C5745]" />
          {label}
        </label>
        {isAltTextMissing && (
          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
            Alt text required for accessibility
          </span>
        )}
      </div>

      {helperText && <p className="text-xs text-[#6B6350]">{helperText}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Preview Thumbnail */}
        <div className="w-full aspect-[4/3] rounded-lg border border-[#E4DCC8] overflow-hidden bg-[#FFFFFF] flex items-center justify-center">
          {value.url ? (
            <img
              src={value.url}
              alt={value.alt_text || 'Preview'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-xs text-[#9C8B5E]">No Image URL</span>
          )}
        </div>

        {/* Inputs */}
        <div className="md:col-span-2 space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#4A4437] mb-1">
              Image URL (Direct link or Supabase Storage URL)
            </label>
            <input
              type="url"
              value={value.url}
              onChange={(e) => onChange({ ...value, url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-sm px-3 py-2 bg-[#FFFFFF] border border-[#E4DCC8] rounded-md text-[#211C0D] focus:outline-none focus:ring-1 focus:ring-[#2C5745]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4A4437] mb-1">
              Alt Text <span className="text-red-600">*</span> (Describes the image for screen readers)
            </label>
            <input
              type="text"
              value={value.alt_text}
              onChange={(e) => onChange({ ...value, alt_text: e.target.value })}
              placeholder="e.g. Community volunteers planting a fruit tree"
              className={`w-full text-sm px-3 py-2 bg-[#FFFFFF] border rounded-md text-[#211C0D] focus:outline-none focus:ring-1 ${
                isAltTextMissing
                  ? 'border-amber-400 focus:ring-amber-500'
                  : 'border-[#E4DCC8] focus:ring-[#2C5745]'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4A4437] mb-1">
              Optional Caption
            </label>
            <input
              type="text"
              value={value.caption || ''}
              onChange={(e) => onChange({ ...value, caption: e.target.value })}
              placeholder="e.g. Photo by Field Coordinator, Spring 2026"
              className="w-full text-sm px-3 py-2 bg-[#FFFFFF] border border-[#E4DCC8] rounded-md text-[#211C0D] focus:outline-none focus:ring-1 focus:ring-[#2C5745]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
