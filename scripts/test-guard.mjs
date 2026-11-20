#!/usr/bin/env node
// Pruebas de hooks/lf-guard.mjs con eventos simulados de Claude Code y de
// Copilot. Uso: node scripts/test-guard.mjs
import { spawnSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const GUARD = path.join(ROOT, 'hooks', 'lf-guard.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lf-guard-test-'));
const project = path.join(tmp, 'proyecto');
fs.mkdirSync(project);
execSync('git init -q -b main && git -c user.email=t@t -c user.name=t commit -q --allow-empty -m init', { cwd: project });

let session = 0;
let failures = 0;
let total = 0;

function run(event, env = {}) {
  const r = spawnSync('node', [GUARD], {
    input: typeof event === 'string' ? event : JSON.stringify({ cwd: project, ...event }),
    env: { ...process.env, TMPDIR: tmp, TEMP: tmp, TMP: tmp, CLAUDE_PROJECT_DIR: project, ...env },
    encoding: 'utf8',
  });
  return r.status;
}

const prompt = (sid, text) => run({ hook_event_name: 'UserPromptSubmit', session_id: sid, prompt: text });
const tool = (sid, tool_name, tool_input, env) =>
  run({ hook_event_name: 'PreToolUse', session_id: sid, tool_name, tool_input }, env);

function expect(label, actual, want) {
  total += 1;
  const ok = actual === want;
  if (!ok) failures += 1;
  console.log(`${ok ? 'ok  ' : 'FALLA'} ${label} (salida ${actual}, esperada ${want})`);
}

const ALLOW = 0;
const BLOCK = 2;

// Ediciones y APPLY.
let s = `s${++session}`;
expect('editar sin APPLY se bloquea', tool(s, 'Edit', { file_path: path.join(project, 'src/a.cs') }), BLOCK);
prompt(s, 'APPLY');
expect('editar con APPLY vigente', tool(s, 'Edit', { file_path: path.join(project, 'src/a.cs') }), ALLOW);
expect('Write con APPLY vigente', tool(s, 'Write', { file_path: 'src/b.cs' }), ALLOW);
prompt(s, 'ok, sigue');
expect('el siguiente mensaje retira el APPLY', tool(s, 'Edit', { file_path: 'src/a.cs' }), BLOCK);
for (const bad of ['apply', 'APPLY.', 'APPLY por favor', 'sí', 'dale']) {
  s = `s${++session}`;
  prompt(s, bad);
  expect(`"${bad}" no autoriza`, tool(s, 'Edit', { file_path: 'src/a.cs' }), BLOCK);
}
s = `s${++session}`;
prompt(s, '  APPLY  ');
expect('APPLY con espacios alrededor autoriza', tool(s, 'Edit', { file_path: 'src/a.cs' }), ALLOW);
expect('el APPLY es por sesión', tool(`otra-${session}`, 'Edit', { file_path: 'src/a.cs' }), BLOCK);

// Archivos exentos y fuera del proyecto.
s = `s${++session}`;
for (const f of ['SETUP.md', 'docs/ARCHITECTURE.md', 'AGENTS.md', '.legacyforge/sistema.md',
  '.lf-borradores/PRODUCT.md', '.lf-change-respaldo/a.cs', '.git/info/exclude']) {
  expect(`exento: ${f}`, tool(s, 'Write', { file_path: f }), ALLOW);
}
expect('fuera del proyecto no aplica', tool(s, 'Write', { file_path: path.join(tmp, 'plan.md') }), ALLOW);

// Secretos.
expect('leer .env se bloquea', tool(s, 'Read', { file_path: '.env' }), BLOCK);
expect('leer .env.production se bloquea', tool(s, 'Read', { file_path: 'config/.env.production' }), BLOCK);
expect('leer cert.pfx se bloquea', tool(s, 'Read', { file_path: 'cert.pfx' }), BLOCK);
expect('leer .env.example se permite', tool(s, 'Read', { file_path: '.env.example' }), ALLOW);
expect('leer código se permite', tool(s, 'Read', { file_path: 'src/a.cs' }), ALLOW);
expect('cat .env por terminal se bloquea', tool(s, 'Bash', { command: 'cat .env' }), BLOCK);

// Git destructivo.
for (const cmd of ['git push --force origin x', 'git push -f', 'git reset --hard HEAD~1', 'git add -A',
  'git add .', 'git commit -am "x"', 'git stash', 'git clean -fd', 'git rebase main',
  'git checkout -- a.cs', 'git restore a.cs', 'git -C repo reset --hard']) {
  expect(`bloquea: ${cmd}`, tool(s, 'Bash', { command: cmd }), BLOCK);
}
for (const cmd of ['git status', 'git log --oneline -5', 'git add src/a.cs', 'git restore --staged a.cs',
  'git stash list', 'git diff']) {
  expect(`permite: ${cmd}`, tool(s, 'Bash', { command: cmd }), ALLOW);
}
expect('eliminar rama sin APPLY se bloquea', tool(s, 'Bash', { command: 'git branch -D vieja' }), BLOCK);
prompt(s, 'APPLY');
expect('eliminar rama con APPLY', tool(s, 'Bash', { command: 'git branch -D vieja' }), ALLOW);

// Ramas protegidas.
expect('commit en main se bloquea', tool(s, 'Bash', { command: 'git commit -m "x"' }), BLOCK);
execSync('git switch -q -c feature/PED-1-prueba', { cwd: project });
expect('commit en rama de trabajo se permite', tool(s, 'Bash', { command: 'git commit -m "x"' }), ALLOW);
execSync('git switch -q main', { cwd: project });
expect('LF_GUARD_PROTECTED vacío desactiva la comprobación',
  tool(s, 'Bash', { command: 'git commit -m "x"' }, { LF_GUARD_PROTECTED: '' }), ALLOW);

// Nombres de herramienta de Copilot.
s = `s${++session}`;
expect('Copilot replace_string_in_file sin APPLY', tool(s, 'replace_string_in_file', { filePath: 'src/a.cs' }), BLOCK);
expect('Copilot create_file sin APPLY', tool(s, 'create_file', { filePath: 'src/n.cs' }), BLOCK);
expect('Copilot apply_patch sin APPLY',
  tool(s, 'apply_patch', { input: '*** Begin Patch\n*** Update File: src/a.cs\n@@\n-x\n+y\n*** End Patch' }), BLOCK);
expect('Copilot read_file de .env', tool(s, 'read_file', { filePath: '.env' }), BLOCK);
expect('Copilot run_in_terminal git clean', tool(s, 'run_in_terminal', { command: 'git clean -xdf' }), BLOCK);
prompt(s, 'APPLY');
expect('Copilot replace_string_in_file con APPLY', tool(s, 'replace_string_in_file', { filePath: 'src/a.cs' }), ALLOW);

// Robustez.
expect('LF_GUARD_OFF=1 desactiva', tool(`off-${session}`, 'Edit', { file_path: 'src/a.cs' }, { LF_GUARD_OFF: '1' }), ALLOW);
expect('entrada ilegible no bloquea', run('esto no es json'), ALLOW);
expect('herramienta desconocida pasa', tool(s, 'mcp__algo__consulta', { q: 1 }), ALLOW);

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${total - failures}/${total} casos correctos`);
process.exit(failures ? 1 : 0);
