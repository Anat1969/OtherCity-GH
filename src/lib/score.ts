// מדד ההתאמה לאשדוד: דטרמיניסטי, בקוד, בלי שרת.
// נשען על מודל העברת המדיניות של דולוביץ ומארש (Dolowitz & Marsh, 2000): מה מועבר, מאיפה, ומה מגביל את ההעברה.
// רמת הראיות מותאמת מסולם השיטות המדעיות של מרילנד (Maryland Scientific Methods Scale, Sherman et al., 1997).
import { ASHDOD, type Solution, type CatId } from '../data/solutions';

export interface Param {
  key: string;
  he: string;
  weight: number;
  /** 0..1 */
  value: number;
  measures: string;
  how: string;
  limit: string;
  detail: string;
}

const CLIMATE: Record<string, number> = { med: 1, warm: 0.7, temperate: 0.45, highland: 0.4, cold: 0.25 };
const CLIMATE_HE: Record<string, string> = { med: 'ים־תיכוני', warm: 'חם ולח', temperate: 'ממוזג', highland: 'הררי טרופי', cold: 'קר' };
const EVIDENCE: Record<string, number> = { measured: 1, modeled: 0.75, reported: 0.55 };
export const EVIDENCE_HE: Record<string, string> = { measured: 'נמדד', modeled: 'הערכת מודל', reported: 'דיווח העירייה' };
export const EVIDENCE_HINT: Record<string, string> = {
  measured: 'השוואה מבוקרת או ניסוי טבעי (רמה 3 ומעלה בסולם מרילנד)',
  modeled: 'הערכת השפעה במודל, לא מדידה אחרי ביצוע',
  reported: 'דיווח של העירייה או של הגוף המבצע, בלי קבוצת השוואה',
};
const COST: Record<string, number> = { low: 1, mid: 0.65, high: 0.3 };
export const COST_HE: Record<string, string> = { low: 'נמוכה', mid: 'בינונית', high: 'גבוהה' };

/** האקלים והחוף חשובים יותר בבעיות פיזיות, פחות בבעיות שירות. */
const PHYSICAL: CatId[] = ['climate', 'sea', 'waste', 'mobility', 'emergency'];

const fmtPop = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} מיליון` : `${Math.round(n / 1000)} אלף`);

export function score(s: Solution): { total: number; params: Param[] } {
  const ratio = Math.abs(Math.log10(s.pop / ASHDOD.pop));
  const physical = PHYSICAL.includes(s.cat);
  const params: Param[] = [
    {
      key: 'scale', he: 'גודל העיר', weight: 25, value: Math.max(0, 1 - ratio / 1.5),
      measures: 'כמה העיר דומה לאשדוד בגודל האוכלוסייה.',
      how: 'מרחק לוגריתמי בין האוכלוסיות. פי 30 ומעלה מקבל אפס.',
      limit: 'גודל לא אומר הכול: צפיפות ומבנה שלטוני לא נמדדים.',
      detail: `${fmtPop(s.pop)} מול ${fmtPop(ASHDOD.pop)} באשדוד`,
    },
    {
      key: 'evidence', he: 'רמת הראיות', weight: 25, value: EVIDENCE[s.evidence],
      measures: 'כמה חזקה הראיה שהתוצאה נובעת מהפתרון.',
      how: 'נמדד 1, הערכת מודל 0.75, דיווח 0.55.',
      limit: 'הסיווג לפי המקור המצוטט, לא סקירה שיטתית.',
      detail: EVIDENCE_HE[s.evidence],
    },
    {
      key: 'cost', he: 'עלות ומורכבות', weight: 20, value: COST[s.cost],
      measures: 'כמה קל להתחיל: תקציב, תשתית ורגולציה.',
      how: 'נמוכה 1, בינונית 0.65, גבוהה 0.3, לפי סוג ההשקעה.',
      limit: 'הערכה גסה. אין מחירון אשדודי.',
      detail: COST_HE[s.cost],
    },
    {
      key: 'climate', he: 'אקלים', weight: physical ? 15 : 8, value: CLIMATE[s.climate],
      measures: 'האם הפתרון נבנה לאקלים דומה לאקלים הים־תיכוני של אשדוד.',
      how: 'ים־תיכוני 1, חם ולח 0.7, ממוזג 0.45, הררי 0.4, קר 0.25.',
      limit: 'משקל כפול בבעיות פיזיות: חום, מים, חוף ותחבורה.',
      detail: CLIMATE_HE[s.climate],
    },
    {
      key: 'coast', he: 'עיר חוף ונמל', weight: physical ? 10 : 5, value: s.coastal ? 1 : 0.4,
      measures: 'האם גם שם יש ים או נמל, כמו באשדוד.',
      how: 'עיר חוף 1, עיר פנים 0.4.',
      limit: 'לא מבחין בין נמל מסחרי לחוף רחצה.',
      detail: s.coastal ? 'עיר חוף' : 'עיר פנים',
    },
    {
      key: 'context', he: 'הקשר מוסדי', weight: 5, value: s.israel ? 1 : 0.6,
      measures: 'האם החוק והשלטון המקומי דומים לישראל.',
      how: 'ישראל 1, חו״ל 0.6.',
      limit: 'לא בודק סמכויות של רשות מקומית בפועל.',
      detail: s.israel ? 'ישראל' : s.country.he,
    },
  ];
  const wsum = params.reduce((a, p) => a + p.weight, 0);
  const total = Math.round((params.reduce((a, p) => a + p.weight * p.value, 0) / wsum) * 100);
  return { total, params };
}

/** מה לא עובר: הפרמטרים החלשים ביותר */
export const barriers = (s: Solution) => score(s).params.filter((p) => p.value < 0.5).sort((a, b) => a.value - b.value);

export const NOT_MEASURED = ['תקציב בפועל', 'עמדת הציבור', 'סמכות חוקית ורגולציה', 'מוכנות האגף המבצע'];

export const tier = (n: number) => (n >= 70 ? 'high' : n >= 50 ? 'mid' : 'low');
export const TIER_HE = { high: 'מתאים לאשדוד', mid: 'מתאים בהתאמה', low: 'השראה בלבד' } as const;
