import { chromium } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { readFile, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const out = 'docs/fiverr';
await mkdir(out, { recursive: true });
const result = spawnSync(ffmpeg, ['-y', '-i', 'docs/demo/portfolio-demo.webm', '-c:v', 'libx264', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', 'docs/demo/portfolio-demo.mp4'], { stdio: 'inherit' });
if (result.error || result.status !== 0) throw new Error('Configure ffmpeg no PATH ou FFMPEG_PATH.');
await copyFile('docs/demo/portfolio-demo.mp4', `${out}/02-demonstracao.mp4`);
for (const [source, dest] of [['02-projetos.png', '03-projetos.png'], ['03-tema-escuro.png', '04-tema-escuro.png'], ['05-mobile.png', '05-mobile.png']]) await copyFile(`docs/demo/${source}`, `${out}/${dest}`);
const picture = (await readFile('docs/demo/01-inicio.png')).toString('base64');
const browser = await chromium.launch();
try {
 const page = await browser.newPage({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 });
 await page.setContent(`<!doctype html><html lang="pt-BR"><style>*{box-sizing:border-box}body{margin:0;background:#0b1424;color:#f7f9fc;font-family:Arial,sans-serif;padding:46px}small{color:#88dac8;font-size:18px;letter-spacing:3px}h1{font-size:48px;line-height:1.08;margin:16px 0}p{color:#bccadd;font-size:20px}img{width:570px;border-radius:14px;border:1px solid #53647d;box-shadow:0 20px 70px #0008;transform:rotate(-2deg)}.preview{position:absolute;top:280px;left:225px}.tag{position:absolute;bottom:28px;left:46px;color:#88dac8;font-size:17px}</style><small>DESENVOLVIMENTO WEB · EZEQUIEL SR</small><h1>Seu trabalho merece<br>um portfólio profissional.</h1><p>Design responsivo · Dois idiomas · Temas claro e escuro</p><div class="preview"><img src="data:image/png;base64,${picture}"></div><div class="tag">Projeto pessoal · Interface real · React + TypeScript</div></html>`);
 await page.screenshot({ path: path.resolve(out, '01-capa-portfolio.png') });
} finally { await browser.close(); }
console.log('Cinco anexos preparados em docs/fiverr.');
