// גשר ההעברה, בהשראת מפת הזרימה של מינאר (Charles Joseph Minard, 1869):
// רוחב הסרט הוא הפתרון. בדרך לאשדוד הוא מתפצל: מה שעובר (ירוק־רציף) ומה שנעצר במכס (אדום־מכס).
import { catOf, type Solution } from '../data/solutions';
import { score, barriers } from '../lib/score';
import { plain } from './Rich';

export default function Bridge({ s }: { s: Solution }) {
  const { total } = score(s);
  const bars = barriers(s);
  const W = 640, H = 190, full = 46;
  const pass = Math.max(6, (full * total) / 100), stop = full - pass;
  const xs = [W - 30, W - 200, W - 370, 30]; // מקור, מנגנון, תוצאה, אשדוד (מימין לשמאל)
  const y0 = 46;
  const color = catOf(s.cat).color;
  // החלק שעובר נשאר למעלה, החלק שנעצר יורד למטה אחרי "תוצאה"
  const passPath = `M${xs[0]},${y0} L${xs[2]},${y0} C${xs[2] - 80},${y0} ${xs[3] + 120},${y0} ${xs[3]},${y0} L${xs[3]},${y0 + pass} C${xs[3] + 120},${y0 + pass} ${xs[2] - 80},${y0 + pass} ${xs[2]},${y0 + pass} L${xs[0]},${y0 + pass} Z`;
  const yb = y0 + pass, yEnd = H - 40;
  const stopPath = stop > 0.5
    ? `M${xs[0]},${yb} L${xs[2]},${yb} C${xs[2] - 70},${yb} ${xs[2] - 90},${yEnd - stop} ${xs[2] - 170},${yEnd - stop} L${xs[2] - 170},${yEnd} C${xs[2] - 90 - stop},${yEnd} ${xs[2] - 70 - stop / 2},${yb + stop} ${xs[2]},${yb + stop} L${xs[0]},${yb + stop} Z`
    : '';
  const labels = ['מקור', 'מנגנון', 'תוצאה', 'מגיע לאשדוד'];
  const subs = [`${s.city.he} ${s.year}`, plain(s.name.he), s.evidence === 'measured' ? 'נמדדה' : s.evidence === 'modeled' ? 'הערכת מודל' : 'מדווחת', String(total)];
  return (
    <figure className="bridge" style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`גשר ההעברה: ${total} מתוך 100 עוברים לאשדוד`}>
        <defs>
          <linearGradient id="pass-g" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0" stopColor={color} stopOpacity=".55" />
            <stop offset=".55" stopColor={color} stopOpacity=".7" />
            <stop offset="1" stopColor="#1D9E75" />
          </linearGradient>
          <filter id="lift" x="-5%" y="-20%" width="110%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".18" /></filter>
        </defs>
        <path d={passPath} fill="url(#pass-g)" filter="url(#lift)" />
        {stopPath && <path d={stopPath} fill="#A32D2D" fillOpacity=".75" />}
        {xs.map((x, i) => (
          <g key={i}>
            <line x1={x} x2={x} y1={y0 - 12} y2={y0 + full + 4} stroke="#1A1A18" strokeWidth="1" strokeDasharray={i === 3 ? '' : '2 3'} />
            <text x={x} y={16} textAnchor={i === 3 ? 'start' : 'middle'} fontSize="11" fill="#8A8984" fontFamily="var(--mono)">{labels[i]}</text>
            <text x={x} y={31} textAnchor={i === 3 ? 'start' : 'middle'} fontSize="12.5" fontWeight="600" fill={i === 3 ? '#1F4E79' : '#1A1A18'}>{subs[i].length > 22 ? subs[i].slice(0, 21) + '…' : subs[i]}</text>
          </g>
        ))}
        {stopPath && (
          <text x={xs[2] - 170} y={yEnd + 16} textAnchor="start" fontSize="11.5" fill="#A32D2D" fontWeight="600">
            {`נעצר במכס: ${bars.slice(0, 2).map((b) => b.he).join(', ') || 'התאמה חלקית'}`}
          </text>
        )}
      </svg>
      <figcaption className="src">רוחב הסרט הוא הפתרון כולו. החלק הירוק מגיע לאשדוד, והאדום נעצר בפרמטרים החלשים. בהשראת מינאר, 1869.</figcaption>
    </figure>
  );
}
