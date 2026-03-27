import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'dist', 'index.html');
const destDir = path.join(process.cwd(), 'public');
const dest = path.join(destDir, 'dashboard.html');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

fs.copyFileSync(src, dest);
console.log('Copied dist/index.html to public/dashboard.html');
