import React, { useState } from 'react';
import { Linkedin } from 'lucide-react';
import { TeamMember } from '../../types/database';
import { BioModal } from './BioModal';

interface TeamMemberCardProps {
  member: TeamMember;
  avatarOnly?: boolean;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  avatarOnly = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (avatarOnly) {
    return (
      <div className="flex flex-col items-center text-center group">
        <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden radius-photo bg-[#FAF7F0] border border-[#E4DCC8] mb-3">
          <img
            src={member.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-250 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <h4 className="font-['Fraunces'] font-semibold text-[17px] text-[#211C0D] group-hover:text-[#2C5745] transition-colors">
          {member.name}
        </h4>
        <p className="font-['Karla'] font-medium text-[13px] text-[#6B6350]">
          {member.role}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group bg-[#FFFFFF] rounded-[16px] border border-[#E4DCC8] p-5 sm:p-6 cursor-pointer transition-all duration-250 ease-out hover:shadow-[0_8px_24px_rgba(33,28,13,0.10)] hover:-translate-y-1 flex flex-col justify-between h-full focus-visible:outline-2 focus-visible:outline-[#C86A00]"
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
      >
        <div>
          {/* 1:1 Photo with signature clipped-corner radius */}
          <div className="relative aspect-square w-full overflow-hidden radius-photo bg-[#FAF7F0] mb-4">
            <img
              src={member.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-250 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Name & Role */}
          <h3 className="font-['Fraunces'] font-semibold text-[20px] text-[#211C0D] group-hover:text-[#2C5745] transition-colors">
            {member.name}
          </h3>
          <p className="font-['Karla'] font-medium text-[14px] text-[#6B6350] mt-0.5">
            {member.role}
          </p>

          {/* Short Bio */}
          {member.bio && (
            <p className="font-['Karla'] text-[14px] leading-[22px] text-[#4A4437] line-clamp-2 mt-2.5">
              {member.bio}
            </p>
          )}
        </div>

        {/* Footer row with Read Story trigger & LinkedIn */}
        <div className="mt-4 pt-3 border-t border-[#E4DCC8]/60 flex items-center justify-between">
          <span className="font-['Karla'] font-semibold text-[13px] text-[#2C5745] group-hover:underline group-hover:underline-offset-4">
            Read story & background
          </span>

          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#6B6350] hover:text-[#2C5745] hover:bg-[#2C5745]/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#C86A00]"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <BioModal
        member={member}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
