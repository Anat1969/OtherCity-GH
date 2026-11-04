import { useState } from 'react';
import WorldMap from '../components/WorldMap';
import CatPicker from '../components/CatPicker';
import Rich from '../components/Rich';
import { SOLUTIONS, CATEGORIES, type CatId } from '../data/solutions';
import { score } from '../lib/score';
import { go, href } from '../lib/route';

const cities = new Set(SOLUTIONS.map((s) => s.city.en)).size;
const measured = SOLUTIONS.filter((s) => s.evidence !== 'reported').length;
const fit = SOLUTIONS.filter((s) => score(s).total >= 70).length;

export default function Home() {
  const [cats, setCats] = useState<CatId[]>([]);
  return (
    <main className="home">
      <div className="home-side">
        <section className="hero rise">
          <div className="kicker">השראה · שירות עירוני · אשדוד</div>
          <h1><Rich>{`**${SOLUTIONS.length}** פתרונות מ-**${cities}** ערים, נמדדים מול אשדוד.`}</Rich></h1>
          <p className="lines">
            <Rich>{'כל פתרון מגיע עם **מקור**, **תוצאה** ו**מדד התאמה** לעיר נמל של כ-**230** אלף תושבים.'}</Rich>
            <span className="howto"><strong>איך משתמשים:</strong> בוחרים בעיה, לוחצים על עיר במפה, ושומרים ללוח ההשראה.</span>
          </p>
        </section>
        <div className="tones rise" style={{ animationDelay: '80ms' }}>
          <div className="tone tone-problem"><h4>הבעיה</h4><p className="lines"><span>רעיונות מערים אחרות מגיעים כסיפור הצלחה.</span><span>אף אחד לא בודק אם הם מתאימים ל<b>אשדוד</b>.</span></p></div>
          <div className="tone tone-solution"><h4>הפתרון</h4><p className="lines"><span>מאגר אחד עם <b>מנגנון, תוצאה ומקור</b> לכל פתרון.</span><span>מדד שקוף ב-<b>6</b> פרמטרים מראה מה עובר ומה נעצר.</span></p></div>
          <div className="tone tone-insight"><h4>התובנה</h4><p><mark className="insight">עובר המנגנון, לא החפץ.</mark> רכבל של מדיין לא יגיע לעיר שטוחה, אבל קו מזין לרכבת כן.</p></div>
        </div>
        <nav className="rooms rise" style={{ animationDelay: '160ms' }} aria-label="מפת התוכן">
          <a className="press room" href={href('bank')}><span className="kicker">מאגר</span><bdi className="num">{SOLUTIONS.length}</bdi><b>פתרונות ב-{CATEGORIES.length} בעיות</b></a>
          <a className="press room" href={href('bank', { sort: 'fit' })}><span className="kicker">מתאים לאשדוד</span><bdi className="num">{fit}</bdi><b>ציון 70 ומעלה</b></a>
          <a className="press room" href={href('ask')}><span className="kicker">שאל את המאגר</span><bdi className="num">3</bdi><b>צעדים ראשונים לכל בעיה</b></a>
          <a className="press room" href={href('feature')}><span className="kicker">כתבה</span><bdi className="num">{measured}</bdi><b>תוצאות שנמדדו במחקר</b></a>
        </nav>
        <p className="inspo">בהשראת מפות הרוחות והזרמים של מתיו פונטיין מורי (Matthew Fontaine Maury), 1847: נתיבים שנאספו מאלפי מסעות, כדי שהבא יפליג בטוח יותר.</p>
      </div>
      <section className="panel home-map rise" style={{ animationDelay: '120ms' }} aria-label="מפת ההעברה">
        <div className="panel-h">
          <div className="kicker">מפת ההעברה</div>
          <b>כל נתיב הוא פתרון שבדרך לאשדוד.</b>
          <div className="howto">גלגלת לזום, גרירה להזזה, לחיצה על עיר פותחת את הפתרון.</div>
        </div>
        <WorldMap cats={cats} onPick={(id) => go('bank', { id, p: cats.join(',') || undefined })} />
        <div className="panel-b" style={{ borderTop: '1px solid var(--rule-soft)', paddingBlock: 6 }}>
          <CatPicker selected={cats} onChange={setCats} />
        </div>
      </section>
    </main>
  );
}
