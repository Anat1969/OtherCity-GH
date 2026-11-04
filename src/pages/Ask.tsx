import { useState } from 'react';
import Rich from '../components/Rich';
import { ask, type AskResult } from '../lib/ai';
import { localRank } from '../lib/search';
import { byId, catOf, SOLUTIONS } from '../data/solutions';
import { score, tier } from '../lib/score';
import { href } from '../lib/route';
import { board, useBoard } from '../lib/store';

const EXAMPLES = [
  'פניות ל-106 חוזרות כי התושב לא יודע אם טופלו',
  'חום קיצוני בחצרות בתי הספר בקיץ',
  'תושבים עולים לא מבינים הודעות עירייה',
  'פחים מלאים ברחובות המסחריים',
  'הצפות בשכונות נמוכות בגשם חזק',
];

const KEY = 'othercity.ask.v1';

export default function Ask() {
  const [text, setText] = useState(() => { try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; } });
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<AskResult | null>(null);
  const [err, setErr] = useState('');
  useBoard();

  const save = (v: string) => { setText(v); try { localStorage.setItem(KEY, v); } catch { /* מצב פרטי */ } };

  async function run(problem = text) {
    if (problem.trim().length < 4) { setErr('תארו את הבעיה במשפט אחד לפחות.'); return; }
    setBusy(true); setErr(''); setRes(null);
    try {
      setRes(await ask(problem));
    } catch (e) {
      // גיבוי: התאמה מקומית בקוד, בלי מודל. אומרים זאת.
      const local = localRank(problem);
      setErr(`המנוע לא זמין כרגע (${(e as Error).message}). מוצגת התאמה מקומית לפי מילים, בלי ניסוח.`);
      setRes({
        engine: 'local',
        matches: local.map((s) => ({ id: s.id, why: { insight: s.insight, detail: s.mechanism } })),
        adapt: local[0] ? { insight: 'כיוון ראשון מהמאגר.', detail: local[0].ashdod } : { insight: 'לא נמצאה התאמה.', detail: 'נסו לתאר את הבעיה במילים אחרות, או בחרו בעיה במאגר.' },
        steps: [],
      });
    } finally { setBusy(false); }
  }

  return (
    <main className="ask">
      <section className="panel" aria-label="תיאור הבעיה">
        <div className="panel-h">
          <div className="kicker">שאל את המאגר</div>
          <b>מתארים בעיה במילים, ומקבלים פתרונות מתועדים.</b>
          <div className="howto"><strong>איך משתמשים:</strong> כותבים משפט אחד, או לוחצים על דוגמה. הטקסט נשמר אוטומטית.</div>
        </div>
        <div className="panel-b" style={{ display: 'grid', gap: 10 }}>
          <label className="kicker" htmlFor="problem">הבעיה באשדוד</label>
          <textarea id="problem" className="field" value={text} onChange={(e) => save(e.target.value)} placeholder="לדוגמה: תושבים מתלוננים שוב ושוב על אותו מפגע" maxLength={600} />
          <button className="press btn btn-primary" disabled={busy} onClick={() => run()}>{busy ? 'מחפש במאגר...' : 'מצא פתרונות'}</button>
          <div className="kicker">דוגמאות</div>
          <div className="examples">
            {EXAMPLES.map((ex) => <button key={ex} className="pick" onClick={() => { save(ex); run(ex); }}>{ex}</button>)}
          </div>
          <p className="howto lines" style={{ marginTop: 8 }}>
            <span><strong>מה קורה כשלוחצים:</strong> Gemini החינמי בוחר רק מתוך המאגר ומנסח לפי תקן הזיקוק.</span>
            <span>Claude משמש גיבוי. בלי חיבור, התאמה מקומית בקוד.</span>
            <span>לא שולחים מידע אישי: המסלול החינמי עלול לשמש את Google.</span>
          </p>
        </div>
      </section>

      <section className="panel res" aria-live="polite" aria-label="תוצאות">
        {!res && !busy && !err && <div className="empty">כאן יופיעו 2 עד 4 פתרונות מתועדים, הצעה לאשדוד ו-3 צעדים ראשונים.<br />כל פתרון מקושר לכרטיס המלא במאגר.</div>}
        {busy && <div className="empty">המנוע קורא <bdi className="num">{SOLUTIONS.length}</bdi> פתרונות ומדרג אותם מול הבעיה...</div>}
        {err && <div className="tone tone-problem" style={{ margin: 12 }}><p>{err}</p></div>}
        {res && (
          <div className="panel-b">
            <div className="engine">מנוע: {res.engine === 'gemini' ? 'Gemini (חינמי)' : res.engine === 'claude' ? 'Claude (גיבוי)' : 'התאמה מקומית בקוד'}</div>
            <div className="tone tone-insight" style={{ margin: '8px 0 12px' }}>
              <h4><Rich>{res.adapt.insight}</Rich> <span className="kicker">הצעה לאשדוד</span></h4>
              <Rich as="p">{res.adapt.detail}</Rich>
            </div>
            {res.steps.length > 0 && (
              <ol style={{ margin: '0 0 12px', paddingInlineStart: 22, lineHeight: 1.9 }}>
                {res.steps.slice(0, 3).map((st, i) => <li key={i}><Rich>{st}</Rich></li>)}
              </ol>
            )}
            {res.matches.map(({ id, why }) => {
              const s = byId(id)!;
              const sc = score(s).total;
              return (
                <div className="match" key={id}>
                  <i style={{ background: catOf(s.cat).color }} />
                  <div className="lines">
                    <a href={href('bank', { id })} style={{ textDecoration: 'none' }}><b>{s.name.he}</b> · {s.city.he}<span className="en">{s.city.en}</span></a>
                    <Rich as="span" className="">{why.insight}</Rich>
                    <Rich as="span" className="howto">{why.detail}</Rich>
                    <button className="pick" style={{ justifySelf: 'start', paddingInline: 0 }} aria-pressed={board.has(id)} onClick={() => board.toggle(id)}>{board.has(id) ? 'בלוח ההשראה' : 'שמירה ללוח'}</button>
                  </div>
                  <span className={`sc num tier-${tier(sc)}`} title="מדד ההתאמה לאשדוד">{sc}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
