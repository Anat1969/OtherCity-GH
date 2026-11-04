import { useEffect, useMemo, useRef } from 'react';
import CatPicker from '../components/CatPicker';
import Rich from '../components/Rich';
import Bridge from '../components/Bridge';
import ScorePanel from '../components/ScorePanel';
import { SOLUTIONS, APPS, ASHDOD, catOf, type CatId } from '../data/solutions';
import { score, tier, EVIDENCE_HE, COST_HE } from '../lib/score';
import { matches } from '../lib/search';
import { go } from '../lib/route';
import { board, useBoard } from '../lib/store';
import { geoDistance } from 'd3-geo';

export default function Bank({ params, q }: { params: Record<string, string>; q: string }) {
  const cats = (params.p ? params.p.split(',') : []) as CatId[];
  const { items } = useBoard();
  const list = useMemo(() => SOLUTIONS
    .filter((s) => !cats.length || cats.includes(s.cat))
    .map((s) => ({ s, sc: score(s).total, hit: matches(s, q) }))
    .sort((a, b) => Number(b.hit) - Number(a.hit) || b.sc - a.sc), [params.p, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const hits = list.filter((x) => x.hit).length;
  const current = list.find((x) => x.s.id === params.id) ?? list.find((x) => x.hit) ?? list[0];
  const s = current?.s;
  const idx = s ? list.findIndex((x) => x.s.id === s.id) : -1;
  const set = (patch: Record<string, string | undefined>) => go('bank', { p: params.p, q: q || undefined, id: params.id, ...patch });
  const detailRef = useRef<HTMLElement>(null);
  useEffect(() => { detailRef.current?.scrollTo({ top: 0 }); }, [s?.id]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea')) return;
      if (e.key === 'ArrowDown' && idx < list.length - 1) set({ id: list[idx + 1].s.id });
      if (e.key === 'ArrowUp' && idx > 0) set({ id: list[idx - 1].s.id });
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  });

  if (!s) return <main className="empty">אין פתרונות בבחירה הזו. לחצו "הכול" כדי לאפס.</main>;
  const cat = catOf(s.cat);
  const km = Math.round(geoDistance([s.lon, s.lat], [ASHDOD.lon, ASHDOD.lat]) * 6371);
  const saved = items.some((b) => b.id === s.id);
  const app = s.app ? APPS[s.app] : null;

  return (
    <main className="bank">
      <section className="panel bank-list" aria-label="רשימת הפתרונות">
        <div className="panel-h">
          <div className="kicker">בחרו בעיה של אשדוד</div>
          <CatPicker selected={cats} onChange={(next) => set({ p: next.join(',') || undefined, id: undefined })} vertical />
          {q && <div className="howto" style={{ marginTop: 6 }}><bdi className="num">{hits}</bdi> תוצאות ל"{q}". השאר מעומעמים.</div>}
        </div>
        <div className="scroll-in" style={{ flex: 1 }} role="list">
          {list.map(({ s: x, sc, hit }) => (
            <button key={x.id} role="listitem" className={`row${hit ? '' : ' dim'}`} aria-current={x.id === s.id} onClick={() => set({ id: x.id })}>
              <i className="bar" style={{ background: catOf(x.cat).color }} />
              <span style={{ minWidth: 0 }}>
                <span className="t" style={{ display: 'block' }}>{x.name.he}</span>
                <span className="s" style={{ display: 'block' }}>{x.city.he} · {x.year}</span>
              </span>
              <span className={`sc tier-${tier(sc)}`}>{sc}</span>
            </button>
          ))}
        </div>
      </section>

      <article className="panel detail" ref={detailRef} aria-label="הפתרון שנבחר">
        <div className="panel-b">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'start' }}>
            <div className="kicker" style={{ color: cat.color }}>{cat.he} · {s.country.he}</div>
            <div className="pager no-print">
              <button className="press" aria-label="הקודם" title="הקודם" disabled={idx <= 0} onClick={() => set({ id: list[idx - 1].s.id })}>→</button>
              <span className="pos"><bdi>{idx + 1}/{list.length}</bdi></span>
              <button className="press" aria-label="הבא" title="הבא" disabled={idx >= list.length - 1} onClick={() => set({ id: list[idx + 1].s.id })}>←</button>
            </div>
          </div>
          <h1>{s.name.he}<span className="en">{s.name.en}</span></h1>
          <div><b style={{ fontSize: 17 }}>{s.city.he}</b><span className="en">{s.city.en}</span></div>
          <Rich as="p" className="insight">{s.insight}</Rich>

          <div className="facts">
            <div><span className="kicker">שנה</span><b><bdi className="num">{s.year}</bdi></b></div>
            <div><span className="kicker">ראיות</span><b>{EVIDENCE_HE[s.evidence]}</b></div>
            <div><span className="kicker">עלות</span><b>{COST_HE[s.cost]}</b></div>
            <div><span className="kicker">מרחק מאשדוד</span><b><bdi className="num">{km.toLocaleString('he-IL')}</bdi> ק״מ</b></div>
          </div>

          <div className="trio">
            <div className="tone tone-problem"><h4>הבעיה באשדוד</h4><p>{cat.problem}</p></div>
            <div className="tone tone-solution"><h4>המנגנון</h4><Rich as="p">{s.mechanism}</Rich></div>
            <div className="tone tone-neutral"><h4>התוצאה</h4><Rich as="p">{s.outcome}</Rich></div>
          </div>

          <div className="tone tone-insight" style={{ margin: '12px 0' }}>
            <h4>איך זה נראה באשדוד <span className="kicker">הצעה, לא עובדה</span></h4>
            <Rich as="p">{s.ashdod}</Rich>
          </div>

          <Bridge s={s} />

          <p className="src" style={{ marginTop: 10 }}>מקור: <a href={s.source.url} target="_blank" rel="noreferrer">{s.source.label}</a></p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }} className="no-print">
            <button className={`press btn ${saved ? '' : 'btn-primary'}`} aria-pressed={saved} onClick={() => board.toggle(s.id)}>
              {saved ? 'בלוח ההשראה. הסרה' : 'שמירה ללוח ההשראה'}
            </button>
            <span className="howto">החיצים במקלדת עוברים בין פתרונות.</span>
          </div>
          {app && (
            <a className="press related" href={app.url} target="_blank" rel="noreferrer">
              <span className="kicker">אפליקציה קשורה</span>
              <span><b>{app.he}</b>. {app.why}</span>
            </a>
          )}
        </div>
      </article>

      <ScorePanel s={s} />
    </main>
  );
}
