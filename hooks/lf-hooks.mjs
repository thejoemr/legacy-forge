#!/usr/bin/env node
// LegacyForge 1.0.0 · hooks
//
// Reglas que se cumplen fuera del modelo, aunque el modelo se equivoque.
// Un solo script para Claude Code y GitHub Copilot (formato compatible).
// Lee el evento en JSON por stdin; sale con 0 para permitir y con 2 para
// bloquear (el texto de stderr le llega al asistente como motivo).
//
//   UserPromptSubmit  lf-guard-apply (registra el APPLY)
//   PreToolUse        lf-guard-agentes, lf-guard-secretos, lf-guard-git,
//                     lf-guard-produccion, lf-guard-apply, lf-respaldo
//   PostToolUse       lf-formato, lf-salidas, lf-guard-secretos (aviso)
//   SubagentStop      lf-informe
//   SessionStart      lf-inicio
//   Stop              lf-cierre
//
// Registrador de salidas (parte de lf-salidas), para el asistente:
//   node lf-hooks.mjs salida -- <comando>
//
// --solo-preparados: lo agrega la instalación a nivel de usuario y el
// plugin. Los hooks actúan solo en proyectos preparados con LegacyForge
// (con carpeta .legacyforge/ o con el bloque de LegacyForge en AGENTS.md);
// en los demás proyectos no hacen nada.
//
// Variables:
//   LF_HOOKS_OFF=1        desactiva todo.
//   LF_HOOKS_DEBUG=1      anota cada decisión en <tmp>/legacyforge/debug.log.
//   LF_HOME=<ruta>        carpeta de memoria fuera del proyecto.
//   LF_PRODUCCION=a,b     nombres de servidores o bases de producción,
//                         además de los de config.json.
//   LF_RAMAS_PROTEGIDAS   regex; vacío desactiva la comprobación.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

// ---------------------------------------------------------------- base

const TMP = path.join(os.tmpdir(), 'legacyforge');
const APPLY_RE = /^APPLY(\s+con\s+mejora)?$/;
const DEFAULT_PROTECTED = '^(main|master|develop|development|trunk)$';
const SALIDA_LARGA = 80; // líneas

function block(reason) {
  process.stderr.write(`LegacyForge: ${reason}\n`);
  process.exit(2);
}

function debug(hook, detail) {
  if (process.env.LF_HOOKS_DEBUG !== '1') return;
  try {
    fs.mkdirSync(TMP, { recursive: true });
    fs.appendFileSync(path.join(TMP, 'debug.log'),
      `${new Date().toISOString()} ${hook} ${detail}\n`);
  } catch { /* el registro nunca bloquea */ }
}

function safeName(s) {
  return String(s || 'sin-sesion').replace(/[^\w.-]/g, '_');
}

function projectRoot(input) {
  return path.resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
}

function lfDir(root) {
  if (process.env.LF_HOME) return path.resolve(process.env.LF_HOME);
  return path.join(root, '.legacyforge');
}

function config(root) {
  try {
    return JSON.parse(fs.readFileSync(path.join(lfDir(root), 'config.json'), 'utf8'));
  } catch { return {}; }
}

function git(cmd, cwd) {
  try {
    return execSync(`git ${cmd}`, {
      cwd, stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000,
    }).toString();
  } catch { return null; }
}

function branchOf(root) {
  const b = git('branch --show-current', root);
  return b && b.trim() ? b.trim() : null;
}

function caseDir(root) {
  const b = branchOf(root);
  return safeName(b ? b.replace(/\//g, '_') : 'sin-rama');
}

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

// Un subagente se reconoce por los campos que agrega el asistente al
// evento, o por la ruta de su transcripción.
function isSubagent(input) {
  if (input.agent_id || input.agent_type) return true;
  const t = String(input.transcript_path || '');
  return /[\\/]subagents[\\/]/.test(t);
}

// Clasifica la herramienta por su nombre, sea cual sea el asistente.
function kindOf(tool) {
  const t = String(tool || '');
  if (/^(Bash|PowerShell)$/.test(t) ||
      /terminal|shell|bash|powershell|run_?command|execute_?command|runCommands/i.test(t)) {
    return 'shell';
  }
  if (/^(Read|Grep|Glob|LS)$/.test(t) || /^(read|view)_?file|read_?notebook|^search|codebase/i.test(t)) {
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

function outputOf(tr) {
  if (tr == null) return '';
  if (typeof tr === 'string') return tr;
  const parts = [];
  for (const k of ['stdout', 'stderr', 'output', 'content', 'result']) {
    if (typeof tr[k] === 'string') parts.push(tr[k]);
  }
  if (tr.file && typeof tr.file.content === 'string') parts.push(tr.file.content);
  return parts.length ? parts.join('\n') : JSON.stringify(tr);
}

// Quita las opciones globales de git (-C ruta, -c clave=valor).
function normalizeGit(cmd) {
  let dir = null;
  const out = cmd.replace(/\bgit((?:\s+-[Cc]\s+\S+)+)/g, (m, opts) => {
    const c = /-C\s+(\S+)/.exec(opts);
    if (c) dir = c[1].replace(/^["']|["']$/g, '');
    return 'git';
  });
  return { cmd: out, dir };
}

// ------------------------------------------------------- lf-guard-apply

function grantFile(sessionId) {
  return path.join(TMP, `${safeName(sessionId)}.apply`);
}

function hasGrant(input) {
  return fs.existsSync(grantFile(input.session_id));
}

function guardApplyPrompt(input) {
  const file = grantFile(input.session_id);
  if (APPLY_RE.test(String(input.prompt ?? '').trim())) {
    fs.mkdirSync(TMP, { recursive: true });
    fs.writeFileSync(file, new Date().toISOString());
    debug('lf-guard-apply', 'APPLY registrado');
  } else {
    fs.rmSync(file, { force: true });
  }
}

// Rutas que el asistente escribe sin APPLY: su memoria y su expediente.
function exempt(abs, root) {
  return isInside(abs, lfDir(root));
}

function guardApplyEdit(input, abs, root) {
  if (exempt(abs, root)) return;
  if (!hasGrant(input)) {
    debug('lf-guard-apply', `BLOQUEA ${abs}`);
    block(
      `no hay un APPLY vigente para modificar "${path.relative(root, abs)}". ` +
      'Presenta el cambio propuesto (lf-cambio), termina tu turno y espera ' +
      'a que el humano escriba exactamente APPLY. No lo intentes por otra vía.'
    );
  }
}

// Comandos de terminal que escriben en archivos del proyecto.
const SHELL_WRITES = [
  /\bsed\s+(-[a-zA-Z]*i|--in-place)/,
  /(^|[\s;|&])(rm|del|erase|rmdir|mv|move|cp|copy|xcopy|robocopy|ren|rename|touch|truncate|mkdir|md)\s/i,
  /\b(Remove-Item|Move-Item|Copy-Item|Rename-Item|Set-Content|Add-Content|Out-File|New-Item|Clear-Content)\b/i,
  /\btee\s/,
  /\biconv\b[^;|&\n]*\s-o\s/,
  /\bgit\s+(switch\s+-c|checkout\s+-b|branch\s+(?!-)\S|apply|am|merge|cherry-pick|revert|mv|rm)\b/,
];

function unquote(cmd) {
  return cmd.replace(/'[^']*'/g, "''").replace(/"(?:[^"\\]|\\.)*"/g, '""');
}

function redirectTargets(raw) {
  const cmd = unquote(raw);
  const out = [];
  for (const m of cmd.matchAll(/(?:^|[^0-9&>])(?:[0-9])?>{1,2}\s*([^\s&|;<>]+)/g)) {
    out.push(m[1].replace(/^["']|["']$/g, ''));
  }
  return out.filter((t) => t && !/^(\/dev\/null|NUL|\$null|&\d)$/i.test(t));
}

function guardApplyShell(input, cmd, root) {
  const cwd = path.resolve(input.cwd || root);
  const targets = redirectTargets(cmd)
    .map((t) => path.resolve(cwd, t))
    .filter((abs) => isInside(abs, root) && !exempt(abs, root));
  const bare = unquote(cmd);
  const writes = targets.length > 0 || SHELL_WRITES.some((re) => re.test(bare));
  if (!writes || hasGrant(input)) return;
  // Comandos que solo escriben en la carpeta del asistente.
  if (targets.length === 0 && cmd.includes(path.basename(lfDir(root))) &&
      !/\b(rm|del|Remove-Item)\b/i.test(cmd)) return;
  debug('lf-guard-apply', `BLOQUEA shell ${cmd}`);
  block(
    'ese comando modifica archivos y no hay un APPLY vigente. Inclúyelo en ' +
    'el cambio propuesto y espera a que el humano escriba APPLY.'
  );
}

// ---------------------------------------------------- lf-guard-agentes

const AGENT_READ_CMDS = new Set([
  'ls', 'dir', 'cat', 'type', 'head', 'tail', 'wc', 'grep', 'egrep',
  'fgrep', 'rg', 'findstr', 'find', 'file', 'stat', 'sort', 'uniq',
  'cut', 'tr', 'echo', 'pwd', 'tree', 'less', 'more', 'xxd', 'od',
  'hexdump', 'iconv', 'jq', 'diff', 'cmp', 'basename', 'dirname',
  'realpath', 'which', 'where', 'whoami', 'date', 'nl', 'column',
  'get-childitem', 'gci', 'get-content', 'gc', 'select-string', 'sls',
  'get-item', 'gi', 'measure-object', 'test-path', 'resolve-path',
  'format-hex', 'get-filehash', 'select-object', 'where-object',
  'cd', 'set-location', 'pushd', 'popd', 'true',
]);
const AGENT_GIT_SUBS = new Set([
  'log', 'show', 'blame', 'diff', 'status', 'rev-parse', 'ls-files',
  'grep', 'describe', 'shortlog', 'cat-file', 'ls-tree', 'annotate',
  'whatchanged', 'rev-list', 'name-rev', 'merge-base', 'reflog',
]);

function agentShellProblem(raw) {
  const { cmd: full } = normalizeGit(raw);
  if (/`|\$\(/.test(full)) return 'sustitución de comandos';
  if (redirectTargets(full).length) return 'redirección a un archivo';
  const cmd = unquote(full)
    .replace(/\d*>&\d/g, '')
    .replace(/\d*>{1,2}\s*(\/dev\/null|NUL|\$null)/gi, '');
  const segs = cmd.split(/\|\||&&|[|;&\n]/).map((s) => s.trim()).filter(Boolean);
  for (const seg of segs) {
    const words = seg.replace(/^(\w+=\S+\s+)+/, '').split(/\s+/);
    const first = (words[0] || '').replace(/^.*[\\/]/, '').toLowerCase();
    if (first === 'git') {
      const sub = words.find((w, i) => i > 0 && !w.startsWith('-'));
      if (sub === 'branch' && !/\s-[dDmMcC]\b|--delete|--move|--copy/.test(seg) &&
          !/branch\s+(?!-)\S/.test(seg)) continue;
      if (sub === 'remote' && !/remote\s+(add|remove|rm|rename|set-url|prune)/.test(seg)) continue;
      if (sub === 'stash' && /stash\s+(list|show)/.test(seg)) continue;
      if (sub === 'config' && /--get|--list|\s-l\b/.test(seg)) continue;
      if (!AGENT_GIT_SUBS.has(sub)) return `git ${sub || ''}`.trim();
      continue;
    }
    if (first === 'find' && /\s-(delete|exec|execdir|ok|fprint|fprintf|fls)\b/.test(seg)) {
      return 'find con acción';
    }
    if (first === 'iconv' && /\s-o\s/.test(seg)) return 'iconv -o';
    if (!AGENT_READ_CMDS.has(first)) return first || 'comando vacío';
  }
  return null;
}

function guardAgentes(input, kind) {
  if (!isSubagent(input)) return;
  if (kind === 'edit') {
    debug('lf-guard-agentes', `BLOQUEA edit ${input.tool_name}`);
    block(
      'los agentes de LegacyForge no escriben. Pon el cambio, el borrador o ' +
      'la nota en tu informe; el asistente decide con el humano.'
    );
  }
  if (kind === 'shell') {
    const why = agentShellProblem(commandOf(input.tool_input));
    if (why) {
      debug('lf-guard-agentes', `BLOQUEA shell ${why}`);
      block(
        `los agentes solo usan comandos de lectura (${why} no lo es). ` +
        'Si hace falta ejecutar algo, redáctalo en "Para decidir".'
      );
    }
  }
}

// --------------------------------------------------- lf-guard-secretos

const SECRET_FILE =
  /(^|[\\/])(\.env(\.[\w.-]+)?|secrets?\.(json|ya?ml)|id_(rsa|dsa|ecdsa|ed25519)|[^\\/]*\.(pfx|pem|key|p12|jks|keystore)|\.npmrc|\.pgpass|credentials(\.json)?)$/i;
const SECRET_OK = /\.env\.(example|sample|template|dist)$/i;

function isSecretPath(p) {
  return SECRET_FILE.test(p) && !SECRET_OK.test(p);
}

function guardSecretosRead(input) {
  for (const p of pathsOf(input.tool_input)) {
    if (isSecretPath(p)) {
      debug('lf-guard-secretos', `BLOQUEA ${p}`);
      block(
        `"${path.basename(p)}" es un archivo de secretos y no se lee. ` +
        'Trabaja con el nombre de la clave, no con su valor.'
      );
    }
  }
}

function guardSecretosShell(cmd) {
  const tokens = cmd.split(/[\s"'|;&<>():=]+/).filter(Boolean);
  const hit = tokens.find((t) => isSecretPath(t));
  if (hit && /\b(cat|type|more|less|head|tail|Get-Content|gc|grep|rg|findstr|Select-String|sls|sed|awk|cp|copy|base64|xxd|od|strings|bat|nl)\b|\bgit\s+(show|diff|log|blame)\b/i.test(cmd)) {
    debug('lf-guard-secretos', `BLOQUEA shell ${hit}`);
    block(`ese comando mostraría o copiaría "${path.basename(hit)}", un archivo de secretos.`);
  }
}

const SECRET_VALUE = [
  ['contraseña en cadena de conexión', /\b(password|pwd)\s*=\s*[^;'"\s]{3,}/gi],
  ['llave privada', /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(-----END [A-Z ]*PRIVATE KEY-----|$)/g],
  ['llave de AWS', /\bAKIA[0-9A-Z]{16}\b/g],
  ['token de GitHub', /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g],
  ['token bearer', /\bBearer\s+[A-Za-z0-9._~+/-]{20,}=*/g],
  ['secreto asignado', /\b(api[_-]?key|secret|client[_-]?secret|access[_-]?token)\b\s*[:=]\s*["']?[A-Za-z0-9._~+/-]{12,}/gi],
];

function findSecrets(text) {
  const kinds = new Set();
  for (const [name, re] of SECRET_VALUE) {
    re.lastIndex = 0;
    if (re.test(text)) kinds.add(name);
  }
  return [...kinds];
}

function maskSecrets(text) {
  let out = text;
  for (const [, re] of SECRET_VALUE) {
    re.lastIndex = 0;
    out = out.replace(re, (m) => {
      const eq = m.search(/[=:]\s*|\s+/);
      return eq > 0 && eq < 20 ? `${m.slice(0, eq + 1)}****` : '****';
    });
  }
  return out;
}

// -------------------------------------------------------- lf-guard-git

const GIT_RULES = [
  [/\bgit\s+push\b[^;|&\n]*\s(--force\S*|-f)(\s|$)/, 'git push --force reescribe la historia del remoto.'],
  [/\bgit\s+reset\b[^;|&\n]*--hard/, 'git reset --hard descarta cambios que quizá no son tuyos. Revierte desde el respaldo.'],
  [/\bgit\s+add\b[^;|&\n]*\s(-A|--all|\.|\*)(\s|$)/, 'agrega solo los archivos del cambio, uno por uno.'],
  [/\bgit\s+commit\b[^;|&\n"']*\s-[a-zA-Z]*a[a-zA-Z]*(\s|$)/, 'git commit -a incluye archivos que no son del cambio.'],
  [/\bgit\s+commit\b[^;|&\n]*--amend/, 'git commit --amend reescribe un commit.'],
  [/\bgit\s+stash\b(?!\s+(list|show))/, 'git stash esconde cambios que quizá no son tuyos.'],
  [/\bgit\s+clean\b/, 'git clean borra archivos sin seguimiento.'],
  [/\bgit\s+rebase\b/, 'git rebase reescribe historia. Dale los comandos al humano.'],
  [/\bgit\s+checkout\s+(--\s|\.(\s|$))/, 'git checkout -- descarta cambios ajenos.'],
  [/\bgit\s+restore\b(?![^;|&\n]*--staged)/, 'git restore sin --staged descarta cambios ajenos.'],
  [/\bgit\s+filter-(branch|repo)\b/, 'reescribe la historia completa.'],
  [/\bgit\s+update-ref\s+-d\b/, 'borra referencias.'],
];

const GIT_NEEDS_APPLY = [
  [/\bgit\s+branch\b[^;|&\n]*\s(-[dD]|--delete)\b/, 'eliminar una rama'],
  [/\bgit\s+push\b[^;|&\n]*\s(--delete|-d)\b/, 'eliminar una rama remota'],
  [/\bgit\s+push\b[^;|&\n]*\s:\S/, 'eliminar una rama remota'],
];

function guardGit(input, raw, root) {
  const { cmd, dir } = normalizeGit(raw);
  if (!/\bgit\b/.test(cmd)) return;
  for (const [re, why] of GIT_RULES) {
    if (re.test(cmd)) block(`comando de git no permitido: ${why}`);
  }
  for (const [re, what] of GIT_NEEDS_APPLY) {
    if (re.test(cmd) && !hasGrant(input)) {
      block(`${what} requiere APPLY. Di antes qué se pierde y cómo recuperarlo.`);
    }
  }
  if (/\bgit\s+commit\b/.test(cmd)) {
    const pattern = process.env.LF_RAMAS_PROTEGIDAS ??
      config(root).ramasProtegidas ?? DEFAULT_PROTECTED;
    if (!pattern) return;
    const cwd = path.resolve(input.cwd || root, dir || '.');
    const branch = branchOf(cwd);
    if (branch && new RegExp(pattern).test(branch)) {
      block(
        `no se hace commit en la rama protegida "${branch}". Propón la rama ` +
        'del requerimiento (lf-versiones). Si el equipo commitea aquí, el ' +
        'humano ajusta ramasProtegidas en config.json.'
      );
    }
  }
}

// -------------------------------------------------- lf-guard-produccion

function produccion(root) {
  const fromCfg = Array.isArray(config(root).produccion) ? config(root).produccion : [];
  const fromEnv = (process.env.LF_PRODUCCION || '').split(',');
  return [...fromCfg, ...fromEnv].map((s) => String(s).trim()).filter((s) => s.length >= 3);
}

function guardProduccion(input, root) {
  const names = produccion(root);
  if (!names.length) return;
  const text = JSON.stringify(input.tool_input || {}).toLowerCase();
  for (const n of names) {
    const esc = n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`(^|[^\\w-])${esc}([^\\w-]|$)`).test(text)) {
      debug('lf-guard-produccion', `BLOQUEA ${n}`);
      block(
        `"${n}" está marcado como producción. El asistente no ejecuta nada ` +
        'contra producción: prepara la consulta o el script para que lo ' +
        'ejecute el responsable.'
      );
    }
  }
}

// ---------------------------------------------------------- lf-respaldo

function backupRoot(root) {
  return path.join(lfDir(root), 'respaldo', caseDir(root));
}

function respaldo(abs, root) {
  if (exempt(abs, root) || !isInside(abs, root)) return;
  const rel = path.relative(root, abs);
  if (rel.split(/[\\/]/)[0] === '.git') return;
  const dest = path.join(backupRoot(root), rel);
  if (fs.existsSync(dest) || fs.existsSync(`${dest}.nuevo`)) return; // se conserva el original
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      fs.copyFileSync(abs, dest);
      fs.appendFileSync(path.join(backupRoot(root), 'indice.txt'),
        `${new Date().toISOString()}\tmodificado\t${rel}\n`);
    } else {
      fs.writeFileSync(`${dest}.nuevo`, '');
      fs.appendFileSync(path.join(backupRoot(root), 'indice.txt'),
        `${new Date().toISOString()}\tnuevo\t${rel}\n`);
    }
    debug('lf-respaldo', rel);
  } catch (e) {
    block(`no pude respaldar "${rel}" (${e.code || e.message}); no se modifica sin respaldo.`);
  }
}

// ----------------------------------------------------------- lf-formato

function profile(buf) {
  const bom = buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf ? 'UTF-8 con BOM'
    : buf[0] === 0xff && buf[1] === 0xfe ? 'UTF-16 LE'
    : buf[0] === 0xfe && buf[1] === 0xff ? 'UTF-16 BE' : null;
  const s = buf.toString('latin1');
  const crlf = (s.match(/\r\n/g) || []).length;
  const lf = (s.match(/(?<!\r)\n/g) || []).length;
  const eol = crlf && lf ? 'mixto' : crlf ? 'CRLF' : lf ? 'LF' : 'sin saltos';
  let enc = bom;
  if (!enc) {
    const high = buf.some((b) => b > 0x7f);
    if (!high) enc = 'ASCII';
    else enc = Buffer.from(buf.toString('utf8'), 'utf8').equals(buf) ? 'UTF-8' : 'un byte (Windows-1252 o ISO-8859-1)';
  }
  return { enc, eol };
}

function formato(input, root) {
  for (const raw of pathsOf(input.tool_input)) {
    const abs = path.resolve(input.cwd || root, raw);
    if (!isInside(abs, root) || exempt(abs, root)) continue;
    const orig = path.join(backupRoot(root), path.relative(root, abs));
    if (!fs.existsSync(orig) || !fs.existsSync(abs)) continue;
    const a = profile(fs.readFileSync(orig));
    const b = profile(fs.readFileSync(abs));
    const changes = [];
    if (a.enc !== b.enc && !(a.enc === 'ASCII' && b.enc === 'UTF-8')) {
      changes.push(`codificación ${a.enc} → ${b.enc}`);
    }
    if (a.eol !== b.eol && a.eol !== 'sin saltos') changes.push(`fin de línea ${a.eol} → ${b.eol}`);
    if (changes.length) {
      debug('lf-formato', `${raw}: ${changes.join(', ')}`);
      block(
        `"${path.relative(root, abs)}" cambió de formato: ${changes.join('; ')}. ` +
        `Restaura desde \`${path.relative(root, orig)}\` y aplica el cambio ` +
        'conservando el formato (lf-legado), o explícaselo al humano.'
      );
    }
  }
}

// ---------------------------------------------------------- lf-salidas

function salidasDir(root) {
  return path.join(lfDir(root), 'expediente', caseDir(root), 'salidas');
}

function saveOutput(root, cmd, text) {
  const dir = salidasDir(root);
  fs.mkdirSync(dir, { recursive: true });
  const slug = cmd.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'salida';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const file = path.join(dir, `${stamp}-${slug}.txt`);
  fs.writeFileSync(file, `$ ${maskSecrets(cmd)}\n\n${maskSecrets(text)}`);
  return file;
}

function context(event, text) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: event, additionalContext: text },
  }));
}

function postTool(input, kind, root) {
  const notes = [];
  const out = outputOf(input.tool_response);
  const secrets = findSecrets(out);
  if (secrets.length) {
    notes.push(
      `La salida contiene un posible secreto (${secrets.join(', ')}). No lo ` +
      'repitas, no lo guardes y dile al humano en una línea que conviene ' +
      'rotarlo, sin mostrar el valor.'
    );
  }
  if (kind === 'shell' && !isSubagent(input)) {
    const lines = out.split('\n').length;
    if (lines > SALIDA_LARGA) {
      try {
        const file = saveOutput(root, commandOf(input.tool_input), out);
        notes.push(
          `Salida de ${lines} líneas guardada en \`${path.relative(root, file)}\`. ` +
          'Para analizarla, encárgasela a lf-lector-evidencia; no la copies ' +
          'al humano. La próxima vez usa el registrador: ' +
          '`node <hooks>/lf-hooks.mjs salida -- <comando>`.'
        );
      } catch { /* sin expediente: no se guarda */ }
    }
  }
  if (notes.length) context('PostToolUse', notes.join('\n'));
}

function runSalida(argv) {
  const i = argv.indexOf('--');
  const cmd = (i >= 0 ? argv.slice(i + 1) : argv).join(' ');
  if (!cmd) {
    process.stderr.write('uso: lf-hooks.mjs salida -- <comando>\n');
    process.exit(1);
  }
  const root = path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
  const r = spawnSync(cmd, { shell: true, cwd: process.cwd(), encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  const text = `${r.stdout || ''}${r.stderr ? `\n[stderr]\n${r.stderr}` : ''}`;
  const file = saveOutput(root, cmd, text);
  const lines = text.split('\n');
  const tail = maskSecrets(lines.slice(-15).join('\n'));
  process.stdout.write(
    `código de salida: ${r.status ?? 'sin código'} · ${lines.length} líneas\n` +
    `salida completa: ${path.relative(root, file)}\n` +
    `últimas líneas:\n${tail}\n`
  );
  process.exit(r.status ?? 1);
}

// ----------------------------------------------------------- lf-informe

const REQUIRED = ['Respuesta', 'Evidencia', 'Confianza', 'No revisado', 'Para decidir'];

function lastAssistantText(input) {
  if (typeof input.last_assistant_message === 'string') return input.last_assistant_message;
  const file = input.agent_transcript_path || input.transcript_path;
  if (!file || !fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const e = JSON.parse(lines[i]);
      const msg = e.message || e;
      if ((e.type || msg.role) !== 'assistant') continue;
      const c = msg.content;
      const text = typeof c === 'string' ? c
        : Array.isArray(c) ? c.filter((x) => x.type === 'text').map((x) => x.text).join('\n') : '';
      if (text.trim()) return text;
    } catch { /* línea ilegible */ }
  }
  return null;
}

function norm(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function informe(input) {
  if (input.stop_hook_active) return;
  const type = String(input.agent_type || input.subagent_type || '');
  if (type && !type.startsWith('lf-')) return; // solo agentes de LegacyForge
  const text = lastAssistantText(input);
  if (!text) return;
  const t = norm(text);
  const missing = REQUIRED.filter((h) => !new RegExp(`^#+\\s*${norm(h)}\\b`, 'm').test(t));
  if (!type && missing.length === REQUIRED.length) return; // no parece informe lf-
  if (missing.length) {
    debug('lf-informe', `faltan ${missing.join(', ')}`);
    process.stdout.write(JSON.stringify({
      decision: 'block',
      reason: `Tu informe no está completo: faltan ${missing.map((m) => `"## ${m}"`).join(', ')}. ` +
        'Agrégalos (si no aplica, escribe "nada") y termina.',
    }));
  }
}

// ------------------------------------------------------------ lf-inicio

function inicio(input) {
  const root = projectRoot(input);
  const lf = lfDir(root);
  const lines = ['LegacyForge: carga la skill lf-asistente y síguela.'];
  const branch = branchOf(root);
  if (branch !== null || git('rev-parse --git-dir', root)) {
    const dirty = (git('status --porcelain', root) || '').trim().split('\n').filter(Boolean).length;
    lines.push(`Rama: ${branch || '(sin rama)'}; archivos con cambios sin commit: ${dirty}.`);
  } else {
    lines.push('Sin git: el respaldo es la única vuelta atrás.');
  }
  if (!fs.existsSync(lf)) {
    lines.push('Sin memoria: proyecto no preparado (sugiere /lf-iniciar si el humano empieza).');
    return process.stdout.write(lines.join('\n') + '\n');
  }
  const exp = path.join(lf, 'expediente', caseDir(root));
  if (fs.existsSync(exp)) {
    const n = fs.existsSync(path.join(exp, 'informes')) ? fs.readdirSync(path.join(exp, 'informes')).length : 0;
    lines.push(`Expediente abierto de esta rama: ${path.relative(root, exp)} (${n} informes). Léelo por partes antes de relanzar agentes.`);
  }
  const ses = path.join(lf, 'memoria', 'sesiones.md');
  if (fs.existsSync(ses)) {
    const entries = fs.readFileSync(ses, 'utf8').split(/\n(?=### )/);
    const last = entries[entries.length - 1].trim().split('\n').slice(0, 6).join('\n');
    if (last) lines.push(`Última sesión:\n${last}`);
  }
  const dec = path.join(lf, 'memoria', 'decisiones.md');
  if (fs.existsSync(dec)) {
    const text = fs.readFileSync(dec, 'utf8');
    const vig = (text.match(/^Estado:\s*vigente/gim) || []).length;
    const cum = text.split(/\n(?=### )/).filter((e) => /^Estado:\s*se[ñn]al cumplida/im.test(e))
      .map((e) => e.split('\n')[0].replace(/^###\s*/, ''));
    if (vig) lines.push(`Decisiones vigentes con señal de revisión: ${vig} (memoria/decisiones.md).`);
    if (cum.length) lines.push(`Señal cumplida, pendiente de presentar al humano: ${cum.join('; ')}.`);
  }
  process.stdout.write(lines.join('\n') + '\n');
}

// ------------------------------------------------------------ lf-cierre

function cierre(input) {
  if (input.stop_hook_active) return;
  const root = projectRoot(input);
  const items = [];
  const idx = path.join(backupRoot(root), 'indice.txt');
  if (fs.existsSync(idx)) {
    const own = new Set(fs.readFileSync(idx, 'utf8').trim().split('\n')
      .map((l) => l.split('\t')[2]).filter(Boolean));
    const dirty = (git('status --porcelain', root) || '').split('\n')
      .map((l) => l.slice(3).trim().replace(/^"|"$/g, '')).filter((f) => own.has(f));
    if (dirty.length) items.push(`${dirty.length} archivo(s) que modificaste siguen sin commit: ${dirty.slice(0, 5).join(', ')}`);
  }
  const pend = path.join(lfDir(root), 'expediente', caseDir(root), 'pendientes.md');
  if (fs.existsSync(pend)) {
    const open = (fs.readFileSync(pend, 'utf8').match(/^\s*- \[ \]/gm) || []).length;
    if (open) items.push(`${open} pendiente(s) en pendientes.md (memoria propuesta, sugerencias u oportunidades)`);
  }
  if (!items.length) return;
  const sig = items.join('|');
  const sigFile = path.join(TMP, `${safeName(input.session_id)}.cierre`);
  try {
    if (fs.existsSync(sigFile) && fs.readFileSync(sigFile, 'utf8') === sig) return;
    fs.mkdirSync(TMP, { recursive: true });
    fs.writeFileSync(sigFile, sig);
  } catch { return; }
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: 'Antes de terminar, si no lo dijiste ya en este turno, menciónale al ' +
      `humano en una línea lo que queda: ${items.join('; ')}. No hagas commit ni ` +
      'guardes memoria sin que él lo pida. Si ya lo dijiste, termina.',
  }));
}

// --------------------------------------------------------------- main

function preTool(input) {
  const root = projectRoot(input);
  const kind = kindOf(input.tool_name);
  guardAgentes(input, kind);
  if (kind === 'read') guardSecretosRead(input);
  if (kind === 'shell') {
    const cmd = commandOf(input.tool_input);
    guardSecretosShell(cmd);
    guardGit(input, cmd, root);
    guardProduccion(input, root);
    if (!isSubagent(input)) guardApplyShell(input, cmd, root);
  }
  if (kind === 'other') guardProduccion(input, root);
  if (kind === 'edit') {
    for (const raw of pathsOf(input.tool_input)) {
      const abs = path.resolve(input.cwd || root, raw);
      if (!isInside(abs, root)) continue; // fuera del proyecto: no es asunto del guard
      if (isSecretPath(abs)) block(`"${path.basename(abs)}" es un archivo de secretos; no se modifica desde el asistente.`);
      guardApplyEdit(input, abs, root);
      respaldo(abs, root);
    }
  }
  debug('PreToolUse', `${input.tool_name} ${kind} permite`);
}

function prepared(root) {
  if (fs.existsSync(lfDir(root))) return true;
  try {
    return fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8').includes('<!-- legacyforge:inicio');
  } catch { return false; }
}

function main() {
  if (process.argv[2] === 'salida') return runSalida(process.argv.slice(3));
  if (process.env.LF_HOOKS_OFF === '1') return;
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.stderr.write('LegacyForge: no pude leer el evento; el hook no se aplicó.\n');
    return;
  }
  if (process.argv.includes('--solo-preparados') && !prepared(projectRoot(input))) return;
  const event = input.hook_event_name;
  if (event === 'UserPromptSubmit') return guardApplyPrompt(input);
  if (event === 'PreToolUse') return preTool(input);
  if (event === 'PostToolUse') {
    const root = projectRoot(input);
    const kind = kindOf(input.tool_name);
    if (kind === 'edit' && !isSubagent(input)) formato(input, root);
    return postTool(input, kind, root);
  }
  if (event === 'SubagentStop') return informe(input);
  if (event === 'SessionStart') return inicio(input);
  if (event === 'Stop') return cierre(input);
}

main();
