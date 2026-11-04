// מקור הנתונים היחיד של האפליקציה. כל תצוגה נגזרת מכאן.
// עובדות: רק מה שמופיע במקור המצוין. שדה ashdod הוא הצעה (הנחת עבודה), לא עובדה.

export type CatId = 'service' | 'street' | 'waste' | 'mobility' | 'climate' | 'participation' | 'sea' | 'inclusion' | 'emergency';
export type Climate = 'med' | 'warm' | 'temperate' | 'cold' | 'highland';
export type Evidence = 'measured' | 'modeled' | 'reported';
export type Cost = 'low' | 'mid' | 'high';
export type AppKey = 'moked106' | 'complaints' | 'architaip' | 'design';

export interface Category { id: CatId; he: string; problem: string; color: string }

/** הבעיות של אשדוד. כל קטגוריה היא בעיה, לא נושא. */
export const CATEGORIES: Category[] = [
  { id: 'service', he: 'פניות ומוקד', problem: 'פנייה עוברת בין אגפים, והתושב לא יודע מה קרה איתה.', color: '#2C5F8A' },
  { id: 'street', he: 'פיקוח ותחזוקה', problem: 'מפגעים מתגלים מאוחר, ורק איפה שמתלוננים.', color: '#6B4E9B' },
  { id: 'waste', he: 'פסולת ומחזור', problem: 'פחים מלאים, הפרדה חלקית ועלות הטמנה עולה.', color: '#5C7F2E' },
  { id: 'mobility', he: 'תחבורה וחניה', problem: 'עומס רכב, חניה צפופה וקשר חלש לרכבת.', color: '#C46A1B' },
  { id: 'climate', he: 'חום ומים', problem: 'קיץ חם יותר, מעט צל, והצפות בגשם חזק.', color: '#B08400' },
  { id: 'participation', he: 'השתתפות ותקציב', problem: 'תושבים מתלוננים, אבל לא שותפים להחלטה.', color: '#9C3D74' },
  { id: 'sea', he: 'נמל, חוף וים', problem: 'העיר על הים, אבל הנמל והחוף מנותקים ממנה.', color: '#1F8FB3' },
  { id: 'inclusion', he: 'שפה וקהילות', problem: 'עיר של עולים ושל קהילות, ושירות בשפה אחת.', color: '#7A5C3E' },
  { id: 'emergency', he: 'חירום וחוסן', problem: 'עיר בטווח ירי וחוף בסיכון, והמידע לא מגיע לכל בית.', color: '#4A4F57' },
];

export interface Solution {
  id: string;
  cat: CatId;
  city: { he: string; en: string };
  country: { he: string; en: string };
  lat: number;
  lon: number;
  /** אוכלוסיית העיר, בקירוב, לחישוב מדד הגודל */
  pop: number;
  climate: Climate;
  coastal: boolean;
  israel?: boolean;
  year: number;
  name: { he: string; en: string };
  /** שורת תובנה, עד 8 מילים */
  insight: string;
  /** המנגנון, משפט אחד */
  mechanism: string;
  /** התוצאה, לפי המקור */
  outcome: string;
  evidence: Evidence;
  cost: Cost;
  source: { label: string; url: string };
  /** הצעה לאשדוד: הנחת עבודה */
  ashdod: string;
  app?: AppKey;
}

export const ASHDOD = { he: 'אשדוד', en: 'Ashdod', lat: 31.8, lon: 34.65, pop: 230000, climate: 'med' as Climate, coastal: true };

export const APPS: Record<AppKey, { he: string; url: string; why: string }> = {
  moked106: { he: 'מוקד 106', url: 'https://moked106.vercel.app/', why: 'כאן רואים את עומס הפניות שהפתרון אמור להקל.' },
  complaints: { he: 'תלונות ציבור', url: 'https://id-preview--162a9210-f3cb-45f1-b3cd-2c794ebb2f50.lovable.app/', why: 'כאן נמדד אם הפתרון סוגר את המעגל מול התושב.' },
  architaip: { he: 'ארכיטייפ: DNA תרבותי', url: 'https://architaip.vercel.app/', why: 'כאן בודקים אם הפתרון מתאים לזהות התרבותית של המקום.' },
  design: { he: 'סגנונות עיצוב פנים', url: 'https://ai-design-buddy-68.lovable.app/login', why: 'כאן בוחרים שפת חומר וצבע למרחב שהפתרון יוצר.' },
};

export const SOLUTIONS: Solution[] = [
  // פניות ומוקד
  {
    id: 'nyc-311', cat: 'service', city: { he: 'ניו יורק', en: 'New York City' }, country: { he: 'ארצות הברית', en: 'USA' },
    lat: 40.71, lon: -74.01, pop: 8300000, climate: 'temperate', coastal: true, year: 2003,
    name: { he: 'קו 311 העירוני', en: 'NYC311' },
    insight: '**מספר אחד** במקום עשרות מוקדים.',
    mechanism: 'מעל **40** קווי שירות של העירייה אוחדו ל**מספר אחד**, עם מאגר ידע משותף ומעקב אחרי כל פנייה.',
    outcome: 'קו **311** הפך לערוץ הראשי לפניות, ונתוני הפניות פתוחים לציבור באתר הנתונים העירוני.',
    evidence: 'reported', cost: 'high', source: { label: 'NYC311, City of New York', url: 'https://portal.311.nyc.gov/' },
    ashdod: '**מוקד 106** כבר מאחד ערוצים. השלב הבא: **מאגר ידע** אחד לכל האגפים, ונתוני פניות פתוחים.', app: 'moked106',
  },
  {
    id: 'boston-connect', cat: 'service', city: { he: 'בוסטון', en: 'Boston' }, country: { he: 'ארצות הברית', en: 'USA' },
    lat: 42.36, lon: -71.06, pop: 650000, climate: 'temperate', coastal: true, year: 2009,
    name: { he: 'סגירת מעגל עם תמונה', en: 'Citizens Connect / BOS:311' },
    insight: '**תמונה** מהתושב, ותמונה בחזרה מהעובד.',
    mechanism: 'פנייה נשלחת עם **תמונה ומיקום**, והעובד שתיקן סוגר אותה עם **תמונת תיקון** שהתושב רואה.',
    outcome: 'האפליקציה הפכה לבסיס של **BOS:311**, והמודל הורחב לרשויות במדינת מסצ׳וסטס בשם Commonwealth Connect.',
    evidence: 'reported', cost: 'mid', source: { label: "Mayor's Office of New Urban Mechanics, Boston", url: 'https://www.boston.gov/departments/new-urban-mechanics' },
    ashdod: 'להוסיף ל**תלונות ציבור** תמונת תיקון שחוזרת לפונה, כ**הוכחת סגירה**.', app: 'complaints',
  },
  {
    id: 'seoul-120', cat: 'service', city: { he: 'סיאול', en: 'Seoul' }, country: { he: 'דרום קוריאה', en: 'South Korea' },
    lat: 37.57, lon: 126.98, pop: 9400000, climate: 'temperate', coastal: false, year: 2007,
    name: { he: 'מוקד דאסאן 120', en: 'Dasan Call Center 120' },
    insight: '**שאלה אחת**, תשובה אחת, גם בשפה זרה.',
    mechanism: 'מוקד עירוני אחד ב**מספר 120** עונה על שאלות מכל תחומי העירייה, כולל **שירות בשפות זרות**.',
    outcome: 'המוקד הוא נקודת הכניסה המרכזית של תושבי סיאול לכל שאלה עירונית.',
    evidence: 'reported', cost: 'mid', source: { label: 'Seoul Metropolitan Government', url: 'https://english.seoul.go.kr/' },
    ashdod: 'שירות **106** בשפות הנפוצות בעיר, **רוסית, צרפתית ואמהרית**, בשעות קבועות.', app: 'moked106',
  },
  {
    id: 'open311', cat: 'service', city: { he: 'סן פרנסיסקו', en: 'San Francisco' }, country: { he: 'ארצות הברית', en: 'USA' },
    lat: 37.77, lon: -122.42, pop: 810000, climate: 'med', coastal: true, year: 2010,
    name: { he: 'תקן פתוח לפניות', en: 'Open311' },
    insight: '**תקן פתוח** מחבר כל אפליקציה למוקד.',
    mechanism: 'ממשק **API** אחיד לפניות עירוניות, כך שכל אפליקציה שולחת וקוראת פניות **בלי פיתוח נפרד**.',
    outcome: 'התקן אומץ בערים רבות, ובהן סן פרנסיסקו, וושינגטון ושיקגו.',
    evidence: 'reported', cost: 'low', source: { label: 'Open311', url: 'https://www.open311.org/' },
    ashdod: 'לפתוח את **106** בממשק פתוח, כדי ש**תלונות ציבור** ו-106 יחלקו **פנייה אחת**.', app: 'moked106',
  },
  // פיקוח ותחזוקה
  {
    id: 'boston-streetbump', cat: 'street', city: { he: 'בוסטון', en: 'Boston' }, country: { he: 'ארצות הברית', en: 'USA' },
    lat: 42.36, lon: -71.06, pop: 650000, climate: 'temperate', coastal: true, year: 2012,
    name: { he: 'הטלפון מאתר בורות', en: 'Street Bump' },
    insight: '**הטלפון בכיס** מאתר בורות בכביש.',
    mechanism: '**חיישן התאוצה** בטלפון מזהה מכה בנסיעה ושולח מיקום, בלי שהנהג ילחץ על דבר.',
    outcome: 'הנתונים נטו לשכונות עם יותר בעלי **סמארטפון**, והעירייה איזנה אותם בנסיעות של **רכבי העירייה**.',
    evidence: 'reported', cost: 'low', source: { label: 'Kate Crawford, Harvard Business Review, 2013', url: 'https://hbr.org/2013/04/the-hidden-biases-in-big-data' },
    ashdod: 'להתקין את החיישן ב**רכבי העירייה** ובאוטובוסים, כדי לכסות **את כל הרובעים** באופן שווה.', app: 'moked106',
  },
  {
    id: 'chicago-food', cat: 'street', city: { he: 'שיקגו', en: 'Chicago' }, country: { he: 'ארצות הברית', en: 'USA' },
    lat: 41.88, lon: -87.63, pop: 2700000, climate: 'temperate', coastal: false, year: 2014,
    name: { he: 'חיזוי ביקורות מזון', en: 'Food Inspection Forecasting' },
    insight: '**מודל חיזוי** מקדים את הפקח.',
    mechanism: 'מודל מדרג עסקים לפי **סיכון להפרה**, והפקחים מגיעים קודם למקומות המסוכנים.',
    outcome: 'בבדיקה מבוקרת נמצאו הפרות חמורות בממוצע **7.5** ימים מוקדם יותר.',
    evidence: 'measured', cost: 'mid', source: { label: 'City of Chicago, Food Inspections Evaluation', url: 'https://chicago.github.io/food-inspections-evaluation/' },
    ashdod: 'לדרג ביקורות **רישוי עסקים** לפי היסטוריית פניות ב-**106**, ולא לפי סבב קבוע.', app: 'moked106',
  },
  // פסולת ומחזור
  {
    id: 'taipei-bags', cat: 'waste', city: { he: 'טאיפיי', en: 'Taipei' }, country: { he: 'טייוואן', en: 'Taiwan' },
    lat: 25.03, lon: 121.56, pop: 2500000, climate: 'warm', coastal: false, year: 2000,
    name: { he: 'שקית בתשלום ומשאית מתנגנת', en: 'Per-bag trash fee' },
    insight: '**משלמים לפי שקית**, ממחזרים בחינם.',
    mechanism: 'פסולת מעורבת רק ב**שקית עירונית בתשלום**, מחזור בחינם, ו**משאית מתנגנת** מגיעה בשעה קבועה.',
    outcome: 'כמות הפסולת לשריפה ירדה ושיעור המחזור עלה, לפי משרד הגנת הסביבה של טאיפיי.',
    evidence: 'reported', cost: 'mid', source: { label: 'Department of Environmental Protection, Taipei City Government', url: 'https://www.dep.gov.taipei/' },
    ashdod: 'פיילוט בשכונה אחת: **שקית ממוסמנת** לפסולת מעורבת, ו**איסוף מחזור** בתדירות גבוהה יותר.',
  },
  {
    id: 'ljubljana-zero', cat: 'waste', city: { he: 'לובליאנה', en: 'Ljubljana' }, country: { he: 'סלובניה', en: 'Slovenia' },
    lat: 46.06, lon: 14.51, pop: 290000, climate: 'temperate', coastal: false, year: 2014,
    name: { he: 'בירה לאפס פסולת', en: 'Zero Waste Ljubljana' },
    insight: '**איסוף מופרד** מהבית, מכלים נעלמים מהרחוב.',
    mechanism: '**איסוף נפרד** מהבית, **מכלים תת־קרקעיים** במרכז העיר עם כרטיס תושב, ומרכז שימוש חוזר עירוני.',
    outcome: 'לובליאנה נבחרה ל**בירה הירוקה של אירופה 2016**, והייתה הבירה הראשונה באיחוד שהתחייבה לאפס פסולת.',
    evidence: 'reported', cost: 'high', source: { label: 'Zero Waste Europe, The Story of Ljubljana', url: 'https://zerowasteeurope.eu/library/the-story-of-ljubljana/' },
    ashdod: '**מכלים תת־קרקעיים** ברחובות המסחריים ובמרכז העיר, עם פתיחה ב**כרטיס תושב**.',
  },
  {
    id: 'sf-compost', cat: 'waste', city: { he: 'סן פרנסיסקו', en: 'San Francisco' }, country: { he: 'ארצות הברית', en: 'USA' },
    lat: 37.77, lon: -122.42, pop: 810000, climate: 'med', coastal: true, year: 2009,
    name: { he: 'חובת הפרדה לשלושה פחים', en: 'Mandatory Recycling and Composting Ordinance' },
    insight: '**שלושה פחים** בחובה, לכל בית ועסק.',
    mechanism: 'חוק עירוני מחייב **הפרדה לשלושה זרמים**: מחזור, קומפוסט ושאר, בכל בית ועסק.',
    outcome: 'סן פרנסיסקו הייתה העיר הראשונה בארצות הברית שחייבה הפרדת **קומפוסט**.',
    evidence: 'reported', cost: 'mid', source: { label: 'SF Environment Department', url: 'https://www.sfenvironment.org/' },
    ashdod: 'להתחיל ב**חובת קומפוסט** לעסקי מזון ומסעדות **בטיילת**, ורק אחר כך בבתים.',
  },
  // תחבורה וחניה
  {
    id: 'tallinn-free', cat: 'mobility', city: { he: 'טאלין', en: 'Tallinn' }, country: { he: 'אסטוניה', en: 'Estonia' },
    lat: 59.44, lon: 24.75, pop: 450000, climate: 'cold', coastal: true, year: 2013,
    name: { he: 'תחבורה ציבורית חינם לתושבים', en: 'Fare-free public transport' },
    insight: '**נסיעה חינם** לכל תושב רשום.',
    mechanism: 'תושב שרשום ב**מרשם העירוני** נוסע חינם, ולכן נרשמו תושבים חדשים והכנסות **המס העירוני** עלו.',
    outcome: 'מחקר מצא עלייה מתונה בנסיעות, ==בעיקר על חשבון הליכה, לא על חשבון הרכב==.',
    evidence: 'measured', cost: 'high', source: { label: 'Cats, Susilo & Reimal, Transportation, 2017', url: 'https://doi.org/10.1007/s11116-016-9695-5' },
    ashdod: 'לבחון **הנחה לתושבים רשומים** בקווים הפנימיים, ולמדוד אם היא מחליפה **נסיעות ברכב**.',
  },
  {
    id: 'utrecht-bikes', cat: 'mobility', city: { he: 'אוטרכט', en: 'Utrecht' }, country: { he: 'הולנד', en: 'Netherlands' },
    lat: 52.09, lon: 5.12, pop: 370000, climate: 'temperate', coastal: false, year: 2019,
    name: { he: 'חניון האופניים הגדול בעולם', en: 'Stationsplein bicycle parking' },
    insight: '**12,500** אופניים מתחת לתחנת הרכבת.',
    mechanism: 'חניון אופניים תת־קרקעי בן **שלוש קומות** צמוד לרציפים, עם **24** השעות הראשונות חינם.',
    outcome: 'החניון בתחנה המרכזית של אוטרכט הוא חניון האופניים הגדול בעולם.',
    evidence: 'reported', cost: 'high', source: { label: 'Gemeente Utrecht', url: 'https://www.utrecht.nl/' },
    ashdod: 'חניון אופניים **מקורה ומאובטח** בתחנת הרכבת **אשדוד עד הלום**, כשלב ראשון.',
  },
  {
    id: 'bogota-ciclovia', cat: 'mobility', city: { he: 'בוגוטה', en: 'Bogotá' }, country: { he: 'קולומביה', en: 'Colombia' },
    lat: 4.71, lon: -74.07, pop: 7900000, climate: 'highland', coastal: false, year: 1974,
    name: { he: 'סיקלוביה', en: 'Ciclovía' },
    insight: '**כבישים** נסגרים לרכב בכל יום ראשון.',
    mechanism: 'מעל **120** ק״מ של כבישים נסגרים לרכב בימי ראשון וחג, לרוכבים, להולכים ולמשפחות.',
    outcome: 'התוכנית פועלת מאז **1974**, ושימשה מודל לערים רבות בעולם.',
    evidence: 'reported', cost: 'low', source: { label: 'IDRD, Bogotá', url: 'https://www.idrd.gov.co/' },
    ashdod: 'סגירת ציר אחד ליד **החוף** לרכב, בבוקר קבוע בשבוע, כניסוי של **חודשיים**.',
  },
  {
    id: 'medellin-cable', cat: 'mobility', city: { he: 'מדיין', en: 'Medellín' }, country: { he: 'קולומביה', en: 'Colombia' },
    lat: 6.24, lon: -75.58, pop: 2600000, climate: 'highland', coastal: false, year: 2004,
    name: { he: 'רכבל כתחבורה ציבורית', en: 'Metrocable' },
    insight: '**רכבל** מחבר שכונות מבודדות לרכבת.',
    mechanism: 'קו רכבל משולב ב**מטרו**, ב**כרטיס אחד**, לשכונות על מדרון שאין אליהן כביש רחב.',
    outcome: 'ניסוי טבעי מצא ששיעור ה**רצח** ירד בכ-**66%** יותר בשכונות שליד הרכבל, לעומת שכונות דומות.',
    evidence: 'measured', cost: 'high', source: { label: 'Cerdá et al., American Journal of Epidemiology, 2012', url: 'https://doi.org/10.1093/aje/kwr428' },
    ashdod: 'אשדוד שטוחה. עובר העיקרון: **קו מזין** שמחבר שכונה מנותקת ל**רכבת**, בכרטיס אחד.',
  },
  // חום ומים
  {
    id: 'rotterdam-water', cat: 'climate', city: { he: 'רוטרדם', en: 'Rotterdam' }, country: { he: 'הולנד', en: 'Netherlands' },
    lat: 51.92, lon: 4.48, pop: 660000, climate: 'temperate', coastal: true, year: 2013,
    name: { he: 'כיכר מים', en: 'Waterplein Benthemplein' },
    insight: '**כיכר** שהיא גם מאגר מים.',
    mechanism: 'שלושה **אגנים שקועים** משמשים כמגרש ספורט ובמה, ובסערה אוגרים את מי הגשם.',
    outcome: 'הכיכר אוגרת עד **1.7** מיליון ליטר מים, ומשחררת אותם בהדרגה למערכת.',
    evidence: 'reported', cost: 'high', source: { label: 'De Urbanisten, Benthemplein', url: 'https://www.urbanisten.nl/work/benthemplein' },
    ashdod: '**גן ציבורי** בשכונה נמוכה שמתוכנן כאגן השהיה, עם מגרש ספורט שמתמלא רק בסערה.', app: 'architaip',
  },
  {
    id: 'paris-oasis', cat: 'climate', city: { he: 'פריז', en: 'Paris' }, country: { he: 'צרפת', en: 'France' },
    lat: 48.86, lon: 2.35, pop: 2100000, climate: 'temperate', coastal: false, year: 2018,
    name: { he: 'חצרות אואזיס', en: 'Cours Oasis' },
    insight: '**חצר בית ספר** הופכת לאי קריר.',
    mechanism: 'אספלט מוחלף ב**צמחייה, הצללה וקרקע מחלחלת**, והחצר נפתחת לציבור מחוץ לשעות הלימודים.',
    outcome: 'התוכנית היא חלק מאסטרטגיית החוסן של פריז, ועשרות חצרות שופצו מאז **2018**.',
    evidence: 'reported', cost: 'mid', source: { label: 'Ville de Paris, Les cours Oasis', url: 'https://www.paris.fr/pages/les-cours-oasis-7389' },
    ashdod: '**חצר בית ספר** אחת בכל רובע, פתוחה לתושבים ב**ערבי הקיץ**.', app: 'design',
  },
  {
    id: 'medellin-green', cat: 'climate', city: { he: 'מדיין', en: 'Medellín' }, country: { he: 'קולומביה', en: 'Colombia' },
    lat: 6.24, lon: -75.58, pop: 2600000, climate: 'highland', coastal: false, year: 2016,
    name: { he: 'מסדרונות ירוקים', en: 'Corredores Verdes' },
    insight: '**רחובות ירוקים** מורידים את חום העיר.',
    mechanism: '**30** מסדרונות של עצים וצמחייה לאורך רחובות ונחלים, בתחזוקת גננים מקהילות מוחלשות.',
    outcome: 'העירייה מדווחת על ירידה של כ-**2** מעלות, והפרויקט זכה ב**פרס אשדן 2019**.',
    evidence: 'reported', cost: 'mid', source: { label: 'Alcaldía de Medellín, Corredores verdes', url: 'https://www.medellin.gov.co/es/secretaria-medio-ambiente/medellin-biodiversa/corredores-y-muros-verdes/' },
    ashdod: '**מסדרון מוצל** אחד שמחבר שכונת מגורים לחוף, עם גננים מהשכונה עצמה.',
  },
  {
    id: 'barcelona-superblocks', cat: 'climate', city: { he: 'ברצלונה', en: 'Barcelona' }, country: { he: 'ספרד', en: 'Spain' },
    lat: 41.39, lon: 2.17, pop: 1650000, climate: 'med', coastal: true, year: 2016,
    name: { he: 'סופר־בלוקים', en: 'Superilles' },
    insight: '**תשעה בלוקים**, ורחוב פנימי בלי מעבר רכב.',
    mechanism: 'רשת של **3×3** בלוקים סוגרת את הרחובות הפנימיים לתנועה עוברת, והם הופכים למרחב ציבורי.',
    outcome: 'הערכת השפעה מצאה שיישום מלא ימנע כ-**667** מקרי מוות מוקדם בשנה.',
    evidence: 'modeled', cost: 'mid', source: { label: 'Mueller et al., Environment International, 2020', url: 'https://doi.org/10.1016/j.envint.2019.105132' },
    ashdod: 'אשדוד בנויה **ברובעים**. רובע אחד יכול לנסות **רחוב פנימי** סגור לתנועה עוברת.', app: 'design',
  },
  {
    id: 'seoul-stream', cat: 'climate', city: { he: 'סיאול', en: 'Seoul' }, country: { he: 'דרום קוריאה', en: 'South Korea' },
    lat: 37.57, lon: 126.98, pop: 9400000, climate: 'temperate', coastal: false, year: 2005,
    name: { he: 'שחרור נחל צ׳ונגגייצ׳ון', en: 'Cheonggyecheon Restoration' },
    insight: '**כביש מהיר** פורק, ונחל חזר לעיר.',
    mechanism: 'כביש עילי מעל נחל מכוסה **פורק**, והנחל שוקם כפארק ליניארי באורך כ-**5.8** ק״מ.',
    outcome: 'מדידות הראו טמפרטורה נמוכה ב-**3.3** עד **5.9** מעלות לאורך הנחל, לעומת רחוב מקביל.',
    evidence: 'measured', cost: 'high', source: { label: 'Landscape Performance Series, Cheonggyecheon', url: 'https://landscapeperformance.org/case-study-briefs/cheonggyecheon-stream-restoration' },
    ashdod: '**נחל לכיש** כבר זורם בעיר. ההזדמנות: **שבילים מוצלים** שמחברים אותו לשכונות שלידו.', app: 'architaip',
  },
  // השתתפות ותקציב
  {
    id: 'porto-alegre-pb', cat: 'participation', city: { he: 'פורטו אלגרה', en: 'Porto Alegre' }, country: { he: 'ברזיל', en: 'Brazil' },
    lat: -30.03, lon: -51.23, pop: 1300000, climate: 'warm', coastal: false, year: 1989,
    name: { he: 'תקציב משתף', en: 'Orçamento Participativo' },
    insight: '**תושבים** מחליטים על חלק מתקציב ההשקעות.',
    mechanism: '**אספות שכונתיות** מדרגות צרכים, ונציגים נבחרים מתרגמים את הדירוג לתוכנית ההשקעות.',
    outcome: 'המודל שנולד בפורטו אלגרה ב-**1989** התפשט לאלפי ערים בעולם.',
    evidence: 'reported', cost: 'low', source: { label: 'Participatory Budgeting Project', url: 'https://www.participatorybudgeting.org/' },
    ashdod: 'סבב ראשון ב**רובע אחד**, עם סכום קבוע ותוצאות שמוצגות על **מפה**.', app: 'complaints',
  },
  {
    id: 'paris-pb', cat: 'participation', city: { he: 'פריז', en: 'Paris' }, country: { he: 'צרפת', en: 'France' },
    lat: 48.86, lon: 2.35, pop: 2100000, climate: 'temperate', coastal: false, year: 2014,
    name: { he: 'התקציב המשתף של פריז', en: 'Budget Participatif' },
    insight: '**5%** מתקציב ההשקעות בידי התושבים.',
    mechanism: 'כל תושב מציע פרויקט, העירייה בודקת היתכנות, ו**הצבעה פתוחה** קובעת מה נבנה.',
    outcome: 'אחת התוכניות הגדולות בעולם, עם כ**חצי מיליארד** אירו בין **2014** ל-**2020**.',
    evidence: 'reported', cost: 'mid', source: { label: 'Ville de Paris, Budget Participatif', url: 'https://budgetparticipatif.paris.fr/' },
    ashdod: 'רעיונות דרך **106** ו**תלונות ציבור**, ו**הצבעה דיגיטלית** לתושב רשום.', app: 'complaints',
  },
  {
    id: 'reykjavik-better', cat: 'participation', city: { he: 'רייקיאוויק', en: 'Reykjavík' }, country: { he: 'איסלנד', en: 'Iceland' },
    lat: 64.15, lon: -21.94, pop: 140000, climate: 'cold', coastal: true, year: 2010,
    name: { he: 'רייקיאוויק טובה יותר', en: 'Betri Reykjavík' },
    insight: '**הרעיונות המובילים** עולים לדיון במועצה.',
    mechanism: 'תושבים מציעים ומדרגים רעיונות, ו**הרעיונות המובילים בכל חודש** מגיעים לדיון רשמי בעירייה.',
    outcome: 'הפלטפורמה פועלת מאז **2010** והפכה לחלק קבוע מתהליך קבלת ההחלטות בעיר.',
    evidence: 'reported', cost: 'low', source: { label: 'Citizens Foundation', url: 'https://citizens.is/' },
    ashdod: '**רעיון החודש** מתוך **תלונות ציבור**, שמוצג בישיבת הנהלה ומקבל תשובה כתובה.', app: 'complaints',
  },
  {
    id: 'barcelona-decidim', cat: 'participation', city: { he: 'ברצלונה', en: 'Barcelona' }, country: { he: 'ספרד', en: 'Spain' },
    lat: 41.39, lon: 2.17, pop: 1650000, climate: 'med', coastal: true, year: 2016,
    name: { he: 'דסידים', en: 'Decidim' },
    insight: '**קוד פתוח** להשתתפות, לכל עירייה.',
    mechanism: 'פלטפורמה פתוחה לתכנון משתף, הצבעות ותקציב, שכל רשות יכולה **להתקין ולהתאים**.',
    outcome: 'דסידים אומצה בידי ערים וממשלות במדינות רבות, ובהן **הלסינקי** בתקציב המשתף שלה.',
    evidence: 'reported', cost: 'low', source: { label: 'Decidim', url: 'https://decidim.org/' },
    ashdod: 'להקים את **התקציב המשתף** על דסידים, במקום לפתח מערכת מאפס.',
  },
  // נמל, חוף וים
  {
    id: 'copenhagen-harbour', cat: 'sea', city: { he: 'קופנהגן', en: 'Copenhagen' }, country: { he: 'דנמרק', en: 'Denmark' },
    lat: 55.67, lon: 12.58, pop: 650000, climate: 'temperate', coastal: true, year: 2002,
    name: { he: 'מרחצאות הנמל', en: 'Islands Brygge Harbour Bath' },
    insight: '**נמל** נקי מספיק כדי לשחות בו.',
    mechanism: 'שדרוג **מערכת הביוב** הפסיק את הזרמת השפכים לנמל, ונבנו מרחצאות ציבוריים על הרציף.',
    outcome: 'מרחץ איסלנדס בריגה נפתח ב-**2002**, ובעקבותיו נפתחו אתרי רחצה נוספים בנמל.',
    evidence: 'reported', cost: 'high', source: { label: 'City of Copenhagen', url: 'https://international.kk.dk/' },
    ashdod: 'פינת רחצה מוגנת ב**מרינה**, עם **ניטור איכות מים** פתוח לציבור.', app: 'architaip',
  },
  {
    id: 'barcelona-waterfront', cat: 'sea', city: { he: 'ברצלונה', en: 'Barcelona' }, country: { he: 'ספרד', en: 'Spain' },
    lat: 41.39, lon: 2.17, pop: 1650000, climate: 'med', coastal: true, year: 1992,
    name: { he: 'העיר נפתחת לים', en: 'Olympic Waterfront' },
    insight: '**מסילות ותעשייה** פינו מקום לחופים.',
    mechanism: 'לקראת **אולימפיאדת 1992** הוזזו מסילות ותעשייה מקו החוף, ונבנו חופים וטיילת.',
    outcome: 'חזית הים הפכה לאחד המרחבים הציבוריים המרכזיים של ברצלונה.',
    evidence: 'reported', cost: 'high', source: { label: 'Ajuntament de Barcelona', url: 'https://www.barcelona.cat/' },
    ashdod: 'מעבר **רציף להולכי רגל** בין **הנמל**, **המרינה** והטיילת.', app: 'architaip',
  },
  // שפה וקהילות
  {
    id: 'telaviv-digitel', cat: 'inclusion', city: { he: 'תל אביב־יפו', en: 'Tel Aviv-Yafo' }, country: { he: 'ישראל', en: 'Israel' },
    lat: 32.08, lon: 34.78, pop: 470000, climate: 'med', coastal: true, israel: true, year: 2013,
    name: { he: 'דיגיתל', en: 'DigiTel' },
    insight: '**כרטיס תושב** שמכיר אותך ואת השכונה.',
    mechanism: 'מועדון תושבים דיגיטלי שולח **מידע מותאם** לפי שכונה, גיל ותחומי עניין, עם הטבות לתושבים.',
    outcome: 'דיגיתל הפכה לערוץ התקשורת המרכזי בין עיריית תל אביב־יפו לתושבים.',
    evidence: 'reported', cost: 'mid', source: { label: 'עיריית תל אביב־יפו', url: 'https://www.tel-aviv.gov.il/' },
    ashdod: '**כרטיס תושב** אשדודי עם עדכונים לפי **רובע** ולפי **שפה**.', app: 'moked106',
  },
  {
    id: 'nyc-language', cat: 'inclusion', city: { he: 'ניו יורק', en: 'New York City' }, country: { he: 'ארצות הברית', en: 'USA' },
    lat: 40.71, lon: -74.01, pop: 8300000, climate: 'temperate', coastal: true, year: 2017,
    name: { he: 'חוק הנגישות לשפה', en: 'Local Law 30' },
    insight: '**עשר שפות** בכל שירות עירוני.',
    mechanism: 'חוק עירוני מחייב כל משרד עירוני לתרגם מסמכים חיוניים ל-**10** השפות הנפוצות בעיר ולספק מתורגמן.',
    outcome: 'החוק מעגן שירות בשפת התושב, והעירייה מפרסמת דוח יישום.',
    evidence: 'reported', cost: 'mid', source: { label: "NYC Mayor's Office of Immigrant Affairs", url: 'https://www.nyc.gov/site/immigrants/' },
    ashdod: '**רשימת שפות** קבועה לטפסים חיוניים: עברית, **רוסית, צרפתית, אמהרית** ואנגלית.', app: 'architaip',
  },
  // חירום וחוסן
  {
    id: 'tokyo-bousai', cat: 'emergency', city: { he: 'טוקיו', en: 'Tokyo' }, country: { he: 'יפן', en: 'Japan' },
    lat: 35.68, lon: 139.69, pop: 14000000, climate: 'warm', coastal: true, year: 2015,
    name: { he: 'ספר ההיערכות של טוקיו', en: 'Tokyo Bousai' },
    insight: '**ספר היערכות** בכל בית בעיר.',
    mechanism: 'מדריך מאויר ומעשי לאסון נשלח לכל **משק בית**, עם גרסה דיגיטלית בכמה שפות.',
    outcome: 'הספר חולק לכ-**7.5** מיליון משקי בית בשנת **2015**.',
    evidence: 'reported', cost: 'mid', source: { label: 'Tokyo Metropolitan Government, 2015', url: 'https://www.metro.tokyo.jp/ENGLISH/TOPICS/2015/150831.htm' },
    ashdod: '**מדריך מרחב מוגן** לכל בית, ב**ארבע שפות**, עם מפת המקלט הקרוב.', app: 'moked106',
  },
  {
    id: 'kamaishi-drills', cat: 'emergency', city: { he: 'קמאישי', en: 'Kamaishi' }, country: { he: 'יפן', en: 'Japan' },
    lat: 39.28, lon: 141.89, pop: 32000, climate: 'temperate', coastal: true, year: 2011,
    name: { he: 'שלושת הכללים של קמאישי', en: 'Kamaishi Tsunami Education' },
    insight: '**תרגול בבית הספר** הציל כמעט את כולם.',
    mechanism: 'תלמידים תרגלו שנים לפי **שלושה כללים**: לא לסמוך על התחזית, לעשות את המיטב, ולהוביל את הפינוי.',
    outcome: 'בצונאמי של **2011** שרדו כמעט כל תלמידי בתי הספר היסודיים והחטיבות בעיר.',
    evidence: 'reported', cost: 'low', source: { label: 'שגרירות יפן בישראל, Disaster Management Education in Kamaishi', url: 'https://www.israel.emb-japan.go.jp/Story_DisasterManagement.html' },
    ashdod: 'תרגיל **פינוי מהחוף** קבוע בבתי הספר הקרובים לים, לפי אותם **שלושה כללים**.',
  },
];

export const catOf = (id: CatId) => CATEGORIES.find((c) => c.id === id)!;
export const byId = (id: string) => SOLUTIONS.find((s) => s.id === id);
