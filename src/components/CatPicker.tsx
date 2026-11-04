// בורר בעיות: כל לחיצה מחליפה, "+" מוסיף, לחיצה על הבחירה היחידה מחזירה ל"הכול". הבורר הוא גם המקרא.
import { CATEGORIES, SOLUTIONS, type CatId } from '../data/solutions';

interface Props { selected: CatId[]; onChange: (next: CatId[]) => void; vertical?: boolean; counts?: boolean }

export default function CatPicker({ selected, onChange, vertical, counts = true }: Props) {
  const toggle = (id: CatId) => {
    if (selected.length === 1 && selected[0] === id) onChange([]);
    else onChange([id]);
  };
  const add = (id: CatId) => onChange(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);
  return (
    <div className={`picker${vertical ? ' vertical' : ''}`} role="group" aria-label="בורר בעיות">
      {CATEGORIES.map((c) => {
        const on = selected.includes(c.id);
        const n = SOLUTIONS.filter((s) => s.cat === c.id).length;
        return (
          <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <button className="pick" aria-pressed={on} onClick={() => toggle(c.id)} title={c.problem} data-cat={c.id}>
              <i className="sw" style={{ background: c.color }} />
              {c.he}
              {counts && <span className="n">{n}</span>}
            </button>
            {selected.length > 0 && (
              <button className="pick" aria-label={on ? `הסרת ${c.he}` : `הוספת ${c.he}`} title={on ? 'הסרה מהבחירה' : 'הוספה לבחירה'} onClick={() => add(c.id)} style={{ padding: '6px 4px', fontFamily: 'var(--mono)' }}>
                {on ? '−' : '+'}
              </button>
            )}
          </span>
        );
      })}
      <button className="pick all" aria-pressed={selected.length === 0} onClick={() => onChange([])}>הכול <span className="n">{SOLUTIONS.length}</span></button>
    </div>
  );
}
