// חיפוש עברי: התאמה בתחילת מילה, גם אחרי אותיות שימוש. מילה עד 3 אותיות חייבת להיות שלמה.
import { SOLUTIONS, catOf, type Solution } from '../data/solutions';

const PREFIX = /^[הובכלמש]{1,2}/;
const clean = (t: string) => t.replace(/\*\*|==/g, '').toLowerCase();
const words = (t: string) => clean(t).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

export const haystack = (s: Solution) =>
  [s.name.he, s.name.en, s.city.he, s.city.en, s.country.he, s.insight, s.mechanism, s.outcome, s.ashdod, catOf(s.cat).he].join(' ');

function wordMatch(q: string, w: string) {
  const cands = [w, w.replace(PREFIX, '')];
  return cands.some((c) => (q.length <= 3 ? c === q : c.startsWith(q)));
}

export function matches(s: Solution, query: string) {
  const qs = words(query);
  if (!qs.length) return true;
  const ws = words(haystack(s));
  return qs.every((q) => ws.some((w) => wordMatch(q, w)));
}

/** גיבוי מקומי ל-AI: ניקוד לפי מילים משותפות */
export function localRank(text: string, n = 4): Solution[] {
  const qs = words(text).filter((q) => q.length > 2);
  const scored = SOLUTIONS.map((s) => {
    const ws = words(haystack(s) + ' ' + catOf(s.cat).problem);
    const hits = qs.filter((q) => ws.some((w) => wordMatch(q.replace(PREFIX, '').slice(0, 5), w))).length;
    return { s, hits };
  });
  return scored.filter((x) => x.hits > 0).sort((a, b) => b.hits - a.hits).slice(0, n).map((x) => x.s);
}
