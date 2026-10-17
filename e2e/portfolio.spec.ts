import { test, expect } from '@playwright/test';

test('navegação, links e currículo disponíveis', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Ver projetos', exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('#projects h2')).toBeInViewport();
  const external = page.locator('#projects a[target="_blank"]');
  expect(await external.count()).toBeGreaterThan(4);
  for (const link of await external.all()) await expect(link).toHaveAttribute('rel', /noopener/);
  const pdf = await page.request.get('/CV-Ezequiel-PCD.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  await page.locator('header nav').getByRole('link', { name: 'Sobre', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Baixar CV' }).click();
  expect((await download).suggestedFilename()).toBe('CV-Ezequiel.pdf');
});

test('idioma e tema persistem, inclusive com preferência inválida', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('language', 'invalid'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await page.getByRole('button', { name: 'Modo escuro', exact: true }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Switch to English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('menu móvel abre, navega, fecha com Escape e não transborda', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-menu').getByRole('link', { name: 'Contato', exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#contact h2')).toBeInViewport();
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('formulário sem configuração orienta contato alternativo sem enviar', async ({ page }) => {
  let emails = 0;
  await page.route('https://api.emailjs.com/**', async route => { emails++; await route.abort(); });
  await page.goto('/#contact');
  await expect(page.getByRole('button', { name: 'Enviar mensagem' })).toBeDisabled();
  await expect(page.getByRole('status').filter({ hasText: 'Formulário indisponível' })).toBeVisible();
  await expect(page.locator('#contact a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:ezequieldesr@gmail.com');
  expect(emails).toBe(0);
});

test('rota inexistente oferece retorno ao início', async ({ page }) => {
  await page.goto('/pagina-inexistente');
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar para a página inicial' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:8084/');
});
