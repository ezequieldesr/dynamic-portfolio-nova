import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
const output = path.resolve('docs/demo');
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '8085', '--strictPort'], { stdio: 'ignore' });
let browser;
await new Promise(resolve => setTimeout(resolve, 500));
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error('O preview encerrou antes de iniciar.');
    try { if ((await fetch('http://127.0.0.1:8085')).ok) { ready = true; break; } } catch { /* aguardar servidor */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error('Preview indisponível na porta 8085.');
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, locale: 'pt-BR', recordVideo: { dir: 'artifacts/demo', size: { width: 1024, height: 768 } } });
  await context.route('https://api.emailjs.com/**', route => route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const pause = () => page.waitForTimeout(1800);
  const capture = name => page.screenshot({ path: path.join(output, name) });
  await page.goto('http://127.0.0.1:8085');
  await page.waitForTimeout(4500);
  await capture('01-inicio.png');
  await page.getByRole('link', { name: 'Ver projetos', exact: true }).click();
  await pause(); await capture('02-projetos.png');
  await page.getByRole('button', { name: 'Modo escuro', exact: true }).click();
  await pause(); await capture('03-tema-escuro.png');
  await page.getByRole('button', { name: 'Switch to English', exact: true }).click();
  await pause();
  await page.getByRole('button', { name: 'Mudar para Português', exact: true }).click();
  await page.locator('header nav').getByRole('link', { name: 'Sobre', exact: true }).click();
  await pause();
  await page.locator('header nav').getByRole('link', { name: 'Habilidades', exact: true }).click();
  await pause();
  await page.getByRole('button', { name: 'Modo claro', exact: true }).click();
  await page.locator('header nav').getByRole('link', { name: 'Contato', exact: true }).click();
  await pause();
  for (const [id, value] of Object.entries({ name: 'Cliente de demonstração', email: 'cliente@example.com', subject: 'Meu novo portfólio', message: 'Gostaria de apresentar meus serviços com um portfólio profissional e responsivo.' })) {
    await page.locator(`#${id}`).pressSequentially(value, { delay: 22 });
  }
  await pause(); await capture('04-contato.png');
  const video = page.video();
  await context.close();
  await copyFile(await video.path(), path.join(output, 'portfolio-demo.webm'));
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'pt-BR' });
  await mobile.route('https://api.emailjs.com/**', route => route.abort());
  await mobile.goto('http://127.0.0.1:8085');
  await mobile.waitForFunction(() => document.querySelector('h1')?.textContent?.includes('extraordinárias'));
  await mobile.waitForTimeout(150);
  await mobile.screenshot({ path: path.join(output, '05-mobile.png') });
  await mobile.getByRole('button', { name: 'Abrir menu' }).click();
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: path.join(output, '06-menu-mobile.png') });
  console.log('Capturas e vídeo WebM criados em docs/demo. Nenhuma mensagem foi enviada.');
} finally {
  if (browser) await browser.close();
  server.kill();
}
