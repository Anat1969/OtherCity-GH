// AI בתוך האפליקציה: פונקציית Edge ב-Supabase. Gemini החינמי קודם, Claude רק כגיבוי.
// המפתחות לא מגיעים לדפדפן. בלי חיבור: התאמה מקומית בקוד, ואומרים זאת.
import { SOLUTIONS, catOf } from '../data/solutions';

export const FN_URL = 'https://ktqmwpbzcnzkhjskqisy.supabase.co/functions/v1/othercity-inspire';
// מפתח anon ציבורי (קריאה בלבד, מוגן ב-RLS). פונקציית ה-Edge דורשת JWT תקין.
export const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cW13cGJ6Y256a2hqc2txaXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODM4OTgsImV4cCI6MjEwNTc1OTg5OH0.uPKn4hrLk16jhDoajMjPl4OmV5j1b3bMIECVmOdhWGI';

export interface Part { insight: string; detail: string }
export interface AskResult {
  matches: { id: string; why: Part }[];
  adapt: Part;
  steps: string[];
  engine: 'gemini' | 'claude' | 'local';
}

export async function ask(problem: string): Promise<AskResult> {
  const catalog = SOLUTIONS.map((s) => ({ id: s.id, cat: catOf(s.cat).he, city: s.city.he, name: s.name.he, insight: s.insight, mechanism: s.mechanism, outcome: s.outcome }));
  const r = await fetch(FN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
    body: JSON.stringify({ problem, catalog }),
    signal: AbortSignal.timeout(40000),
  });
  if (!r.ok) throw new Error(`השרת החזיר ${r.status}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  const ids = new Set(SOLUTIONS.map((s) => s.id));
  return { ...j, matches: (j.matches ?? []).filter((m: { id: string }) => ids.has(m.id)) };
}
