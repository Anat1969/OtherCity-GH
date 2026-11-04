// אייקון האפליקציה: שובר גלים של נמל, ונתיב שנמתח אליו מרחוק. בלי טקסט.
export default function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <rect width="64" height="64" fill="#1F4E79" />
      <path d="M8 22 C 22 6, 44 8, 50 36" fill="none" stroke="#fff" strokeWidth="2.4" strokeDasharray="3 3.5" strokeLinecap="round" />
      <circle cx="8" cy="22" r="3.2" fill="#fff" />
      <path d="M30 54 L30 44 Q30 36 38 36 L58 36" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="square" />
      <circle cx="50" cy="44" r="5" fill="#FFE45C" />
    </svg>
  );
}
