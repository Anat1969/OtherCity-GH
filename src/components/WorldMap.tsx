// מפת העברה: כל עיר מקור מחוברת לאשדוד בנתיב של מעגל גדול. זום בגלגלת, הזזה בגרירה. הבורר מתחת הוא המקרא.
import { useEffect, useMemo, useRef, useState } from 'react';
import { geoEqualEarth, geoPath, geoGraticule10, geoDistance } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import land110 from 'world-atlas/land-110m.json';
import { ASHDOD, SOLUTIONS, catOf, type CatId, type Solution } from '../data/solutions';
import { score } from '../lib/score';

const topo = land110 as unknown as Topology<{ land: GeometryCollection }>;
const LAND = feature(topo, topo.objects.land);

interface City { key: string; he: string; en: string; lat: number; lon: number; items: Solution[] }

export default function WorldMap({ cats, activeId, onPick }: { cats: CatId[]; activeId?: string; onPick: (id: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 480 });
  const [t, setT] = useState({ k: 1, x: 0, y: 0 });
  const [hover, setHover] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: Math.max(200, el.clientWidth), h: Math.max(200, el.clientHeight) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const projection = useMemo(() => geoEqualEarth().rotate([-20, 0]).fitExtent([[8, 8], [size.w - 8, size.h - 8]], { type: 'Sphere' }), [size]);
  const path = useMemo(() => geoPath(projection), [projection]);

  const cities = useMemo(() => {
    const m = new Map<string, City>();
    for (const s of SOLUTIONS) {
      if (cats.length && !cats.includes(s.cat)) continue;
      const key = s.city.en;
      if (!m.has(key)) m.set(key, { key, he: s.city.he, en: s.city.en, lat: s.lat, lon: s.lon, items: [] });
      m.get(key)!.items.push(s);
    }
    return [...m.values()].sort((a, b) => b.items.length - a.items.length);
  }, [cats]);

  const ash = projection([ASHDOD.lon, ASHDOD.lat])!;

  // תוויות בלי חפיפה: מסננים לפי מרחק על המסך, החשוב קודם.
  const labels = useMemo(() => {
    const placed: [number, number][] = [[ash[0] * t.k + t.x, ash[1] * t.k + t.y]];
    const out = new Set<string>();
    for (const c of cities) {
      const p = projection([c.lon, c.lat])!;
      const sx = p[0] * t.k + t.x, sy = p[1] * t.k + t.y;
      if (placed.every(([x, y]) => Math.hypot(x - sx, y - sy) > 70)) { placed.push([sx, sy]); out.add(c.key); }
    }
    return out;
  }, [cities, projection, t, ash]);

  const onWheel = (e: React.WheelEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const k = Math.min(8, Math.max(1, t.k * (e.deltaY < 0 ? 1.2 : 1 / 1.2)));
    const f = k / t.k;
    setT({ k, x: k === 1 ? 0 : mx - (mx - t.x) * f, y: k === 1 ? 0 : my - (my - t.y) * f });
  };
  const zoom = (f: number) => {
    const k = Math.min(8, Math.max(1, t.k * f));
    const cx = size.w / 2, cy = size.h / 2, g = k / t.k;
    setT({ k, x: k === 1 ? 0 : cx - (cx - t.x) * g, y: k === 1 ? 0 : cy - (cy - t.y) * g });
  };

  const sw = 1 / t.k;
  return (
    <div className="map-wrap" ref={wrap} onWheel={onWheel}
      onPointerDown={(e) => { if ((e.target as Element).closest('.city-dot, .map-ctl')) return; drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y }; }}
      onPointerMove={(e) => { const d = drag.current; if (d) setT((o) => ({ ...o, x: d.tx + e.clientX - d.x, y: d.ty + e.clientY - d.y })); }}
      onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}
      aria-label="מפת העולם: ערי המקור והנתיבים לאשדוד">
      <div className="map-ctl no-print">
        <button className="press" onClick={() => zoom(1.4)} aria-label="התקרבות" title="התקרבות">+</button>
        <button className="press" onClick={() => zoom(1 / 1.4)} aria-label="התרחקות" title="התרחקות">−</button>
        <button className="press" onClick={() => setT({ k: 1, x: 0, y: 0 })} aria-label="איפוס המפה" title="איפוס המפה" style={{ fontSize: 12 }}>⟲</button>
      </div>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} role="img">
        <defs>
          {cities.map((c) => {
            const p = projection([c.lon, c.lat])!;
            return (
              <linearGradient key={c.key} id={`g-${c.key.replace(/\W/g, '')}`} gradientUnits="userSpaceOnUse" x1={p[0]} y1={p[1]} x2={ash[0]} y2={ash[1]}>
                <stop offset="0" stopColor={catOf(c.items[0].cat).color} stopOpacity=".25" />
                <stop offset="1" stopColor="#1F4E79" stopOpacity=".95" />
              </linearGradient>
            );
          })}
        </defs>
        <g transform={`translate(${t.x},${t.y}) scale(${t.k})`}>
          <path d={path({ type: 'Sphere' }) ?? ''} fill="#FBFBFA" stroke="#E5E4E0" strokeWidth={sw} />
          <path d={path(geoGraticule10()) ?? ''} fill="none" stroke="#EFEEEA" strokeWidth={0.6 * sw} />
          <path d={path(LAND) ?? ''} fill="#EDECE8" stroke="#C9C7C1" strokeWidth={0.6 * sw} />
          {cities.map((c, i) => {
            const active = c.items.some((s) => s.id === activeId) || hover === c.key;
            const d = path({ type: 'LineString', coordinates: [[c.lon, c.lat], [ASHDOD.lon, ASHDOD.lat]] }) ?? '';
            return <path key={c.key} d={d} pathLength={1} className="route draw" stroke={`url(#g-${c.key.replace(/\W/g, '')})`} strokeWidth={(active ? 2.6 : 1.2) * sw} style={{ animationDelay: `${i * 60}ms` }} />;
          })}
          {cities.map((c) => {
            const p = projection([c.lon, c.lat])!;
            const best = [...c.items].sort((a, b) => score(b).total - score(a).total)[0];
            const active = c.items.some((s) => s.id === activeId) || hover === c.key;
            const km = Math.round(geoDistance([c.lon, c.lat], [ASHDOD.lon, ASHDOD.lat]) * 6371);
            return (
              <g key={c.key}>
                <circle className="city-dot" cx={p[0]} cy={p[1]} r={(active ? 7 : 4 + c.items.length) * sw} fill={catOf(best.cat).color} stroke="#fff" strokeWidth={1.5 * sw}
                  tabIndex={0} role="button" aria-label={`${c.he}: ${c.items.length} פתרונות`}
                  onMouseEnter={() => setHover(c.key)} onMouseLeave={() => setHover(null)}
                  onClick={() => onPick(best.id)} onKeyDown={(e) => { if (e.key === 'Enter') onPick(best.id); }}>
                  <title>{`${c.he} ${c.en} · ${c.items.length} פתרונות · ${km.toLocaleString('he-IL')} ק״מ מאשדוד`}</title>
                </circle>
                {(labels.has(c.key) || active) && (
                  <text className="city-label" x={p[0] + 8 * sw} y={p[1] + 4 * sw} style={{ fontSize: 11 * sw, strokeWidth: 3 * sw }} textAnchor="start">{c.he}</text>
                )}
              </g>
            );
          })}
          <circle cx={ash[0]} cy={ash[1]} r={7 * sw} fill="#FFE45C" stroke="#1F4E79" strokeWidth={2.2 * sw} />
          <text className="city-label" x={ash[0] - 10 * sw} y={ash[1] - 8 * sw} textAnchor="end" style={{ fontSize: 13 * sw, fontWeight: 700, fill: '#1F4E79', strokeWidth: 3 * sw }}>אשדוד</text>
        </g>
      </svg>
    </div>
  );
}
