// javascript
// scripts/build-logs.js
const fs = require('fs').promises;
const path = require('path');
const {marked} = require('marked');

(async () => {
  const srcDir = path.join(__dirname, '..', 'everlight-context', 'logs');
  const outDir = path.join(__dirname, '..', 'dist', 'everlight-context', 'logs');
  await fs.mkdir(outDir, { recursive: true });

  const files = (await fs.readdir(srcDir)).filter(f => f.endsWith('.md'));
  const pages = files.map(f => {
    const name = path.basename(f, '.md');
    const outName = name + '.html';
    return { src: path.join(srcDir, f), name, outName };
  });

  // build nav HTML (relative links)
  const navHtml = `<nav><ul>${pages.map(p => `<li><a href="./${p.outName}">${p.name}</a></li>`).join('')}</ul></nav>`;

  for (const p of pages) {
    const md = await fs.readFile(p.src, 'utf8');
    const body = marked(md);
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${p.name}</title>
  <style>/* minimal styling */ body{font-family:system-ui,Segoe UI,Helvetica,Arial} nav{margin-bottom:1rem}</style>
</head>
<body>
  ${navHtml}
  <main>${body}</main>
</body>
</html>`;
    await fs.writeFile(path.join(outDir, p.outName), html, 'utf8');
  }

  // write index.html
  const indexHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Logs index</title></head><body>
  <h1>Logs</h1>
  ${navHtml}
</body></html>`;
  await fs.writeFile(path.join(outDir, 'index.html'), indexHtml, 'utf8');

  console.log('Built', pages.length, 'pages →', outDir);
})();
