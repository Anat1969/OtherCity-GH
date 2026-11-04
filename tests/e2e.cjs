// בדיקת קצה לקצה מול vite preview. השרת מדומה: פונקציית ה-Edge, ai-menu.js (עותק מקומי) והגופנים.
// הרצה: npx vite preview --port 4173 & node tests/e2e.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.env.BASE || 'http://localhost:4173/';
const MENU = fs.readFileSync(path.join(__dirname, 'ai-menu.js'), 'utf8');
let fails = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };

const MOCK = {
  engine: 'gemini',
  matches: [{ id: 'boston-connect', why: { insight: '**סגירת מעגל** מול הפונה.', detail: 'תמונת **תיקון** חוזרת לתושב.' } }, { id: 'nyc-311', why: { insight: '**מספר אחד** לכל פנייה.', detail: 'מאגר ידע **משותף**.' } }],
  adapt: { insight: '**הוכחת סגירה** בכל פנייה.', detail: 'תמונה חוזרת לפונה דרך **106**.' },
  steps: ['**פיילוט** ברובע אחד', 'מדידת **פניות חוזרות**', 'הרחבה לכל **האגפים**'],
};

async function setup(ctx, fnMode = 'ok') {
  const calls = [];
  await ctx.route('**/ai-menu.js', (r) => r.fulfill({ body: MENU, contentType: 'application/javascript' }));
  await ctx.route(/fonts\.(googleapis|gstatic)/, (r) => r.abort());
  await ctx.route('**/functions/v1/othercity-inspire', async (r) => {
    calls.push(JSON.parse(r.request().postData() || '{}'));
    if (fnMode === 'ok') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK) });
    return r.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'אין מנוע' }) });
  });
  return calls;
}
const rows = (p, n) => p.waitForFunction((n) => document.querySelectorAll('.row').length === n, n, { timeout: 3000 }).then(() => true).catch(() => false);
const noHScroll = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

(async () => {
  const b = await chromium.launch();
  // מחשב
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const calls = await setup(ctx);
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE); await p.waitForSelector('.home');
    ok(await p.locator('ai-menu .logo').isVisible(), 'A&I logo button in the top bar');
    ok(!(await p.locator('header >> text=העתקת קישור').first().isVisible().catch(() => false)), 'no loose development buttons in the bar');
    ok((await p.locator('.city-dot').count()) >= 15, 'map shows source cities');
    ok(await p.locator('h1').first().textContent().then((t) => /28/.test(t)), 'home headline with the solution count');
    const r1 = await p.evaluate(() => document.documentElement.scrollHeight / innerHeight);
    ok(r1 <= 1.01, `home fits the screen (ratio ${r1.toFixed(2)})`);
    // בורר במפה
    await p.locator('.home-map .pick[data-cat="climate"]').click();
    const climateDots = await p.locator('.city-dot').count();
    ok(climateDots > 0 && climateDots < 10, `category filter narrows the map (${climateDots})`);
    await p.locator('.home-map .pick.all').click();
    // לחיצה על עיר פותחת את המאגר
    await p.locator('.city-dot').first().click();
    await p.waitForSelector('.bank');
    ok(/#\/bank\?id=/.test(p.url()), 'clicking a city opens its solution');
    // מאגר: מעבר בין פריטים
    const t1 = await p.locator('.detail h1').textContent();
    await p.locator('button[aria-label="הבא"]').click();
    await p.waitForFunction((t) => document.querySelector('.detail h1')?.textContent !== t, t1);
    ok(true, 'next button changes the solution');
    ok(/^\d+$/.test((await p.locator('[data-testid="score"]').textContent()).trim()), 'fit score is shown');
    await p.locator('.param details summary').first().click();
    ok(await p.locator('.param details[open] >> text=מה נמדד').isVisible(), 'every parameter explains how it is computed');
    ok((await p.locator('.bridge svg').count()) === 1, 'transfer bridge drawn');
    ok(await p.locator('.detail .src a').isVisible(), 'source link shown');
    // בורר במאגר: לחיצה מחליפה, "+" מוסיף
    await p.locator('.bank-list .pick[data-cat="waste"]').click();
    ok(await rows(p, 3), 'picker selects one problem');
    await p.locator('.bank-list button[aria-label="הוספת חום ומים"]').click();
    ok(await rows(p, 8), '"+" adds a second problem');
    await p.locator('.bank-list .pick.all').click();
    ok(await rows(p, 28), '"הכול" resets');
    // חיפוש
    await p.locator('.search input').fill('קומפוסט');
    await p.waitForTimeout(200);
    ok((await p.locator('.row:not(.dim)').count()) >= 1 && (await p.locator('.row.dim').count()) > 20, 'search highlights matches and dims the rest');
    await p.locator('.search .x').click();
    // לוח השראה ונשמר אחרי רענון
    await p.goto(BASE + '#/bank?id=tallinn-free'); await p.waitForSelector('.detail');
    await p.locator('text=שמירה ללוח ההשראה').click();
    await p.goto(BASE + '#/board'); await p.waitForSelector('.board');
    await p.locator('.board textarea').fill('לבדוק עם אגף התחבורה');
    await p.waitForTimeout(700);
    await p.reload(); await p.waitForSelector('.board-grid article');
    ok((await p.locator('.board textarea').inputValue()) === 'לבדוק עם אגף התחבורה', 'board and note persist after reload');
    // שאל: המנוע המדומה
    await p.goto(BASE + '#/ask'); await p.waitForSelector('.ask');
    await p.locator('.examples .pick').first().click();
    await p.waitForSelector('.match');
    ok(calls.length === 1 && calls[0].catalog.length === 28 && calls[0].problem.length > 5, 'ask sends the problem and the catalog');
    ok((await p.locator('.match').count()) === 2 && (await p.locator('ol li').count()) === 3, 'ask shows matches and 3 steps');
    ok(await p.locator('mark.insight, strong').first().isVisible(), 'AI text rendered with highlights');
    await p.goto(BASE + '#/feature'); await p.waitForSelector('.article');
    ok(await p.locator('.pull q').isVisible() && await p.locator('.haiku').isVisible(), 'feature has quote and haiku');
    // התקנה
    const cdp = await ctx.newCDPSession(p);
    const inst = await cdp.send('Page.getInstallabilityErrors');
    ok(inst.installabilityErrors.length === 0 || inst.installabilityErrors.every((e) => e.errorId === 'not-offline-capable'), `installability: ${JSON.stringify(inst.installabilityErrors.map((e) => e.errorId))}`);
    ok(errs.length === 0, `no JS errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  // גיבוי: המנוע לא זמין
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
    await setup(ctx, 'fail');
    const p = await ctx.newPage();
    await p.goto(BASE + '#/ask'); await p.waitForSelector('.ask');
    await p.locator('#problem').fill('פחים מלאים ומחזור חלקי ברחובות');
    await p.locator('text=מצא פתרונות').click();
    await p.waitForSelector('.engine');
    ok(/מקומית/.test(await p.locator('.engine').textContent()) && (await p.locator('.match').count()) > 0, 'fallback: local matching when the engine is down, and it says so');
    await ctx.close();
  }
  // נייד והפחתת תנועה
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
    await setup(ctx);
    const p = await ctx.newPage();
    for (const h of ['', '#/bank?id=nyc-311', '#/ask', '#/board', '#/feature']) {
      await p.goto(BASE + h); await p.waitForTimeout(500);
      ok(await noHScroll(p), `mobile ${h || 'home'}: no horizontal scroll`);
    }
    await p.goto(BASE + '#/bank?id=nyc-311'); await p.waitForSelector('.mtabs');
    ok(await p.evaluate(() => document.documentElement.scrollHeight / innerHeight <= 1.01), 'mobile bank fits the screen');
    await p.locator('.mtabs button', { hasText: 'רשימה' }).click();
    ok(await p.locator('.bank-list').isVisible() && !(await p.locator('.detail').isVisible()), 'mobile tab shows the list only');
    await p.locator('.row').nth(2).click();
    ok(await p.locator('.detail').isVisible(), 'choosing a row opens the solution tab');
    await p.locator('.mtabs button', { hasText: 'מדד' }).click();
    ok(await p.locator('[data-testid="score"]').isVisible(), 'mobile score tab');
    await p.goto(BASE); await p.waitForTimeout(400);
    ok(await p.evaluate(() => document.documentElement.scrollHeight / innerHeight <= 1.5), 'mobile home within 1.5 screens');
    const anim = await p.evaluate(() => getComputedStyle(document.querySelector('.article') || document.body).animationName);
    ok(anim === 'none', 'reduced motion disables animation');
    await ctx.close();
  }
  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})();
