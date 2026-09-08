import React, { useEffect } from 'react';
import { X, Linkedin, Twitter } from 'lucide-react';
import { TeamMember } from '../../types/database';

interface BioModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BioModal: React.FC<BioModalProps> = ({ member, isOpen, onClose }) => {
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

  if (!isOpen || !member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#211C0D]/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-member-name"
    >
      <div
        className="bg-[#FFFFFF] rounded-[16px] border border-[#E4DCC8] max-w-[560px] w-full p-6 sm:p-8 relative shadow-2xl transition-all duration-200 ease-out transform scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#211C0D] hover:bg-[#2C5745]/10 rounded-full cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#C86A00]"
          aria-label="Close bio modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Member Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden radius-photo bg-[#FAF7F0] border border-[#E4DCC8]">
            <img
              src={member.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3
              id="modal-member-name"
              className="font-['Fraunces'] font-semibold text-[24px] text-[#211C0D]"
            >
              {member.name}
            </h3>
            <p className="font-['Karla'] font-medium text-[15px] text-[#2C5745] mt-0.5">
              {member.role}
            </p>
            {member.department && (
              <p className="font-['Karla'] text-[13px] text-[#6B6350] mt-0.5">
                {member.department}
              </p>
            )}

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-3">
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="w-8 h-8 rounded-[8px] bg-[#FAF7F0] hover:bg-[#2C5745]/15 text-[#2C5745] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#C86A00]"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {member.twitter_url && (
                <a
                  href={member.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} X Twitter`}
                  className="w-8 h-8 rounded-[8px] bg-[#FAF7F0] hover:bg-[#2C5745]/15 text-[#2C5745] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#C86A00]"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio & Story */}
        <div className="mt-6 pt-6 border-t border-[#E4DCC8] space-y-4">
          {member.bio && (
            <div>
              <h4 className="font-['Fraunces'] font-semibold text-[16px] text-[#211C0D] mb-1.5">
                Role & focus
              </h4>
              <p className="font-['Karla'] text-[15px] leading-[25px] text-[#4A4437]">
                {member.bio}
              </p>
            </div>
          )}

          {member.story && (
            <div>
              <h4 className="font-['Fraunces'] font-semibold text-[16px] text-[#211C0D] mb-1.5">
                Personal connection to the work
              </h4>
              <p className="font-['Karla'] text-[15px] leading-[25px] text-[#4A4437]">
                {member.story}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
