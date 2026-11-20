#!/usr/bin/env node
// Regenera pruebas/indice-skills.md a partir de los encabezados de las
// skills. Con --check solo comprueba que está al día (para CI).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, buildIndex, version } from './lib.mjs';

const file = path.join(ROOT, 'pruebas', 'indice-skills.md');
const fresh = buildIndex(version());

if (process.argv.includes('--check')) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (current !== fresh) {
    console.error('pruebas/indice-skills.md está desactualizado: corre node scripts/indice-skills.mjs');
    process.exit(1);
  }
  console.log('índice al día');
} else {
  fs.writeFileSync(file, fresh);
  console.log(`escrito ${path.relative(ROOT, file)}`);
}
