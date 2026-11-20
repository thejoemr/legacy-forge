#!/usr/bin/env node
// Comprueba que el paquete está completo y coherente antes de publicar:
// encabezados válidos, referencias entre archivos, listas de los
// instaladores, versiones, copia del guard e índice de skills.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, frontmatter, skillNames, buildIndex, version } from './lib.mjs';

const errors = [];
const warnings = [];
const rel = (p) => path.relative(ROOT, p);
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const json = (p) => {
  try { return JSON.parse(read(p)); } catch (e) { errors.push(`${p}: JSON inválido (${e.message})`); return {}; }
};

const VERSION = version();
const skills = skillNames();
const CODEX_DESC_BUDGET = 8000;

// Skills: encabezado, nombre y referencias relativas.
let descTotal = 0;
for (const name of skills) {
  const dir = path.join(ROOT, 'skills', name);
  const file = path.join(dir, 'SKILL.md');
  let fm;
  try { fm = frontmatter(file); } catch (e) { errors.push(e.message); continue; }
  const { data, body } = fm;
  if (data.name !== name) errors.push(`${rel(file)}: name "${data.name}" no coincide con la carpeta`);
  if (!data.description) errors.push(`${rel(file)}: sin description`);
  descTotal += (data.description || '').length;
  if (data['disable-model-invocation'] === true && !fs.existsSync(path.join(dir, 'agents', 'openai.yaml'))) {
    errors.push(`${rel(dir)}: invocación manual sin agents/openai.yaml para Codex`);
  }
  for (const m of body.matchAll(/`((?:\.\.\/[\w-]+\/)?(?:references|assets)\/[\w.-]+\.md)`/g)) {
    if (!fs.existsSync(path.join(dir, m[1]))) errors.push(`${rel(file)}: referencia rota ${m[1]}`);
  }
  if (body.split('\n').length > 520) warnings.push(`${rel(file)}: más de 520 líneas`);
}
if (descTotal > CODEX_DESC_BUDGET) {
  warnings.push(`descripciones: ${descTotal} caracteres, sobre el presupuesto de Codex (~${CODEX_DESC_BUDGET})`);
}

// Agentes.
const helperAgents = ['lf-explorador', 'lf-critico', 'lf-verificador', 'lf-escenarios'];
for (const a of [...helperAgents, 'lf-simulador']) {
  const file = path.join(ROOT, 'agents', `${a}.md`);
  if (!fs.existsSync(file)) { errors.push(`falta agents/${a}.md`); continue; }
  try {
    const { data } = frontmatter(file);
    if (data.name !== a) errors.push(`${rel(file)}: name "${data.name}" no coincide`);
  } catch (e) { errors.push(e.message); }
}

// Listas de los instaladores.
const listFrom = (text, re) => {
  const m = re.exec(text);
  return m ? [...m[1].matchAll(/lf-[\w-]+/g)].map((x) => x[0]) : null;
};
const sh = read('install.sh');
const ps = read('install.ps1');
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const shSkills = listFrom(sh, /SKILLS=\(([^)]*)\)/);
const shAgents = listFrom(sh, /AGENTS=\(([^)]*)\)/);
const psSkills = listFrom(ps, /\$LfSkills = @\(([^)]*)\)/);
const psAgents = listFrom(ps, /\$LfAgents = @\(([^)]*)\)/);
if (!shSkills || !same(shSkills, skills)) errors.push('install.sh: la lista SKILLS no coincide con skills/');
if (!psSkills || !same(psSkills, skills)) errors.push('install.ps1: la lista $LfSkills no coincide con skills/');
if (!shAgents || !same(shAgents, helperAgents)) errors.push('install.sh: la lista AGENTS no coincide');
if (!psAgents || !same(psAgents, helperAgents)) errors.push('install.ps1: la lista $LfAgents no coincide');
if ([...ps].some((c) => c.charCodeAt(0) > 127)) errors.push('install.ps1: debe ser ASCII (PowerShell 5.1 lo lee como ANSI)');

// Manifiestos y versiones.
const claudePlugin = json('.claude-plugin/plugin.json');
const marketplace = json('.claude-plugin/marketplace.json');
const copilotPlugin = json('plugin.json');
const guardPlugin = json('plugins/legacyforge-guard/.claude-plugin/plugin.json');
json('plugins/legacyforge-guard/hooks/hooks.json');
json('hooks/settings-claude.json');
json('hooks/copilot-hooks.json');
for (const [label, v] of [
  ['.claude-plugin/plugin.json', claudePlugin.version],
  ['plugin.json', copilotPlugin.version],
  ['plugins/legacyforge-guard/.claude-plugin/plugin.json', guardPlugin.version],
  ['.claude-plugin/marketplace.json metadata', marketplace.metadata?.version],
]) {
  if (v !== VERSION) errors.push(`${label}: versión ${v}, VERSION dice ${VERSION}`);
}
for (const a of claudePlugin.agents || []) {
  if (!fs.existsSync(path.join(ROOT, a))) errors.push(`.claude-plugin/plugin.json: no existe ${a}`);
}
for (const p of marketplace.plugins || []) {
  if (!fs.existsSync(path.join(ROOT, p.source))) errors.push(`marketplace: no existe ${p.source}`);
}
const tpl = read('skills/lf-init/assets/plantilla-AGENTS.md');
if (!tpl.includes(`(LegacyForge ${VERSION})`)) errors.push(`plantilla-AGENTS.md no declara LegacyForge ${VERSION}`);
if (!read('CHANGELOG.md').includes(`## ${VERSION}`)) errors.push(`CHANGELOG.md no tiene la sección ${VERSION}`);
const tplBlock = tpl.split('\n').filter((l, i, arr) => i < arr.length - 1 || l).length;
if (tplBlock > 120) errors.push(`plantilla-AGENTS.md: ${tplBlock} líneas (máximo 120)`);

// La copia del guard dentro del plugin debe ser idéntica.
if (read('hooks/lf-guard.mjs') !== read('plugins/legacyforge-guard/hooks/lf-guard.mjs')) {
  errors.push('plugins/legacyforge-guard/hooks/lf-guard.mjs difiere de hooks/lf-guard.mjs: cópialo de nuevo');
}

// Índice de skills.
if (read('pruebas/indice-skills.md') !== buildIndex(VERSION)) {
  errors.push('pruebas/indice-skills.md desactualizado: corre node scripts/indice-skills.mjs');
}

for (const w of warnings) console.warn(`aviso: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log(`LegacyForge ${VERSION}: ${skills.length} skills, ${helperAgents.length + 1} agentes, ` +
  `${descTotal} caracteres de descripción. Todo en orden.`);
