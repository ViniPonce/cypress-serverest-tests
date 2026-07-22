/**
 * Filtro leve de tags por criticidade.
 * Uso: cypress run --env grepTags=@smoke
 * @regression (ou sem env) executa a suíte completa.
 */
function coletarTags(test) {
  const doTitulo = test.title.match(/@[\w-]+/g) || [];
  const cfg = test.cfg || test._testConfig || {};
  const extras = cfg.unverifiedTestConfig || {};
  const daConfig = extras.tags || cfg.tags || [];
  return [...new Set([...doTitulo, ...daConfig])];
}

beforeEach(function filtrarPorTag() {
  const grepTags = Cypress.env('grepTags');
  if (!grepTags || grepTags === '@regression' || grepTags === 'all') return;

  const desejadas = String(grepTags)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const tags = coletarTags(this.currentTest);
  const caminho = this.currentTest.titlePath().join(' ');
  const casa = desejadas.some((tag) => tags.includes(tag) || caminho.includes(tag));

  if (!casa) this.skip();
});
