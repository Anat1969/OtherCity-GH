import { useEffect, useState } from 'react';

// ניתוב hash: הכתובת נושאת דף, בעיה ופריט, כך שהעתקת קישור שומרת את המצב.
export type Page = 'home' | 'bank' | 'ask' | 'board' | 'feature';
const parse = () => {
  const [path, query = ''] = window.location.hash.replace(/^#\/?/, '').split('?');
  return { page: (path || 'home') as Page, params: Object.fromEntries(new URLSearchParams(query)) as Record<string, string> };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const href = (page: Page, params?: Record<string, string | undefined>) => {
  const clean = Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v)) as Record<string, string>;
  const q = Object.keys(clean).length ? '?' + new URLSearchParams(clean).toString() : '';
  return page === 'home' ? '#/' : `#/${page}${q}`;
};
export const go = (page: Page, params?: Record<string, string | undefined>) => { window.location.hash = href(page, params); };
