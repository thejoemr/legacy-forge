#!/usr/bin/env node
// lf-guard · LegacyForge 0.3.0
//
// Hook para Claude Code y para GitHub Copilot (VS Code y CLI, formato
// compatible) que hace cumplir, fuera del modelo, tres reglas:
//   1. Ninguna edición de archivos del proyecto sin un APPLY vigente.
//   2. Ninguna lectura de archivos de secretos.
//   3. Ningún comando de git que descarte o reescriba trabajo.
//
// Eventos: UserPromptSubmit y PreToolUse. Lee el JSON del evento por
// stdin. Sale con 0 para permitir y con 2 para bloquear; el texto de
// stderr le llega al asistente como motivo.
//
// Un APPLY queda vigente desde que el usuario lo escribe hasta su
// siguiente mensaje. Cualquier otro mensaje lo retira.
//
// Variables opcionales:
//   LF_GUARD_OFF=1            desactiva el guard.
//   LF_GUARD_PROTECTED=regex  ramas donde no se permite commit. Vacío
//                             desactiva esa comprobación.
//   LF_GUARD_DEBUG=1          anota cada evento (herramienta, tipo y
//                             decisión) en legacyforge-guard/debug.log de
//                             la carpeta temporal. Sirve para comprobar
//                             qué nombres de herramienta usa tu asistente.
//
// Cada asistente llama distinto a sus herramientas. El guard las
// clasifica por nombre (editar, leer, terminal) y busca la ruta o el
// comando en los campos habituales. Una herramienta que no reconoce se
// deja pasar: revisa el registro de depuración al instalarlo.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SECRET_FILE =
  /(^|[\\/])(\.env(\.[\w.-]+)?|secrets\.json|id_rsa|[^\\/]*\.(pfx|pem|key|p12))$/i;
const SECRET_OK = /\.env\.(example|sample|template|dist)$/i;

// Archivos que las skills escriben con su propio flujo de autorización.
const EXEMPT_NAMES = new Set([
  'SETUP.md', 'ARCHITECTURE.md', 'PRODUCT.md', 'AGENTS.md',
  '.lf-setup-progreso.md',
]);
const EXEMPT_DIRS = ['.legacyforge', '.lf-borradores', '.lf-change-respaldo'];

// release/* y hotfix/* son ramas de trabajo en muchos equipos (GitFlow):
// no se protegen por defecto. Agrégalas en LF_GUARD_PROTECTED si en tu
// equipo lo son.
const DEFAULT_PROTECTED = '^(main|master|develop|development|trunk)$';

function block(reason) {
  process.stderr.write(`LegacyForge (lf-guard): ${reason}\n`);
  process.exit(2);
}

function grantPath(sessionId) {
  const dir = path.join(os.tmpdir(), 'legacyforge-guard');
  const safe = String(sessionId || 'sin-sesion').replace(/[^\w.-]/g, '_');
  return { dir, file: path.join(dir, `${safe}.apply`) };
}

function hasGrant(sessionId) {
  return fs.existsSync(grantPath(sessionId).file);
}

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function onPrompt(input) {
  const { dir, file } = grantPath(input.session_id);
  if (String(input.prompt ?? '').trim() === 'APPLY') {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, new Date().toISOString());
  } else {
    fs.rmSync(file, { force: true });
  }
}

// Clasifica la herramienta por su nombre, sea cual sea el asistente.
function kindOf(tool) {
  const t = String(tool || '');
  if (/^(Bash|PowerShell)$/.test(t) ||
      /terminal|shell|bash|powershell|run_?command|execute_?command/i.test(t)) {
    return 'shell';
  }
  if (/^Read$/.test(t) || /^(read|view)_?file|read_?notebook/i.test(t)) {
    return 'read';
  }
  if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(t) ||
      /edit|write|create|replace|insert|patch|delete|rename|move/i.test(t)) {
    return 'edit';
  }
  return 'other';
}

const PATH_KEYS = ['file_path', 'filePath', 'path', 'notebook_path',
  'notebookPath', 'uri', 'target_file', 'targetFile'];

// Rutas que toca la herramienta: campos habituales, listas de archivos y
// parches con líneas "*** Update File: ruta".
function pathsOf(ti) {
  const out = [];
  if (!ti || typeof ti !== 'object') return out;
  for (const k of PATH_KEYS) {
    if (typeof ti[k] === 'string' && ti[k]) out.push(ti[k]);
  }
  for (const k of ['files', 'paths', 'filePaths']) {
    if (Array.isArray(ti[k])) {
      for (const f of ti[k]) {
        if (typeof f === 'string') out.push(f);
        else if (f && typeof f === 'object') out.push(...pathsOf(f));
      }
    }
  }
  for (const v of Object.values(ti)) {
    if (typeof v !== 'string') continue;
    for (const m of v.matchAll(/^\*\*\* (?:Update|Add|Delete) File: (.+)$/gm)) {
      out.push(m[1].trim());
    }
  }
  return out.map((p) => p.replace(/^file:\/\//, ''));
}

function commandOf(ti) {
  if (!ti || typeof ti !== 'object') return '';
  for (const k of ['command', 'cmd', 'commandLine', 'script']) {
    if (typeof ti[k] === 'string') return ti[k];
  }
  return '';
}

function debug(input, kind, decision) {
  if (process.env.LF_GUARD_DEBUG !== '1') return;
  try {
    const { dir } = grantPath('x');
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, 'debug.log'),
      `${new Date().toISOString()} ${input.hook_event_name} ` +
      `${input.tool_name ?? '-'} ${kind} ${decision}\n`);
  } catch { /* el registro nunca bloquea */ }
}

function onRead(input) {
  for (const p of pathsOf(input.tool_input)) checkRead(input, p);
}

function checkRead(input, p) {
  if (SECRET_FILE.test(p) && !SECRET_OK.test(p)) {
    debug(input, 'read', 'BLOQUEA');
    block(
      `"${path.basename(p)}" es un archivo de secretos y no se lee. ` +
      'Trabaja con el nombre de la clave, no con su valor, o pide al ' +
      'usuario el dato que no sea secreto.'
    );
  }
}

function onEdit(input) {
  for (const raw of pathsOf(input.tool_input)) checkEdit(input, raw);
}

function checkEdit(input, raw) {
  const cwd = input.cwd || process.cwd();
  const abs = path.resolve(cwd, raw);
  const root = process.env.CLAUDE_PROJECT_DIR || cwd;

  // Fuera del proyecto (planes, notas del asistente): no es asunto del guard.
  if (!isInside(abs, root)) return;

  const parts = path.relative(root, abs).split(/[\\/]/);
  if (EXEMPT_NAMES.has(parts[parts.length - 1])) return;
  if (parts.some((s) => EXEMPT_DIRS.includes(s))) return;
  if (parts.slice(-3).join('/') === '.git/info/exclude') return;

  if (!hasGrant(input.session_id)) {
    debug(input, 'edit', 'BLOQUEA');
    block(
      `no hay un APPLY vigente para editar "${parts.join('/')}". ` +
      'Presenta el cambio propuesto (lf-change: qué cambia, archivos, ' +
      'riesgo, pruebas), termina tu turno y espera a que el usuario ' +
      'escriba exactamente APPLY. No intentes hacer el cambio por otra vía.'
    );
  }
}

const BASH_RULES = [
  [/\bgit\s+push\b[^;|&\n]*\s(--force\S*|-f)(\s|$)/,
    'git push --force reescribe la historia del remoto.'],
  [/\bgit\s+reset\b[^;|&\n]*--hard/,
    'git reset --hard descarta cambios que quizá no son tuyos. ' +
    'Revierte desde el respaldo de lf-change.'],
  [/\bgit\s+add\b[^;|&\n]*\s(-A|--all|\.)(\s|$)/,
    'agrega solo los archivos del cambio, uno por uno (git add <archivo>).'],
  [/\bgit\s+commit\b[^;|&\n"']*\s-[a-zA-Z]*a[a-zA-Z]*(\s|$)/,
    'git commit -a incluye archivos que no son del cambio.'],
  [/\bgit\s+stash\b(?!\s+(list|show))/,
    'git stash esconde cambios que quizá no son tuyos.'],
  [/\bgit\s+clean\b/, 'git clean borra archivos sin seguimiento.'],
  [/\bgit\s+rebase\b/, 'git rebase reescribe historia. Entrégale los ' +
    'comandos al usuario para que los ejecute él.'],
  [/\bgit\s+checkout\s+--\s/, 'git checkout -- descarta cambios ajenos.'],
  [/\bgit\s+restore\b(?![^;|&\n]*--staged)/,
    'git restore sin --staged descarta cambios ajenos.'],
  [/\b(cat|type|more|less|head|tail|Get-Content|gc)\b[^;|&\n]*(\.env(\.local)?\b|secrets\.json|\.(pfx|pem|key|p12)\b)/i,
    'ese comando mostraría un archivo de secretos.'],
];

const BASH_NEEDS_APPLY = [
  [/\bgit\s+branch\b[^;|&\n]*\s-[dD]\b/, 'eliminar una rama'],
  [/\bgit\s+push\b[^;|&\n]*\s(--delete|-d)\b/, 'eliminar una rama remota'],
];

// Quita las opciones globales de git (-C <ruta>, -c clave=valor) para que
// "git -C repo commit" se revise igual que "git commit". Devuelve también
// la carpeta indicada con -C, si la hay.
function normalizeGit(cmd) {
  let dir = null;
  const out = cmd.replace(/\bgit((?:\s+-[Cc]\s+\S+)+)/g, (m, opts) => {
    const c = /-C\s+(\S+)/.exec(opts);
    if (c) dir = c[1].replace(/^["']|["']$/g, '');
    return 'git';
  });
  return { cmd: out, dir };
}

function onBash(input) {
  const { cmd, dir } = normalizeGit(commandOf(input.tool_input));
  for (const [re, why] of BASH_RULES) {
    if (re.test(cmd)) block(`comando no permitido: ${why}`);
  }
  for (const [re, what] of BASH_NEEDS_APPLY) {
    if (re.test(cmd) && !hasGrant(input.session_id)) {
      block(
        `${what} requiere APPLY. Muestra antes qué se pierde y cómo ` +
        'recuperarlo (lf-branch) y espera a que el usuario escriba APPLY.'
      );
    }
  }
  if (/\bgit\s+commit\b/.test(cmd)) {
    const pattern = process.env.LF_GUARD_PROTECTED ?? DEFAULT_PROTECTED;
    if (pattern) {
      let branch = '';
      try {
        branch = execSync('git branch --show-current', {
          cwd: path.resolve(input.cwd || process.cwd(), dir || '.'),
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 5000,
        }).toString().trim();
      } catch { /* sin git o sin rama: no se puede comprobar */ }
      if (branch && new RegExp(pattern).test(branch)) {
        block(
          `no se hace commit en la rama protegida "${branch}". ` +
          'Si el equipo acordó commitear aquí, díselo al usuario: él ajusta LF_GUARD_PROTECTED o confirma a mano. Si no, lf-branch propone la rama del requerimiento.'
        );
      }
    }
  }
}

function main() {
  if (process.env.LF_GUARD_OFF === '1') return;
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    // Entrada ilegible: no se bloquea el trabajo por un fallo del guard.
    process.stderr.write('lf-guard: no pude leer el evento; no se aplicó.\n');
    return;
  }
  const event = input.hook_event_name;
  if (event === 'UserPromptSubmit') return onPrompt(input);
  if (event !== 'PreToolUse') return;
  const kind = kindOf(input.tool_name);
  if (kind === 'read') onRead(input);
  else if (kind === 'shell') onBash(input);
  else if (kind === 'edit') onEdit(input);
  debug(input, kind, 'permite');
}

main();
