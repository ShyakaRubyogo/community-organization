import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  queryParams: URLSearchParams;
  hash: string;
  navigate: (to: string, options?: { replace?: boolean; scroll?: boolean }) => void;
  setPageMeta: (title: string, description?: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search + window.location.hash;
    }
    return '/';
  });

  const getPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  };

  const [path, setPath] = useState(getPath);
  const [queryParams, setQueryParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });
  const [hash, setHash] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash;
    }
    return '';
  });

  const updateStateFromWindow = useCallback(() => {
    const newPath = window.location.pathname || '/';
    setPath(newPath);
    setQueryParams(new URLSearchParams(window.location.search));
    setHash(window.location.hash);
    setCurrentUrl(window.location.pathname + window.location.search + window.location.hash);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      updateStateFromWindow();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [updateStateFromWindow]);

  const navigate = useCallback((to: string, options?: { replace?: boolean; scroll?: boolean }) => {
    if (typeof window === 'undefined') return;

    const shouldScroll = options?.scroll !== false;

    if (options?.replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }

    updateStateFromWindow();

    if (shouldScroll) {
      if (to.includes('#')) {
        const hashTarget = to.split('#')[1];
        setTimeout(() => {
          const el = document.getElementById(hashTarget);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }, [updateStateFromWindow]);

  const setPageMeta = useCallback((title: string, description?: string) => {
    if (typeof document === 'undefined') return;

    const fullTitle = title.includes('Roots & Canopy') || title.includes('Community Organization')
      ? title
      : `${title} | Roots & Canopy Alliance`;

    document.title = fullTitle;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    }
  }, []);

  return (
    <RouterContext.Provider value={{ path, queryParams, hash, navigate, setPageMeta }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
