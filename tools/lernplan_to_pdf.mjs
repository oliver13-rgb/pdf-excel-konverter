import { chromium } from 'playwright-core';
import path from 'node:path';

const [src, dst] = process.argv.slice(2);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });

const foot = `
<div style="width:100%;font-family:Liberation Sans,sans-serif;font-size:7pt;color:#5b6b7c;
            padding:0 15mm;display:flex;justify-content:space-between;align-items:center;">
  <span>Lernzettel Geschichte &middot; Europ&auml;ische Expansion</span>
  <span>Klausur: Freitag, 25.09.2026</span>
  <span>Seite <span class="pageNumber"></span>/<span class="totalPages"></span></span>
</div>`;

await page.pdf({
  path: dst,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: foot,
  margin: { top: '15mm', bottom: '15mm', left: '14mm', right: '14mm' },
});

await browser.close();
console.log('PDF geschrieben:', dst);
