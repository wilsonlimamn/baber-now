import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SVG oficial do logo Barber-Now (1024x1024)
const BARBER_NOW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#090D16" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <!-- Fundo com cantos arredondados suaves -->
  <rect width="1024" height="1024" rx="224" fill="url(#bgGrad)" />

  <!-- Aro circular dourado -->
  <circle cx="512" cy="512" r="390" fill="none" stroke="url(#goldGrad)" stroke-width="20" opacity="0.9" />
  <circle cx="512" cy="512" r="410" fill="none" stroke="#F59E0B" stroke-width="4" opacity="0.35" stroke-dasharray="16 12" />

  <!-- Emblema Central em Camadas -->
  <g filter="url(#shadow)">
    <!-- Pente Estilizado (Barber Comb) Superior -->
    <rect x="292" y="270" width="440" height="48" rx="14" fill="#F8FAFC" />
    <path d="M 320 318 L 320 380 M 360 318 L 360 380 M 400 318 L 400 380 M 440 318 L 440 380 M 480 318 L 480 380 M 520 318 L 520 380 M 560 318 L 560 380 M 600 318 L 600 380 M 640 318 L 640 380 M 680 318 L 680 380 M 712 318 L 712 380" 
          stroke="#94A3B8" stroke-width="14" stroke-linecap="round" />

    <!-- Lâmina Tesoura 1 (Aço Prata) -->
    <path d="M 480 490 L 740 230 C 760 210 790 210 810 230 C 830 250 830 280 810 300 L 550 560 Z" 
          fill="#FFFFFF" />

    <!-- Lâmina Tesoura 2 (Azul Elétrico) -->
    <path d="M 520 490 L 810 780 C 830 800 830 830 810 850 C 790 870 760 870 740 850 L 480 590 Z" 
          fill="url(#blueGrad)" />

    <!-- Anéis da Tesoura (Empunhadura) -->
    <circle cx="280" cy="740" r="80" fill="none" stroke="url(#goldGrad)" stroke-width="28" />
    <circle cx="340" cy="640" r="68" fill="none" stroke="#FFFFFF" stroke-width="24" opacity="0.95" />

    <!-- Haste de Conexão -->
    <path d="M 336 700 L 490 520 L 520 540 L 380 730 Z" fill="#94A3B8" />

    <!-- Pivô Central Dourado -->
    <circle cx="512" cy="512" r="42" fill="url(#goldGrad)" stroke="#FFFFFF" stroke-width="8" />
    <circle cx="512" cy="512" r="16" fill="#0F172A" />
  </g>

  <!-- Tipografia / Tagline inferior -->
  <text x="512" y="930" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="74" fill="#F8FAFC" letter-spacing="8">BARBER-NOW</text>
  <text x="512" y="980" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="28" fill="#F59E0B" letter-spacing="14">BELÉM • PARÁ</text>
</svg>`;

const SIZES = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

async function generate() {
  console.log('🚀 Iniciando gerador de ícones Barber-Now para Android...');

  const rootDir = process.cwd();
  const assetsDir = path.join(rootDir, 'assets');
  const resDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res');

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Caminho de imagem fornecida pelo usuário (se existir)
  const customImagePath = [
    path.join(assetsDir, 'logo.png'),
    path.join(assetsDir, 'icon.png'),
    path.join(rootDir, 'resources', 'icon.png'),
    path.join(rootDir, 'resources', 'logo.png'),
  ].find((p) => fs.existsSync(p));

  let sourceBuffer;

  if (customImagePath) {
    console.log(`📸 Usando imagem base fornecida pelo usuário: ${customImagePath}`);
    sourceBuffer = fs.readFileSync(customImagePath);
  } else {
    console.log('✨ Gerando ícone mestre padrão oficial Barber-Now em 1024x1024 a partir do vetor SVG...');
    const masterSvgPath = path.join(assetsDir, 'logo.svg');
    fs.writeFileSync(masterSvgPath, BARBER_NOW_SVG, 'utf-8');

    // Converte SVG para PNG 1024x1024
    sourceBuffer = await sharp(Buffer.from(BARBER_NOW_SVG)).resize(1024, 1024).png().toBuffer();

    // Salva o PNG mestre em assets/logo.png para referência
    fs.writeFileSync(path.join(assetsDir, 'logo.png'), sourceBuffer);
    console.log(`✅ Base 1024x1024 salva em: ${path.join(assetsDir, 'logo.png')}`);
  }

  // Gera para cada pasta mipmap do Android
  for (const item of SIZES) {
    const targetDir = path.join(resDir, item.folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 1. ic_launcher.png (quadrado arredondado padrão)
    const launcherPath = path.join(targetDir, 'ic_launcher.png');
    await sharp(sourceBuffer).resize(item.size, item.size).png().toFile(launcherPath);

    // 2. ic_launcher_round.png (formato circular)
    const circleSvg = `<svg width="${item.size}" height="${item.size}"><circle cx="${item.size / 2}" cy="${item.size / 2}" r="${item.size / 2}" fill="#ffffff"/></svg>`;
    const roundBuffer = await sharp(sourceBuffer)
      .resize(item.size, item.size)
      .composite([{ input: Buffer.from(circleSvg), blend: 'dest-in' }])
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), roundBuffer);

    // 3. ic_launcher_foreground.png (para ícones adaptativos)
    const fgSize = Math.round(item.size * 1.5);
    const fgBuffer = await sharp(sourceBuffer).resize(fgSize, fgSize).png().toBuffer();
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), fgBuffer);

    console.log(`  ✓ ${item.folder} (${item.size}x${item.size}px gerado com sucesso)`);
  }

  // Gera ícone em alta resolução para a Google Play Store (512x512)
  const playStorePath = path.join(assetsDir, 'playstore-icon-512.png');
  await sharp(sourceBuffer).resize(512, 512).png().toFile(playStorePath);
  console.log(`⭐ Ícone Play Store (512x512) gerado em: ${playStorePath}`);

  console.log('\n🎉 Todos os ícones e splash screen foram atualizados com sucesso para o Android!');
}

generate().catch((err) => {
  console.error('❌ Erro ao gerar ícones:', err);
  process.exit(1);
});
