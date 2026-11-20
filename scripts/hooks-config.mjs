#!/usr/bin/env node
// Agrega o quita los hooks de lf-guard en un settings.json de Claude Code,
// sin tocar el resto del archivo. Lo usan install.sh e install.ps1.
//
//   node hooks-config.mjs merge  <settings.json> '<comando>'
//   node hooks-config.mjs remove <settings.json>
//
// Es idempotente: antes de agregar, quita cualquier entrada cuyo comando
// llame a lf-guard.mjs.

import fs from 'node:fs';
import path from 'node:path';

const [action, file, command] = process.argv.slice(2);
const MATCHER = 'Edit|Write|MultiEdit|NotebookEdit|Read|Bash|PowerShell';
const isGuard = (h) => typeof h?.command === 'string' && h.command.includes('lf-guard.mjs');

if (!['merge', 'remove'].includes(action) || !file || (action === 'merge' && !command)) {
  console.error('uso: hooks-config.mjs merge <settings.json> <comando> | remove <settings.json>');
  process.exit(1);
}

let settings = {};
if (fs.existsSync(file)) {
  const raw = fs.readFileSync(file, 'utf8').trim();
  if (raw) {
    try {
      settings = JSON.parse(raw);
    } catch (e) {
      console.error(`error: ${file} no es JSON válido (${e.message}). No lo modifiqué.`);
      process.exit(1);
    }
  }
} else if (action === 'remove') {
  process.exit(0);
}

settings.hooks ??= {};

// Quita las entradas de lf-guard que ya existan.
for (const event of Object.keys(settings.hooks)) {
  const groups = Array.isArray(settings.hooks[event]) ? settings.hooks[event] : [];
  const kept = [];
  for (const group of groups) {
    if (Array.isArray(group?.hooks)) {
      const hooks = group.hooks.filter((h) => !isGuard(h));
      if (hooks.length) kept.push({ ...group, hooks });
    } else if (!isGuard(group)) {
      kept.push(group);
    }
  }
  if (kept.length) settings.hooks[event] = kept;
  else delete settings.hooks[event];
}

if (action === 'merge') {
  const hook = { type: 'command', command };
  (settings.hooks.UserPromptSubmit ??= []).push({ hooks: [hook] });
  (settings.hooks.PreToolUse ??= []).push({ matcher: MATCHER, hooks: [{ ...hook }] });
}

if (!Object.keys(settings.hooks).length) delete settings.hooks;

if (action === 'remove' && !Object.keys(settings).length) {
  // Solo quedaban nuestros hooks: el archivo lo creó el instalador.
  fs.rmSync(file, { force: true });
  process.exit(0);
}

// Respaldo del archivo del usuario antes de agregar los hooks.
if (action === 'merge' && fs.existsSync(file)) fs.copyFileSync(file, `${file}.lf-bak`);
fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n');
