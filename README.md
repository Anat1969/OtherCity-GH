# פתרונות של ערים אחרות

**[othercity-gh.vercel.app](https://othercity-gh.vercel.app)**
קישור למיזוג האחרון, בלי Vercel: [raw.githack.com/Anat1969/OtherCity-GH/main/app/index.html](https://raw.githack.com/Anat1969/OtherCity-GH/main/app/index.html) (בפעם הראשונה: "Open the page").

מאגר פתרונות שירות עירוני מערים אחרות, לבעיות דומות לאשדוד (Ashdod), עם מקור, תוצאה ומדד התאמה.
פעולה: השראה. תחום: שירות עירוני.

## מה יש בפנים
- **מפת העברה:** כל עיר מקור מחוברת לאשדוד בנתיב. זום, הזזה, ובורר בעיות שהוא גם המקרא.
- **מאגר:** 28 פתרונות מ-20 ערים, ב-9 בעיות. לכל פתרון: מנגנון, תוצאה, רמת ראיות, מקור והצעה לאשדוד.
- **מדד התאמה לאשדוד:** 6 פרמטרים, דטרמיניסטי בקוד. נשען על מודל העברת המדיניות (Dolowitz & Marsh, 2000) ועל סולם מרילנד לראיות (1997).
- **גשר ההעברה:** סרט זרימה בהשראת מינאר (1869): מה עובר לאשדוד ומה נעצר.
- **שאל את המאגר:** Gemini החינמי דרך פונקציית Edge, Claude כגיבוי, והתאמה מקומית כשאין חיבור. כל טקסט לפי [תקן הזיקוק](https://github.com/Anat1969/Claude-GH/blob/main/docs/ai-text-standard.md).
- **לוח השראה:** שמירה, הערות והדפסה כ-A4. נשמר אוטומטית בדפדפן.
- **כתבה:** "עובר המנגנון, לא החפץ", עם ציטוט, הייקו ופוסט.

## הרצה
```bash
npm install
npm run dev
```

## בדיקות
```bash
npm run build && npx vite preview --port 4173 &
npm test
```

## מבנה
- `src/data/solutions.ts`: מקור הנתונים היחיד.
- `src/lib/score.ts`: מדד ההתאמה.
- `src/lib/search.ts`: חיפוש עברי עם אותיות שימוש.
- `supabase/functions/othercity-inspire`: פונקציית ה-AI (Supabase `ktqmwpbzcnzkhjskqisy`).
- `tests/e2e.cjs`: Playwright מול `vite preview`, עם שרת מדומה.
