import { useEffect, useState } from 'react';
import Rich from '../components/Rich';
import { byId, catOf } from '../data/solutions';
import { score, tier } from '../lib/score';
import { board, useBoard } from '../lib/store';
import { href } from '../lib/route';

function Note({ id, value }: { id: string; value: string }) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => { if (v !== value) board.note(id, v); }, 400); return () => clearTimeout(t); }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  return <textarea className="field" aria-label="הערה" placeholder="מה לוקחים מכאן, ומי באגף צריך לראות" value={v} onChange={(e) => setV(e.target.value)} style={{ width: '100%', minHeight: 64 }} />;
}

export default function Board() {
  const { items, savedAt } = useBoard();
  const list = items.map((b) => ({ b, s: byId(b.id) })).filter((x) => x.s);
  return (
    <main className="board">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <div className="kicker">לוח השראה</div>
          <h1 style={{ margin: '2px 0', fontSize: 'clamp(22px,2vw,30px)', fontWeight: 600 }}>
            <Rich>{list.length ? `**${list.length}** פתרונות בדרך לשולחן הדיונים.` : 'הלוח ריק, וזו נקודת פתיחה טובה.'}</Rich>
          </h1>
          <div className="howto"><strong>איך משתמשים:</strong> שומרים פתרונות מהמאגר, כותבים הערה, ומדפיסים כ-A4 לישיבה.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="no-print">
          {savedAt && <span className="saved">נשמר {new Date(savedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>}
          <button className="press btn" disabled={!list.length} onClick={() => window.print()}>הדפסה כ-A4</button>
        </div>
      </div>
      {!list.length && (
        <div className="empty panel">
          כל פתרון במאגר כולל כפתור "שמירה ללוח ההשראה".<br />
          הלוח נשמר בדפדפן הזה, גם אחרי רענון.<br />
          <a className="press btn btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }} href={href('bank')}>למאגר</a>
        </div>
      )}
      <div className="board-grid">
        {list.map(({ b, s }) => {
          const sc = score(s!).total;
          return (
            <article className="panel" key={b.id}>
              <div className="panel-b" style={{ display: 'grid', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span className="kicker" style={{ color: catOf(s!.cat).color }}>{catOf(s!.cat).he}</span>
                  <span className={`num tier-${tier(sc)}`}>{sc}</span>
                </div>
                <a href={href('bank', { id: s!.id })} style={{ textDecoration: 'none' }}><b style={{ fontSize: 16 }}>{s!.name.he}</b> · {s!.city.he}<span className="en">{s!.city.en}</span></a>
                <Rich as="div">{s!.insight}</Rich>
                <div className="tone tone-insight"><Rich as="p">{s!.ashdod}</Rich></div>
                <Note id={b.id} value={b.note} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="src"><a href={s!.source.url} target="_blank" rel="noreferrer">{s!.source.label}</a></span>
                  <button className="pick no-print" aria-label={`הסרת ${s!.name.he} מהלוח`} title="הסרה מהלוח" onClick={() => board.toggle(b.id)}>×</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
