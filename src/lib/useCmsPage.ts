import { useState, useEffect } from 'react';
import { fetchPublishedPage, getAdminPage } from './cmsClient';
import { useCms } from '../context/CmsContext';

export function useCmsPage<T>(pageId: string, defaultSeed: T) {
  const [content, setContent] = useState<T>(defaultSeed);
  const [loading, setLoading] = useState(true);
  const { isPreviewMode, isAdmin, isSupabaseConnected } = useCms();

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!isSupabaseConnected) {
        if (isMounted) {
          setContent(defaultSeed);
          setLoading(false);
        }
        return;
      }

      try {
        if (isPreviewMode && isAdmin) {
          // Admin viewing draft content
          const adminData = await getAdminPage<T>(pageId, defaultSeed);
          if (isMounted) {
            setContent(adminData.draft_content);
          }
        } else {
          // Public visitor viewing published view
          const pubData = await fetchPublishedPage<T>(pageId, defaultSeed);
          if (isMounted) {
            setContent(pubData);
          }
        }
      } catch (err) {
        console.warn(`useCmsPage error for ${pageId}, using fallback:`, err);
        if (isMounted) {
          setContent(defaultSeed);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [pageId, isPreviewMode, isAdmin, isSupabaseConnected]);

  return { content, loading, isPreview: isPreviewMode && isAdmin };
}
