import React from 'react';
import { TreePine, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useCms } from '../../context/CmsContext';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { settings } = useCms();

  const handleLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  const footer = settings.footer;
  const brandName = settings.brand_name || 'Roots & Canopy';

  return (
    <footer className="bg-[#211C0D] text-[#FAF7F0] pt-16 pb-12 lg:pt-20 lg:pb-12 border-t border-[#E4DCC8]/20">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Main 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Column 1: Org Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#FAF7F0] text-[#2C5745] flex items-center justify-center">
                <TreePine className="w-4 h-4" />
              </div>
              <span className="font-['Fraunces'] font-semibold text-[20px] text-[#FAF7F0]">
                {brandName}
              </span>
            </div>
            <p className="font-['Karla'] text-[15px] leading-relaxed text-[#FAF7F0]/65">
              {footer?.summary || 'Cultivating resilient neighborhoods through community urban forests, clean water stewardship, and localized food sovereignty.'}
            </p>
            <p className="font-['Karla'] text-[13px] text-[#FAF7F0]/40">
              {footer?.nonprofit_notice || 'Registered 501(c)(3) nonprofit community alliance.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-['Fraunces'] font-semibold text-[18px] text-[#FAF7F0]">
              Quick links
            </h4>
            <ul className="space-y-2 font-['Karla'] text-[15px]">
              {(footer?.quick_links && footer.quick_links.length > 0 ? footer.quick_links : [
                { label: 'Home', href: '/' },
                { label: 'About us & team', href: '/about' },
                { label: 'Public initiatives', href: '/initiatives' },
                { label: 'Articles & reports', href: '/articles' }
              ]).map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLink(e, link.href)}
                    className="text-[#FAF7F0]/65 hover:text-[#FAF7F0] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore Focus Areas */}
          <div className="space-y-3">
            <h4 className="font-['Fraunces'] font-semibold text-[18px] text-[#FAF7F0]">
              Focus areas
            </h4>
            <ul className="space-y-2 font-['Karla'] text-[15px]">
              {(footer?.focus_links && footer.focus_links.length > 0 ? footer.focus_links : [
                { label: 'Urban forestry & shade', href: '/initiatives?category=urban-forestry' },
                { label: 'Community food forests', href: '/initiatives?category=food-sovereignty' },
                { label: 'Watershed restoration', href: '/initiatives?category=watershed-restoration' },
                { label: 'Youth ecology apprenticeships', href: '/initiatives?category=youth-ecology' }
              ]).map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLink(e, link.href)}
                    className="text-[#FAF7F0]/65 hover:text-[#FAF7F0] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-['Fraunces'] font-semibold text-[18px] text-[#FAF7F0]">
              Contact & visit
            </h4>
            <div className="space-y-2.5 font-['Karla'] text-[14px] text-[#FAF7F0]/65">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EBE3A7] shrink-0 mt-0.5" />
                <span>{footer?.address || '742 Willow Creek Way, Suite 104, Portland, OR'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#EBE3A7] shrink-0" />
                <a
                  href={`mailto:${footer?.email || 'hello@rootsandcanopy.org'}`}
                  className="hover:text-[#FAF7F0] transition-colors"
                >
                  {footer?.email || 'hello@rootsandcanopy.org'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#EBE3A7] shrink-0" />
                <span>{footer?.phone || '(555) 349-2810'}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={footer?.socials?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAF7F0]/80 hover:text-[#FAF7F0] hover:bg-white/20 transition-all focus-visible:outline-2 focus-visible:outline-[#C86A00]"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={footer?.socials?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAF7F0]/80 hover:text-[#FAF7F0] hover:bg-white/20 transition-all focus-visible:outline-2 focus-visible:outline-[#C86A00]"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={footer?.socials?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAF7F0]/80 hover:text-[#FAF7F0] hover:bg-white/20 transition-all focus-visible:outline-2 focus-visible:outline-[#C86A00]"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={footer?.socials?.twitter || 'https://x.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="X Twitter"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAF7F0]/80 hover:text-[#FAF7F0] hover:bg-white/20 transition-all focus-visible:outline-2 focus-visible:outline-[#C86A00]"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAF7F0]/80 hover:text-[#FAF7F0] hover:bg-white/20 transition-all focus-visible:outline-2 focus-visible:outline-[#C86A00]"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with 1px hairline */}
        <div className="pt-6 border-t border-[#FAF7F0]/12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-['Karla'] text-[14px] text-[#FAF7F0]/65">
            © {new Date().getFullYear()} {brandName}. Grassroots authenticity with professional credibility. All rights reserved.
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="font-['Karla'] text-[12px] text-[#FAF7F0]/50 hover:text-[#FAF7F0] transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded hover:bg-white/5"
          >
            <span>Staff Portal & Admin CMS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#FAF7F0]/70">/admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
