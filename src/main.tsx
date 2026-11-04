import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './base.css';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

// התקנה מ-Chrome: service worker רק כשהבסיס הוא השורש (לא ב-raw.githack).
if ('serviceWorker' in navigator && import.meta.env.PROD && new URL(document.baseURI).pathname === '/') {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
