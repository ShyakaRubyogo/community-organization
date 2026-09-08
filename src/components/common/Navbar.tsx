import React, { useState, useEffect } from 'react';
import { Menu, X, TreePine } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { Button } from './Button';

interface NavbarProps {
  isTransparentHero?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isTransparentHero = false }) => {
  const { path, navigate } = useRouter();
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

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Initiatives', href: '/initiatives' },
    { label: 'Articles', href: '/articles' }
  ];

  const isDarkHeroMode = isTransparentHero && !isScrolled;

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-[80px] transition-all duration-200 ease-in-out ${
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
            <div
              className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors ${
                isDarkHeroMode ? 'bg-[#FAF7F0] text-[#2C5745]' : 'bg-[#2C5745] text-[#FAF7F0]'
              }`}
            >
              <TreePine className="w-5 h-5" />
            </div>
            <span
              className={`font-['Fraunces'] font-semibold text-[20px] tracking-tight transition-colors ${
                isDarkHeroMode ? 'text-[#FAF7F0]' : 'text-[#211C0D]'
              }`}
            >
              Atiak & Abdi
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
            <div className="ml-2">
              <Button
                variant={isDarkHeroMode ? 'accent' : 'primary'}
                size="sm"
                onClick={(e) => handleNavClick(e, '/initiatives')}
              >
                Get Involved
              </Button>
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Button
              variant={isDarkHeroMode ? 'accent' : 'primary'}
              size="sm"
              onClick={(e) => handleNavClick(e, '/initiatives')}
              className="text-xs px-3"
            >
              Involved
            </Button>
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
              <div className="w-9 h-9 rounded-[8px] bg-[#FAF7F0] text-[#2C5745] flex items-center justify-center">
                <TreePine className="w-5 h-5" />
              </div>
              <span className="font-['Fraunces'] font-semibold text-[20px] text-[#FAF7F0]">
                Roots & Canopy
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
            <Button
              variant="accent"
              size="md"
              onClick={(e) => handleNavClick(e, '/initiatives')}
              className="w-full text-center"
            >
              Explore Our Initiatives
            </Button>
            <p className="font-['Karla'] text-[14px] text-[#FAF7F0]/65 text-center">
              Grassroots ecological stewardship for our shared future.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
