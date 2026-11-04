// מדד ההתאמה לאשדוד: ציון, ולכל פרמטר מה נמדד, איך חושב ומה המגבלה. מה שלא נמדד, נאמר.
import type { Solution } from '../data/solutions';
import { score, tier, TIER_HE, NOT_MEASURED, EVIDENCE_HINT } from '../lib/score';

export default function ScorePanel({ s }: { s: Solution }) {
  const { total, params } = score(s);
  const tr = tier(total);
  return (
    <section className="panel score-col" aria-label="מדד ההתאמה לאשדוד">
      <div className="panel-h">
        <div className="kicker">מדד ההתאמה לאשדוד</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
          <span className={`bignum tier-${tr}`} data-testid="score">{total}</span>
          <b className={`tier-${tr}`}>{TIER_HE[tr]}</b>
        </div>
        <div className="howto" style={{ marginTop: 4 }}>מחושב בקוד, בלי מודל. התקן: <strong>העברת מדיניות</strong> (Dolowitz & Marsh, 2000), וראיות לפי <strong>סולם מרילנד</strong> (1997).</div>
      </div>
      <div className="panel-b scroll-in">
        {params.map((p) => {
          const pct = Math.round(p.value * 100);
          const col = p.value >= 0.7 ? 'var(--quay)' : p.value >= 0.5 ? 'var(--ochre)' : 'var(--customs)';
          return (
            <div className="param" key={p.key}>
              <div className="top"><b>{p.he}</b><span className="num" style={{ color: col }}>{pct}</span></div>
              <div className="gauge" style={{ marginTop: 4 }}><i style={{ width: `${pct}%`, background: col }} /></div>
              <div className="why"><span style={{ color: 'var(--ink-soft)' }}>{p.detail}</span> · משקל <bdi className="num">{p.weight}</bdi></div>
              <details>
                <summary>איך זה חושב</summary>
                <div className="why lines">
                  <span><b>מה נמדד:</b> {p.measures}</span>
                  <span><b>איך:</b> {p.how}</span>
                  <span><b>מגבלה:</b> {p.limit}</span>
                  {p.key === 'evidence' && <span><b>הרמה כאן:</b> {EVIDENCE_HINT[s.evidence]}</span>}
                </div>
              </details>
            </div>
          );
        })}
        <div className="param" style={{ borderBottom: 0 }}>
          <div className="top"><b>לא נמדד</b><span className="kicker">לאיש המקצוע</span></div>
          <div className="why">{NOT_MEASURED.join(' · ')}</div>
        </div>
      </div>
    </section>
  );
}
