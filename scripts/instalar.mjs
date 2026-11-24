#!/usr/bin/env node
// Instalador de LegacyForge para Claude Code, GitHub Copilot y Codex.
//
// Desde el repositorio, sin clonar:
//   curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash
//   irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1 | iex
//   npx github:thejoemr/legacy-forge -- --harness claude
// Desde un clon:
//   node scripts/instalar.mjs --harness claude --scope project --project ~/src/facturacion
//
// node scripts/instalar.mjs --help muestra todas las opciones.
// Siempre quita lo que haya dejado LegacyForge 0.4 en los mismos lugares.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOME = os.homedir();
const VERSION = fs.readFileSync(path.join(PKG, 'VERSION'), 'utf8').trim();

// Lo que dejó 0.4 y ya no existe en 1.0.
const SKILLS_04 = ['lf-analyze', 'lf-architecture', 'lf-branch', 'lf-change', 'lf-core',
  'lf-delegate', 'lf-diagnose', 'lf-explain', 'lf-help', 'lf-init', 'lf-memory',
  'lf-optimize', 'lf-product', 'lf-propose', 'lf-setup', 'lf-team', 'lf-test'];
const AGENTS_04 = ['lf-explorador', 'lf-simulador', 'lf-escenarios'];

const SKILLS = fs.readdirSync(path.join(PKG, 'skills')).filter((d) => d.startsWith('lf-'));
const AGENTS = fs.readdirSync(path.join(PKG, 'agents')).map((f) => f.replace(/\.md$/, ''));

const USAGE = `Instalador de LegacyForge ${VERSION}

Opciones:
  --harness LISTA   claude, copilot, codex o all (separados por coma).
                    Sin esta opción se detectan los asistentes instalados.
  --scope ÁMBITO    user (todos tus proyectos, por defecto) o project.
  --project RUTA    Carpeta del proyecto para --scope project y para los
                    hooks de Copilot. Por defecto, la carpeta actual.
  --no-hooks        No instala los hooks (no recomendado: hacen cumplir
                    APPLY, secretos, git y producción fuera del modelo).
  --no-agents       No instala los agentes (el asistente hará cada encargo
                    como una pasada aparte).
  --uninstall       Quita LegacyForge (1.0 y 0.4) sin tocar nada más.
  --dry-run         Muestra lo que haría, sin cambiar nada.
  -h, --help        Esta ayuda.

A nivel de usuario, los hooks solo actúan en proyectos preparados con
/lf-iniciar. Con --scope project actúan siempre en ese proyecto.`;

// ---------------------------------------------------------------- opciones

const opt = { harness: [], scope: 'user', project: process.cwd(), hooks: true,
  agents: true, uninstall: false, dryRun: false };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const val = () => {
    if (argv[i + 1] === undefined) fail(`falta el valor de ${a}`);
    return argv[++i];
  };
  if (a === '--harness' || a === '-t') opt.harness.push(...val().split(','));
  else if (a === '--scope' || a === '-s') opt.scope = val();
  else if (a === '--project' || a === '-p') opt.project = val();
  else if (a === '--no-hooks') opt.hooks = false;
  else if (a === '--hooks') opt.hooks = true; // compatibilidad con 0.4
  else if (a === '--no-agents') opt.agents = false;
  else if (a === '--uninstall') opt.uninstall = true;
  else if (a === '--dry-run') opt.dryRun = true;
  else if (a === '-h' || a === '--help') { console.log(USAGE); process.exit(0); }
  else if (a === '--') continue;
  else fail(`opción desconocida: ${a}\n\n${USAGE}`);
}

function fail(m) {
  console.error(`error: ${m}`);
  process.exit(1);
}

if (!['user', 'project'].includes(opt.scope)) fail('--scope debe ser user o project');
opt.project = path.resolve(opt.project.replace(/^~(?=$|[\\/])/, HOME));
if (!fs.existsSync(opt.project)) fail(`no existe la carpeta del proyecto: ${opt.project}`);

function onPath(cmd) {
  const r = process.platform === 'win32'
    ? spawnSync('where', [cmd], { stdio: 'ignore' })
    : spawnSync('sh', ['-c', `command -v ${cmd}`], { stdio: 'ignore' });
  return r.status === 0;
}

let harness = opt.harness.flatMap((h) => (h === 'all' ? ['claude', 'copilot', 'codex'] : [h]))
  .map((h) => h.trim()).filter(Boolean);
for (const h of harness) {
  if (!['claude', 'copilot', 'codex'].includes(h)) fail(`asistente desconocido: ${h}`);
}
if (!harness.length) {
  if (onPath('claude') || fs.existsSync(path.join(HOME, '.claude'))) harness.push('claude');
  if (onPath('copilot') || onPath('code') || fs.existsSync(path.join(HOME, '.copilot'))) harness.push('copilot');
  if (onPath('codex') || fs.existsSync(path.join(HOME, '.codex'))) harness.push('codex');
  if (!harness.length) fail('no detecté Claude Code, Copilot ni Codex. Indica cuál con --harness claude|copilot|codex|all');
  console.log(`Asistentes detectados: ${harness.join(', ')}`);
}
harness = [...new Set(harness)];

// ------------------------------------------------------------- operaciones

const log = (m) => console.log(m);
function act(desc, fn) {
  if (opt.dryRun) log(`  [dry-run] ${desc}`);
  else fn();
}
function rm(p) {
  if (fs.existsSync(p)) act(`borrar ${p}`, () => fs.rmSync(p, { recursive: true, force: true }));
}
function copyDir(from, to) {
  act(`copiar ${path.relative(PKG, from)} -> ${to}`, () => {
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(from, to, { recursive: true });
  });
}
function copyFile(from, to) {
  act(`copiar ${path.relative(PKG, from)} -> ${to}`, () => {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  });
}
function pruneEmpty(dir) {
  if (opt.dryRun) return;
  try { if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir); } catch { /* no existe */ }
}

function skills(dir) {
  for (const s of SKILLS_04) rm(path.join(dir, s));
  if (opt.uninstall) {
    for (const s of SKILLS) rm(path.join(dir, s));
    pruneEmpty(dir);
    log(`  skills quitadas de ${dir}`);
    return;
  }
  for (const s of SKILLS) copyDir(path.join(PKG, 'skills', s), path.join(dir, s));
  log(`  skills (${SKILLS.length})   -> ${dir}`);
}

function agents(dir, ext, srcDir) {
  for (const a of AGENTS_04) for (const e of ['.md', '.agent.md']) rm(path.join(dir, a + e));
  if (opt.uninstall || !opt.agents) {
    for (const a of AGENTS) rm(path.join(dir, a + ext));
    pruneEmpty(dir);
    if (opt.uninstall) log(`  agentes quitados de ${dir}`);
    return;
  }
  for (const a of AGENTS) copyFile(path.join(PKG, srcDir, `${a}${ext}`), path.join(dir, a + ext));
  log(`  agentes (${AGENTS.length})  -> ${dir}`);
}

// Combina los hooks en un settings.json sin tocar lo demás. Quita las
// entradas de LegacyForge 0.4 (lf-guard.mjs) y las de 1.0 antes de agregar.
function settings(file, command) {
  let cur = {};
  if (fs.existsSync(file)) {
    try { cur = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {
      log(`  aviso: ${file} no es JSON válido; no lo toco. Agrega los hooks a mano (hooks/settings-claude.json).`);
      return;
    }
  }
  const ours = (e) => /lf-hooks\.mjs|lf-guard\.mjs/.test(JSON.stringify(e));
  const hooks = cur.hooks || {};
  for (const ev of Object.keys(hooks)) {
    hooks[ev] = (hooks[ev] || []).filter((e) => !ours(e));
    if (!hooks[ev].length) delete hooks[ev];
  }
  if (command) {
    const tpl = JSON.parse(fs.readFileSync(path.join(PKG, 'hooks', 'settings-claude.json'), 'utf8'));
    for (const [ev, entries] of Object.entries(tpl.hooks)) {
      const fixed = JSON.parse(JSON.stringify(entries).replaceAll(
        JSON.stringify('node "$CLAUDE_PROJECT_DIR/.claude/hooks/lf-hooks.mjs"').slice(1, -1),
        JSON.stringify(command).slice(1, -1)));
      hooks[ev] = [...(hooks[ev] || []), ...fixed];
    }
  }
  if (Object.keys(hooks).length) cur.hooks = hooks; else delete cur.hooks;
  const backup = `${file}.antes-de-legacyforge`;
  if (!command && Object.keys(cur).length === 0 && !fs.existsSync(backup)) {
    rm(file); // lo creó LegacyForge y quedó vacío
    return;
  }
  act(`actualizar ${file}`, () => {
    if (command && fs.existsSync(file) && !fs.existsSync(backup)) {
      fs.copyFileSync(file, backup);
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(cur, null, 2)}\n`);
  });
}

function needNode18() {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 18) fail(`los hooks necesitan Node.js 18 o superior (tienes ${process.version})`);
}

// ---------------------------------------------------------------- asistentes

function claude() {
  const base = opt.scope === 'user' ? path.join(HOME, '.claude') : path.join(opt.project, '.claude');
  log(`Claude Code (${opt.scope === 'user' ? 'usuario' : 'proyecto'}):`);
  skills(path.join(base, 'skills'));
  agents(path.join(base, 'agents'), '.md', 'agents');
  const hooksDir = path.join(base, 'hooks');
  rm(path.join(hooksDir, 'lf-guard.mjs'));
  rm(path.join(hooksDir, 'lf-hooks-config.mjs'));
  const file = path.join(base, 'settings.json');
  if (opt.uninstall || !opt.hooks) {
    rm(path.join(hooksDir, 'lf-hooks.mjs'));
    if (fs.existsSync(file)) settings(file, null);
    pruneEmpty(hooksDir);
    if (opt.uninstall) { pruneEmpty(base); log('  hooks quitados'); }
    return;
  }
  needNode18();
  copyFile(path.join(PKG, 'hooks', 'lf-hooks.mjs'), path.join(hooksDir, 'lf-hooks.mjs'));
  const command = opt.scope === 'user'
    ? `node "${path.join(hooksDir, 'lf-hooks.mjs')}" --solo-preparados`
    : 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/lf-hooks.mjs"';
  settings(file, command);
  log(`  hooks       -> ${file}`);
}

function copilotHooks(project) {
  const dir = path.join(project, '.github', 'hooks');
  rm(path.join(dir, 'lf-guard.mjs'));
  if (opt.uninstall || !opt.hooks) {
    rm(path.join(dir, 'lf-hooks.mjs'));
    rm(path.join(dir, 'legacyforge.json'));
    pruneEmpty(dir);
    pruneEmpty(path.dirname(dir));
    return;
  }
  needNode18();
  copyFile(path.join(PKG, 'hooks', 'lf-hooks.mjs'), path.join(dir, 'lf-hooks.mjs'));
  copyFile(path.join(PKG, 'hooks', 'copilot-hooks.json'), path.join(dir, 'legacyforge.json'));
  log(`  hooks       -> ${dir}`);
}

function copilot(sharedDone) {
  log(`GitHub Copilot (${opt.scope === 'user' ? 'usuario' : 'proyecto'}):`);
  if (opt.scope === 'user') {
    if (!sharedDone) skills(path.join(HOME, '.agents', 'skills'));
    agents(path.join(HOME, '.copilot', 'agents'), '.agent.md', 'agents-copilot');
    if (opt.hooks && !opt.uninstall) {
      log('  hooks: en Copilot van por proyecto. Repite con --scope project --project <ruta> en cada proyecto.');
    }
  } else {
    if (!sharedDone) skills(path.join(opt.project, '.agents', 'skills'));
    for (const a of AGENTS_04) rm(path.join(opt.project, '.claude', 'agents', `${a}.md`)); // ubicación de 0.4
    agents(path.join(opt.project, '.github', 'agents'), '.agent.md', 'agents-copilot');
    copilotHooks(opt.project);
    pruneEmpty(path.join(opt.project, '.claude', 'agents'));
    pruneEmpty(path.join(opt.project, '.claude'));
  }
}

function codex(sharedDone) {
  log(`Codex (${opt.scope === 'user' ? 'usuario' : 'proyecto'}):`);
  const dir = opt.scope === 'user' ? path.join(HOME, '.agents', 'skills') : path.join(opt.project, '.agents', 'skills');
  if (!sharedDone) skills(dir);
  else if (!opt.uninstall) log(`  skills      -> ${dir} (compartidas con Copilot)`);
  pruneEmpty(path.dirname(dir));
  if (!opt.uninstall) log('  Codex no tiene subagentes ni hooks: el asistente hace cada encargo como una pasada de solo lectura.');
}

// --------------------------------------------------------------------- main

if (opt.dryRun) log('Modo dry-run: no se cambia nada.');
log(opt.uninstall ? 'Desinstalando LegacyForge...' : `Instalando LegacyForge ${VERSION}`);
let shared = false;
if (harness.includes('claude')) claude();
if (harness.includes('copilot')) { copilot(false); shared = true; }
if (harness.includes('codex')) codex(shared);

if (!opt.uninstall) {
  log('');
  log('Listo. Abre una sesión nueva de tu asistente en el proyecto y escribe /lf-ayuda');
  log('(en Codex, $lf-ayuda). La primera vez en un proyecto, /lf-iniciar.');
  if (opt.scope === 'user' && opt.hooks) {
    log('Los hooks se activan en cada proyecto cuando lo preparas con /lf-iniciar.');
  }
}
