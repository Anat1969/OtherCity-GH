import Rich from '../components/Rich';
import { byId, SOLUTIONS } from '../data/solutions';

const N = SOLUTIONS.length;
const C = new Set(SOLUTIONS.map((x) => x.city.en)).size;
import { href } from '../lib/route';

const cite = (id: string) => { const s = byId(id)!; return <span className="src"> (<a href={s.source.url} target="_blank" rel="noreferrer">{s.source.label}</a>)</span>; };

export default function Feature() {
  return (
    <main className="feature">
      <article className="article">
        <div className="kicker">כתבה · השראה · שירות עירוני</div>
        <h1>עובר המנגנון, לא החפץ</h1>
        <p className="deck">שלושה פתרונות עירוניים מוכרים, ומה כל אחד מהם מלמד את אשדוד על העברת רעיונות בין ערים.</p>

        <p className="drop">כל עירייה מכירה את הרגע: מישהו חוזר מכנס בחו״ל עם תמונה של רחוב, אפליקציה או רכבל. השאלה היא לא אם הרעיון טוב, אלא מה ממנו יכול לעבור את הים ולעבוד ברובע של אשדוד.</p>

        <h2>בוסטון: הטלפון ראה רק חצי עיר</h2>
        <p><Rich>{'ב-**2012** הפעילה בוסטון אפליקציה שמזהה בורות בכביש דרך **חיישן התאוצה** של הטלפון.'}</Rich> <Rich>{'הנתונים נטו לשכונות שבהן יותר תושבים מחזיקים בסמארטפון, והעירייה איזנה אותם בנסיעות של רכבי העירייה.'}</Rich>{cite('boston-streetbump')}</p>
        <p><Rich>{'הלקח לאשדוד: ==נתון שנאסף מתושבים משקף מי מדווח, לא איפה הבעיה==. מוקד 106 צריך מקור שני, שווה לכל הרובעים.'}</Rich></p>

        <figure className="pull">
          <q>לערים יש היכולת לספק משהו לכולם, רק משום שהן נבנות בידי כולם, ורק כאשר הן נבנות בידי כולם.</q>
          <div className="howto">תרגום. ג׳יין ג׳ייקובס (Jane Jacobs), "מותן וחייהן של ערים אמריקאיות גדולות", 1961.</div>
          <div className="orig">"Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody." The Death and Life of Great American Cities, 1961.</div>
        </figure>

        <h2>טאלין: מחיר לבד לא מוריד רכבים</h2>
        <p><Rich>{'מ-**2013** תושב רשום בטאלין נוסע בתחבורה הציבורית **חינם**.'}</Rich> <Rich>{'מחקר מצא עלייה מתונה בנסיעות, בעיקר על חשבון **הליכה ברגל** ולא על חשבון הרכב.'}</Rich>{cite('tallinn-free')}</p>
        <p>הלקח: לפני שמורידים מחיר, מודדים מאיפה יבואו הנוסעים החדשים.</p>

        <h2>מדיין: העיקרון עובר, הכבל לא</h2>
        <p><Rich>{'רכבל שמשולב במטרו חיבר שכונות על מדרון לעיר, ובשכונות שלידו ירד שיעור הרצח בכ-**66%** יותר מאשר בשכונות דומות.'}</Rich>{cite('medellin-cable')}</p>
        <p>אשדוד שטוחה, ואין בה מדרונות. מה שעובר הוא העיקרון: קו מזין שמחבר שכונה מנותקת לרכבת, בכרטיס אחד.</p>

        <div className="tone tone-insight" style={{ margin: '28px 0' }}>
          <h4>התובנה</h4>
          <p><mark className="insight">פתרון עובר בין ערים כשמפרקים אותו למנגנון, ובודקים כל חלק מול המקום.</mark></p>
        </div>

        <div className="haiku lines" aria-label="הייקו">
          <span>מכולה בנמל</span>
          <span>רעיון מברצלונה</span>
          <span>נפתח באשדוד</span>
        </div>
        <p className="howto">מה ההייקו מאיר: פתרון מגיע סגור, וערכו נקבע רק כשפותחים אותו בעיר שמקבלת אותו.</p>

        <h2>פוסט, מוכן להעתקה</h2>
        <div className="post lines">
          <span>בוסטון בנתה אפליקציה שמוצאת בורות בכביש, וגילתה שהיא רואה רק את השכונות העשירות.</span>
          <span>טאלין ביטלה את מחיר הנסיעה, והנוסעים החדשים הגיעו מהמדרכה ולא מהרכב.</span>
          <span>הלקח לכל עירייה: לא מעתיקים פתרון, מפרקים אותו.</span>
          <span>מה המנגנון, מה הייתה התוצאה, ומה מזה מתאים לגודל, לאקלים ולתקציב שלנו.</span>
          <span>{`בנינו מאגר של ${N} פתרונות מ-${C} ערים, וכל אחד מקבל מדד התאמה לאשדוד.`}</span>
          <span>איזה פתרון מעיר אחרת הייתם רוצים לראות אצלכם ברחוב?</span>
        </div>

        <h2>מקורות</h2>
        <ol className="src" style={{ lineHeight: 1.9 }}>
          {['boston-streetbump', 'tallinn-free', 'medellin-cable'].map((id) => { const s = byId(id)!; return <li key={id}><a href={s.source.url} target="_blank" rel="noreferrer">{s.source.label}</a></li>; })}
          <li>Jane Jacobs, The Death and Life of Great American Cities, Random House, 1961.</li>
        </ol>
        <p className="no-print" style={{ marginTop: 24 }}><a className="press btn" href={href('bank')} style={{ textDecoration: 'none' }}>{`לכל ${N} הפתרונות במאגר`}</a></p>
      </article>
    </main>
  );
}
