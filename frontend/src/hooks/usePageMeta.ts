import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
  /** Defaults to false — set true for pages that shouldn't be indexed (e.g. 404). */
  noindex?: boolean;
}

const DEFAULT_TITLE = document.title;
const DEFAULT_DESCRIPTION = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

/** Sets document title/description/robots for the mounted route, restoring the site defaults on unmount. */
export function usePageMeta({ title, description, noindex = false }: PageMeta) {
  useEffect(() => {
    document.title = title;

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (description) descriptionTag?.setAttribute('content', description);

    const robotsTag = document.querySelector('meta[name="robots"]');
    if (noindex) robotsTag?.setAttribute('content', 'noindex, follow');

    return () => {
      document.title = DEFAULT_TITLE;
      descriptionTag?.setAttribute('content', DEFAULT_DESCRIPTION);
      robotsTag?.setAttribute('content', 'index, follow');
    };
  }, [title, description, noindex]);
}
