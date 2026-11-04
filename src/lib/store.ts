// לוח ההשראה: נשמר אוטומטית ב-localStorage, עם חיווי "נשמר".
import { useEffect, useState } from 'react';

export interface BoardItem { id: string; note: string; addedAt: number }
const KEY = 'othercity.board.v1';

const read = (): BoardItem[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
};

let state: BoardItem[] = read();
let savedAt: number | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function write(next: BoardItem[]) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); savedAt = Date.now(); } catch { savedAt = null; }
  emit();
}

export const board = {
  has: (id: string) => state.some((b) => b.id === id),
  toggle: (id: string) => write(board.has(id) ? state.filter((b) => b.id !== id) : [...state, { id, note: '', addedAt: Date.now() }]),
  note: (id: string, note: string) => write(state.map((b) => (b.id === id ? { ...b, note } : b))),
  clear: () => write([]),
};

export function useBoard() {
  const [, set] = useState(0);
  useEffect(() => {
    const f = () => set((n) => n + 1);
    subs.add(f);
    return () => { subs.delete(f); };
  }, []);
  return { items: state, savedAt };
}
