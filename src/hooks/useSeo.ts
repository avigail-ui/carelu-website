import { useEffect } from 'react';

/* Per-route <head> management for the SPA. Vite serves one static index.html,
   so without this every route shares the same <title>/description/canonical.
   useSeo sets a unique title, meta description, canonical URL, og/twitter
   mirrors, and robots directive per page (client-rendered — Google executes JS,
   and it keeps social/AI previews accurate). */

const BASE = 'https://carelu.com';
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

type SeoOptions = {
  title: string;
  description?: string;
  canonical?: string; // absolute URL or path (defaults to current pathname)
  noindex?: boolean;
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSeo({ title, description, canonical, noindex }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    upsertMeta('property', 'og:title', title);
    upsertMeta('name', 'twitter:title', title);

    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }

    const url = canonical
      ? (canonical.startsWith('http') ? canonical : BASE + canonical)
      : BASE + window.location.pathname;
    upsertLink('canonical', url);
    upsertMeta('property', 'og:url', url);

    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : DEFAULT_ROBOTS);
  }, [title, description, canonical, noindex]);
}
