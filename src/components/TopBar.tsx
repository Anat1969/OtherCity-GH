// סרגל עליון קבוע: שם ואייקון לבית, ניווט תוכן, חיפוש קבוע, וכפתור לוגו A&I יחיד. כל השאר בתוך הלוגו.
import { useEffect, useRef } from 'react';
import Mark from './Mark';
import { href, type Page } from '../lib/route';
import { board } from '../lib/store';

export const DEV_SESSION_URL = 'https://claude.ai/code/session_01UBnSCMJ2p6dxSjRYseqedA';

const TABS: { page: Page; he: string }[] = [
  { page: 'bank', he: 'מאגר' },
  { page: 'ask', he: 'שאל את המאגר' },
  { page: 'board', he: 'לוח השראה' },
  { page: 'feature', he: 'כתבה' },
];

interface MenuEl extends HTMLElement { items: { label: string; onSelect: () => unknown }[]; status: string }

export default function TopBar({ page, q, onQ, boardCount }: { page: Page; q: string; onQ: (v: string) => void; boardCount: number }) {
  const menu = useRef<MenuEl>(null);
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    m.items = [
      { label: 'הדפסת לוח ההשראה', onSelect: () => { window.location.hash = '#/board'; setTimeout(() => window.print(), 300); } },
      { label: 'ניקוי לוח ההשראה', onSelect: () => { if (confirm('לנקות את לוח ההשראה?')) board.clear(); } },
    ];
    m.status = `${boardCount} בלוח ההשראה`;
  }, [boardCount]);

  return (
    <header className="topbar">
      <div className="topbar-in">
        <a className="brand" href={href('home')} aria-label="פתרונות של ערים אחרות, דף הבית">
          <Mark /><span>פתרונות של ערים אחרות</span>
        </a>
        <nav className="tabs" aria-label="ניווט">
          {TABS.map((t) => (
            <a key={t.page} className="tab" href={href(t.page)} aria-current={page === t.page ? 'page' : undefined}>
              {t.he}{t.page === 'board' && boardCount > 0 && <bdi className="num" style={{ fontSize: 11, marginInlineStart: 4 }}>{boardCount}</bdi>}
            </a>
          ))}
        </nav>
        <div className="search" role="search">
          <input className="field" type="text" placeholder="חיפוש: עיר, בעיה, מנגנון" aria-label="חיפוש במאגר" value={q}
            onChange={(e) => onQ(e.target.value)} onFocus={(e) => e.target.select()}
            onKeyDown={(e) => { if (e.key === 'Escape') onQ(''); }} />
          <button className="x" aria-label="איפוס החיפוש" onClick={() => onQ('')}>×</button>
        </div>
        <ai-menu ref={menu} chat={DEV_SESSION_URL} />
      </div>
    </header>
  );
}
