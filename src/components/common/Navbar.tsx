import React, { useState, useEffect } from 'react';
import { Menu, X, TreePine, Leaf, Sprout, Sun, Heart, Globe, Mountain, Sparkles } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useCms } from '../../context/CmsContext';
import { Button } from './Button';

interface NavbarProps {
  isTransparentHero?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isTransparentHero = false }) => {
  const { path, navigate } = useRouter();
  const { settings } = useCms();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = settings.navigation_links || [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Initiatives', href: '/initiatives' },
    { label: 'Articles', href: '/articles' }
  ];

  const brandName = settings.brand_name || 'Atiak & Abdi';
  const cta = settings.header_cta || { label: 'Get Involved', href: '/initiatives', is_visible: true };

  const isDarkHeroMode = isTransparentHero && !isScrolled;

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate(href);
  };

  const renderLogoVisual = (isDarkHero: boolean) => {
    const logoType = settings.logo_type || 'icon';

    if (logoType === 'image' && settings.logo_image?.url) {
      return (
        <img
          src={settings.logo_image.url}
          alt={settings.logo_image.alt_text || brandName}
          className="h-9 w-auto max-w-[160px] object-contain rounded-md"
        />
      );
    }

    if (logoType === 'text') {
      return null;
    }

    const iconName = settings.logo_icon || 'TreePine';
    let IconComponent = TreePine;
    if (iconName === 'Leaf') IconComponent = Leaf;
    else if (iconName === 'Sprout') IconComponent = Sprout;
    else if (iconName === 'Sun') IconComponent = Sun;
    else if (iconName === 'Heart') IconComponent = Heart;
    else if (iconName === 'Globe') IconComponent = Globe;
    else if (iconName === 'Mountain') IconComponent = Mountain;

    return (
      <div
        className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors shrink-0 ${
          isDarkHero ? 'bg-[#FAF7F0] text-[#2C5745]' : 'bg-[#2C5745] text-[#FAF7F0]'
        }`}
      >
        <IconComponent className="w-5 h-5" />
      </div>
    );
  };

  return (
    <>
      {/* Optional Top Announcement Bar */}
      {settings.announcement_bar?.is_enabled && settings.announcement_bar.text && (
        <aside
          aria-label="Announcement"
          className="bg-[#2C5745] text-[#FAF7F0] text-xs py-2 px-4 text-center font-['Karla'] font-medium flex items-center justify-center gap-2 relative z-50 border-b border-[#2C5745]/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EBE3A7] shrink-0" />
          <span>{settings.announcement_bar.text}</span>
          {settings.announcement_bar.link_href && (
            <a
              href={settings.announcement_bar.link_href}
              onClick={(e) => handleNavClick(e, settings.announcement_bar!.link_href!)}
              className="underline font-semibold text-[#EBE3A7] hover:text-white ml-1 transition-colors"
            >
              {settings.announcement_bar.link_label || 'Learn more →'}
            </a>
          )}
        </aside>
      )}

      <header
        className={`fixed left-0 right-0 z-40 h-[80px] transition-all duration-200 ease-in-out ${
          settings.announcement_bar?.is_enabled && settings.announcement_bar.text
            ? 'top-[33px]'
            : 'top-0'
        } ${
          isScrolled
            ? 'bg-[#FFFFFF] border-b border-[#E4DCC8] shadow-xs'
            : isDarkHeroMode
            ? 'bg-transparent border-b border-transparent'
            : 'bg-[#FAF7F0] border-b border-[#E4DCC8]/60'
        }`}
      >
        <div className="max-w-[1200px] h-full mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[#C86A00] rounded-sm"
          >
            {renderLogoVisual(isDarkHeroMode)}
            <span
              className={`font-['Fraunces'] font-semibold text-[20px] tracking-tight transition-colors ${
                isDarkHeroMode ? 'text-[#FAF7F0]' : 'text-[#211C0D]'
              }`}
            >
              {brandName}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? path === '/'
                  : path.startsWith(link.href);

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`link-underline font-['Karla'] font-semibold text-[16px] py-1 cursor-pointer transition-colors ${
                    isActive ? 'active text-[#2C5745]' : isDarkHeroMode ? 'text-[#FAF7F0] hover:text-[#FAF7F0]' : 'text-[#211C0D] hover:text-[#2C5745]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            {/* Top-priority CTA */}
            {cta.is_visible !== false && (
              <div className="ml-2">
                <Button
                  variant={isDarkHeroMode ? 'accent' : 'primary'}
                  size="sm"
                  onClick={(e) => handleNavClick(e, cta.href)}
                >
                  {cta.label}
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {cta.is_visible !== false && (
              <Button
                variant={isDarkHeroMode ? 'accent' : 'primary'}
                size="sm"
                onClick={(e) => handleNavClick(e, cta.href)}
                className="text-xs px-3"
              >
                {cta.label.split(' ')[0]}
              </Button>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className={`p-2 rounded-lg cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#C86A00] ${
                isDarkHeroMode ? 'text-[#FAF7F0] hover:bg-white/10' : 'text-[#211C0D] hover:bg-[#2C5745]/10'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#211C0D] flex flex-col justify-between p-8 text-[#FAF7F0] transition-opacity duration-250 ease-out"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {renderLogoVisual(true)}
              <span className="font-['Fraunces'] font-semibold text-[20px] text-[#FAF7F0]">
                {brandName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 text-[#FAF7F0] hover:bg-white/10 rounded-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C86A00]"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="flex flex-col gap-6 my-auto">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? path === '/'
                  : path.startsWith(link.href);

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-['Fraunces'] font-semibold text-[28px] tracking-tight transition-colors ${
                    isActive ? 'text-[#EB7D00]' : 'text-[#FAF7F0] hover:text-[#EBE3A7]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#FAF7F0]/15 flex flex-col gap-4">
            {cta.is_visible !== false && (
              <Button
                variant="accent"
                size="md"
                onClick={(e) => handleNavClick(e, cta.href)}
                className="w-full text-center"
              >
                {cta.label}
              </Button>
            )}
            <p className="font-['Karla'] text-[14px] text-[#FAF7F0]/65 text-center">
              {settings.tagline || 'Grassroots ecological stewardship for our shared future.'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
