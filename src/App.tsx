import { useEffect, useState } from 'react';
import TopBar from './components/TopBar';
import { useRoute, go } from './lib/route';
import { useBoard } from './lib/store';
import Home from './pages/Home';
import Bank from './pages/Bank';
import Ask from './pages/Ask';
import Board from './pages/Board';
import Feature from './pages/Feature';

export default function App() {
  const { page, params } = useRoute();
  const { items } = useBoard();
  const [q, setQ] = useState(params.q ?? '');
  useEffect(() => { if ((params.q ?? '') !== q && page === 'bank') setQ(params.q ?? ''); }, [params.q]); // eslint-disable-line react-hooks/exhaustive-deps

  // חיפוש מהסרגל: המילה נשמרת בכתובת, ותוצאות מוצגות במאגר.
  const onQ = (v: string) => {
    setQ(v);
    go('bank', { ...(page === 'bank' ? params : {}), q: v || undefined });
  };

  useEffect(() => {
    const titles: Record<string, string> = { home: 'פתרונות של ערים אחרות', bank: 'מאגר הפתרונות', ask: 'שאל את המאגר', board: 'לוח השראה', feature: 'כתבה: מה עובר בין ערים' };
    document.title = page === 'home' ? titles.home : `${titles[page]} · פתרונות של ערים אחרות`;
  }, [page]);

  return (
    <div className={`app-shell${page === 'bank' ? ' shell-fixed' : ''}`}>
      <TopBar page={page} q={q} onQ={onQ} boardCount={items.length} />
      {page === 'home' && <Home />}
      {page === 'bank' && <Bank params={params} q={q} />}
      {page === 'ask' && <Ask />}
      {page === 'board' && <Board />}
      {page === 'feature' && <Feature />}
    </div>
  );
}
