const puppeteer = require('puppeteer');
const path = require('path');

const BASE = 'file://' + path.resolve(__dirname, '..');

const pages = [
  { file: 'index.html',              name: 'dashboard' },
  { file: 'estoque.html',            name: 'estoque' },
  { file: 'cadastro.html',           name: 'cadastro' },
  { file: 'detalhes.html',           name: 'detalhes' },
  { file: 'editar.html',             name: 'editar' },
  { file: 'relatorios.html',         name: 'relatorios' },
  { file: 'configuracoes.html',      name: 'configuracoes' },
  { file: 'relatorio-auditoria.html',name: 'relatorio-auditoria' },
];

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  for (const p of pages) {
    const url = `${BASE}/${p.file}`;

    // Desktop lg (1280px)
    const pageDesktop = await browser.newPage();
    await pageDesktop.setViewport({ width: 1280, height: 900 });
    await pageDesktop.goto(url, { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
    await pageDesktop.screenshot({
      path: path.join(__dirname, `${p.name}-desktop.png`),
      fullPage: true,
    });
    await pageDesktop.close();
    console.log(`✓ ${p.name}-desktop.png`);

    // Mobile xs (375px) — skip for audit report
    if (p.name !== 'relatorio-auditoria') {
      const pageMobile = await browser.newPage();
      await pageMobile.setViewport({ width: 375, height: 812, isMobile: true });
      await pageMobile.goto(url, { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
      await pageMobile.screenshot({
        path: path.join(__dirname, `${p.name}-mobile.png`),
        fullPage: true,
      });
      await pageMobile.close();
      console.log(`✓ ${p.name}-mobile.png`);
    }
  }

  await browser.close();
  console.log('\nDone — screenshots/ folder ready.');
})();
