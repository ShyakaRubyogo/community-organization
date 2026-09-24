import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { CmsProvider, useCms } from './context/CmsContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { InitiativesListingPage } from './pages/InitiativesListingPage';
import { InitiativeDetailPage } from './pages/InitiativeDetailPage';
import { ArticlesListingPage } from './pages/ArticlesListingPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AdminPage } from './pages/AdminPage';
import { Button } from './components/common/Button';
import { Eye, Shield, Radio, X, ArrowLeft } from 'lucide-react';

const MainContent: React.FC = () => {
  const { path, navigate } = useRouter();
  const { isPreviewMode, togglePreviewMode, adminUser } = useCms();

  const isCmsRoute = path === '/admin' || path.startsWith('/admin?') || path.startsWith('/admin#');

  // If viewing admin route, render admin panel with the return button in the bottom right
  if (isCmsRoute) {
    return (
      <div className="relative min-h-screen">
        <AdminPage />

        {/* Single Exit Button situated in bottom-right */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="fixed bottom-4 right-4 z-50 text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border transition-all hover:scale-105 cursor-pointer bg-[#211C0D] hover:bg-black text-[#FAF7F0] border-white/20 backdrop-blur-sm group"
          title="Exit CMS Studio and return to public website"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#EBE3A7] transition-transform group-hover:-translate-x-0.5" />
          <span>Exit to Public Site</span>
        </button>
      </div>
    );
  }

  // Route matching logic
  const renderRoute = () => {
    // 1. Home
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    // 2. About
    if (path === '/about' || path.startsWith('/about#')) {
      return <AboutPage />;
    }

    // 3. Initiatives Listing or Detail
    if (path.startsWith('/initiatives/')) {
      const slug = path.replace('/initiatives/', '').split('?')[0].split('#')[0];
      if (slug) {
        return <InitiativeDetailPage slug={slug} />;
      }
    }
    if (path === '/initiatives' || path.startsWith('/initiatives?')) {
      return <InitiativesListingPage />;
    }

    // 4. Articles Listing or Detail
    if (path.startsWith('/articles/')) {
      const slug = path.replace('/articles/', '').split('?')[0].split('#')[0];
      if (slug) {
        return <ArticleDetailPage slug={slug} />;
      }
    }
    if (path === '/articles' || path.startsWith('/articles?')) {
      return <ArticlesListingPage />;
    }

    // 5. 404 Not Found Page (Flat geometric aesthetic per design spec)
    return (
      <div className="pt-32 pb-24 px-6 text-center max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-[16px] bg-[#2C5745]/10 text-[#2C5745] flex items-center justify-center font-['Fraunces'] font-semibold text-2xl mb-4 border border-[#E4DCC8]">
          404
        </div>
        <h1 className="font-['Fraunces'] font-semibold text-[32px] text-[#211C0D] mb-2">
          Page not found
        </h1>
        <p className="font-['Karla'] text-[16px] text-[#6B6350] mb-8">
          The trail you were looking for doesn't exist or has been moved to another clearing.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/')}>
          Return to home
        </Button>
      </div>
    );
  };

  // Initiative detail page has a full-bleed photo hero where the navbar is overlaid transparently
  const isTransparentHero = path.startsWith('/initiatives/') && path !== '/initiatives';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#4A4437]">
      {/* Draft Preview Active Indicator Banner */}
      {isPreviewMode && (
        <div className="bg-amber-500 text-stone-950 font-['Karla'] text-xs font-semibold px-4 py-2 text-center sticky top-0 z-50 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 mx-auto">
            <Radio className="w-4 h-4 text-stone-950 animate-pulse" />
            <span>Viewing Unpublished Drafts (Preview Mode Active)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin')}
              className="px-2 py-0.5 bg-stone-900 text-white rounded text-[11px] hover:bg-stone-800 transition-colors"
            >
              Open CMS
            </button>
            <button
              onClick={togglePreviewMode}
              className="p-1 text-stone-900 hover:text-stone-950 transition-colors"
              title="Exit Preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <Navbar isTransparentHero={isTransparentHero && !isPreviewMode} />
      <div className="flex-1">{renderRoute()}</div>
      <Footer />

      {/* Floating CMS Studio access button */}
      <button
        onClick={() => navigate('/admin')}
        className={`fixed bottom-4 right-4 z-40 text-xs font-semibold px-3 py-2 rounded-full shadow-lg flex items-center gap-2 border transition-all hover:scale-105 cursor-pointer ${
          adminUser
            ? 'bg-[#2C5745] hover:bg-[#234537] text-[#FAF7F0] border-[#FAF7F0]/20'
            : 'bg-[#211C0D]/90 hover:bg-[#211C0D] text-[#FAF7F0] border-white/20 backdrop-blur-sm'
        }`}
        title="Open Alliance CMS Studio"
      >
        <Shield className="w-3.5 h-3.5 text-[#EBE3A7]" />
        <span>{adminUser ? 'CMS Studio (Active)' : 'Admin CMS'}</span>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <CmsProvider>
        <MainContent />
      </CmsProvider>
    </RouterProvider>
  );
}
