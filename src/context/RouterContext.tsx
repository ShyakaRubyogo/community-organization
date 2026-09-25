import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  queryParams: URLSearchParams;
  hash: string;
  navigate: (to: string, options?: { replace?: boolean; scroll?: boolean }) => void;
  setPageMeta: (title: string, description?: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parseRouteFromLocation(): { path: string; queryParams: URLSearchParams; hash: string } {
  if (typeof window === 'undefined') {
    return { path: '/', queryParams: new URLSearchParams(), hash: '' };
  }

  const rawHash = window.location.hash || '';
  const searchParams = new URLSearchParams(window.location.search);

  // Check if hash-based routing is used for admin: e.g. #admin, #/admin
  if (rawHash === '#admin' || rawHash === '#/admin' || rawHash.startsWith('#/admin')) {
    return { path: '/admin', queryParams: searchParams, hash: rawHash };
  }

  // Check if query param admin is used: e.g. ?admin=true or ?admin
  if (searchParams.has('admin') && searchParams.get('admin') !== 'false') {
    return { path: '/admin', queryParams: searchParams, hash: rawHash };
  }

  let rawPath = window.location.pathname || '/';

  // Normalize: trim trailing slashes if length > 1
  if (rawPath.length > 1 && rawPath.endsWith('/')) {
    rawPath = rawPath.replace(/\/+$/, '');
  }

  return { path: rawPath || '/', queryParams: searchParams, hash: rawHash };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = parseRouteFromLocation();
  const [path, setPath] = useState(initial.path);
  const [queryParams, setQueryParams] = useState(initial.queryParams);
  const [hash, setHash] = useState(initial.hash);

  const updateStateFromWindow = useCallback(() => {
    const route = parseRouteFromLocation();
    setPath(route.path);
    setQueryParams(route.queryParams);
    setHash(route.hash);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      updateStateFromWindow();
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
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
      if (to.includes('#') && !to.startsWith('#/')) {
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

    const fullTitle = title.includes('Atiak & Abdi') || title.includes('Community Alliance')
      ? title
      : `${title} | Atiak & Abdi Community Alliance`;

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
