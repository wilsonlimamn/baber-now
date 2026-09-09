import fs from 'fs';
import path from 'path';

const source = path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const targetDir = path.join(process.cwd(), 'public');
const target = path.join(targetDir, 'barber-now.apk');

if (fs.existsSync(source)) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.copyFileSync(source, target);
  console.log('✅ APK copiado com sucesso para public/barber-now.apk!');
} else {
  console.warn('⚠️ Arquivo app-debug.apk não encontrado em:', source);
}
