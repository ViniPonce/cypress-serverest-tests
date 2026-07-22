const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlDir = path.join('cypress', 'reports', 'html');
const jsonsGlob = path.join('cypress', 'reports', 'mochawesome', '.jsons', '*.json');
const pluginHtml = path.join('cypress', 'reports', 'mochawesome', 'report.html');
const pluginHtmlAlt = path.join('cypress', 'reports', 'html', 'index.html');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function hasJsonReports() {
  const dir = path.join('cypress', 'reports', 'mochawesome', '.jsons');
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).some((f) => f.endsWith('.json'));
}

function copyIfExists(from, to) {
  if (!fs.existsSync(from)) return false;
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
  return true;
}

ensureDir(htmlDir);

if (hasJsonReports()) {
  execSync(`npx mochawesome-merge "${jsonsGlob.replace(/\\/g, '/')}" -o cypress/reports/merged.json`, {
    stdio: 'inherit',
    shell: true,
  });
  execSync(
    'npx marge cypress/reports/merged.json --reportDir cypress/reports/html --reportFilename index --inline true --charts true',
    { stdio: 'inherit', shell: true },
  );
  console.log('HTML gerado via merge em cypress/reports/html/index.html');
  process.exit(0);
}

if (copyIfExists(pluginHtml, path.join(htmlDir, 'index.html'))) {
  console.log('HTML do cypress-mochawesome-reporter copiado para cypress/reports/html/index.html');
  process.exit(0);
}

if (fs.existsSync(pluginHtmlAlt)) {
  console.log('HTML ja disponivel em cypress/reports/html/index.html');
  process.exit(0);
}

console.warn('Nenhum report HTML/JSON encontrado para publicar.');
process.exit(0);
