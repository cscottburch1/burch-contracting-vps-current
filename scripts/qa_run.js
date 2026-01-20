const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const axeCore = require('axe-core');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const pages = ['/', '/subcontractors/join', '/admin/subcontractors'];
const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 },
];

async function run() {
  const outDir = path.resolve(__dirname, '..', 'tmp', 'qa_reports');
  const shotsDir = path.resolve(__dirname, '..', 'tmp', 'screenshots');
  ensureDir(outDir);
  ensureDir(shotsDir);

  const browser = await chromium.launch();
  const context = await browser.newContext();

  const base = process.env.BASE_URL || 'http://localhost:3000';

  const summary = [];

  for (const p of pages) {
    for (const vp of viewports) {
      const page = await context.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const url = new URL(p, base).toString();
      const label = `${p.replace(/\//g, '_') || 'root'}_${vp.name}`.replace(/^_/, '');
      console.log('Visiting', url, 'as', vp.name);
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(400); // allow any client scripts to settle

        // screenshot
        const shotPath = path.join(shotsDir, `${label}.png`);
        await page.screenshot({ path: shotPath, fullPage: true });

        // inject axe
        await page.addScriptTag({ content: axeCore.source });
        const results = await page.evaluate(async () => {
          return await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } });
        });

        const perf = await page.evaluate(() => {
          try { return window.performance ? window.performance.toJSON() : null; } catch (e) { return null; }
        });

        const out = { page: p, viewport: vp.name, url, status: resp ? resp.status() : null, axe: results, perf };
        const outPath = path.join(outDir, `${label}.json`);
        fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
        summary.push({ label, url, status: out.status, axeViolations: results.violations.length, shot: shotPath });
        console.log('Saved', outPath, 'violations:', results.violations.length);
      } catch (err) {
        console.error('Error visiting', url, err.message);
        summary.push({ label, url, error: err.message });
      } finally {
        try { await page.close(); } catch (e) {}
      }
    }
  }

  await browser.close();

  const summaryPath = path.resolve(__dirname, '..', 'tmp', 'qa_reports', 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log('QA run complete. Summary at', summaryPath);
}

if (require.main === module) {
  run().catch(err => { console.error(err); process.exit(1); });
}

module.exports = { run };
