import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { InitiativesListingPage } from './pages/InitiativesListingPage';
import { InitiativeDetailPage } from './pages/InitiativeDetailPage';
import { ArticlesListingPage } from './pages/ArticlesListingPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { Button } from './components/common/Button';

const MainContent: React.FC = () => {
  const { path, navigate } = useRouter();

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
      <Navbar isTransparentHero={isTransparentHero} />
      <div className="flex-1">{renderRoute()}</div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <MainContent />
    </RouterProvider>
  );
}
