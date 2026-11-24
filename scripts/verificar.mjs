// Revisa la coherencia del paquete. Uso: node scripts/verificar.mjs
// - Cada skill tiene SKILL.md con name igual a su carpeta y description.
// - Totales: 1 núcleo, 40 skills, 4 puntos de entrada, 13 agentes, 11 hooks, 9 plantillas.
// - Las skills de cada agente existen, y la línea "Usada por" de cada
//   skill coincide con los agentes que la cargan.
// - Toda mención `lf-…` apunta a una pieza que existe.
// - Las rutas relativas `../lf-asistente/…` existen.
// - Presupuesto de descripciones de las skills que el modelo puede invocar.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warn = [];
const err = (m) => errors.push(m);

const ENTRADAS = ['lf-ayuda', 'lf-iniciar', 'lf-revisar', 'lf-cerrar'];
const HOOKS = ['lf-guard-apply', 'lf-guard-agentes', 'lf-guard-secretos', 'lf-guard-git',
  'lf-guard-produccion', 'lf-respaldo', 'lf-formato', 'lf-salidas', 'lf-informe',
  'lf-inicio', 'lf-cierre'];
const PLANTILLAS = ['lf-plantilla-encargo', 'lf-plantilla-informe', 'lf-plantilla-decision',
  'lf-plantilla-registro', 'lf-plantilla-entornos', 'lf-plantilla-desc',
  'lf-plantilla-postmortem', 'lf-plantilla-runbook', 'lf-plantillas-documentos'];
const NOMBRES = {
  Investigador: 'lf-investigador', Historiador: 'lf-historiador',
  'Lector de evidencia': 'lf-lector-evidencia', 'Simulador de caso': 'lf-simulador-caso',
  Simulador: 'lf-simulador-caso', 'Diseñador de pruebas': 'lf-disenador-pruebas',
  'Evaluador de alternativa': 'lf-evaluador-alternativa', Evaluador: 'lf-evaluador-alternativa',
  'Analista de impacto': 'lf-analista-impacto', Crítico: 'lf-critico', Verificador: 'lf-verificador',
  'Analista de dependencias': 'lf-analista-dependencias', Documentador: 'lf-documentador',
  Redactor: 'lf-redactor', Conciliador: 'lf-conciliador',
};

function fm(text) {
  const m = /^---\n([\s\S]*?)\n---/.exec(text);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split('\n')) {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line);
    if (kv) out[kv[1]] = kv[2].replace(/^"|"$/g, '');
  }
  return out;
}

// Skills
const skillsDir = path.join(root, 'skills');
const skills = {};
for (const d of fs.readdirSync(skillsDir)) {
  const f = path.join(skillsDir, d, 'SKILL.md');
  if (!fs.existsSync(f)) { err(`${d}: falta SKILL.md`); continue; }
  const text = fs.readFileSync(f, 'utf8');
  const meta = fm(text);
  if (meta.name !== d) err(`${d}: name "${meta.name}" distinto de la carpeta`);
  if (!meta.description) err(`${d}: sin description`);
  if (meta.description && meta.description.length > 1024) err(`${d}: description de más de 1024`);
  skills[d] = { text, meta, file: f };
}
const nucleo = ['lf-asistente'];
const trabajo = Object.keys(skills).filter((s) => !nucleo.includes(s) && !ENTRADAS.includes(s));
if (trabajo.length !== 40) err(`se esperaban 40 skills de trabajo, hay ${trabajo.length}`);
for (const e of [...nucleo, ...ENTRADAS]) if (!skills[e]) err(`falta ${e}`);

// Agentes
const agentsDir = path.join(root, 'agents');
const agents = {};
for (const f of fs.readdirSync(agentsDir)) {
  const text = fs.readFileSync(path.join(agentsDir, f), 'utf8');
  const meta = fm(text);
  const list = (meta.skills || '').split(',').map((s) => s.trim()).filter(Boolean);
  agents[meta.name] = { list, tools: meta.tools || '' };
  for (const s of list) if (!skills[s]) err(`${meta.name}: skill inexistente ${s}`);
  if (/\b(Edit|Write|MultiEdit|NotebookEdit)\b/.test(meta.tools)) err(`${meta.name}: herramienta de escritura`);
}
if (Object.keys(agents).length !== 13) err(`se esperaban 13 agentes, hay ${Object.keys(agents).length}`);
const copilot = fs.readdirSync(path.join(root, 'agents-copilot'));
if (copilot.length !== 13) err(`se esperaban 13 agentes de Copilot, hay ${copilot.length}`);

// "Usada por" contra las skills que cargan los agentes
const cargan = {};
for (const [a, { list }] of Object.entries(agents)) for (const s of list) (cargan[s] ||= new Set()).add(a);
for (const s of trabajo) {
  const m = /^Usada por: (.+)$/m.exec(skills[s].text);
  const soloAsistente = /^Solo la usa el asistente/m.test(skills[s].text);
  const declarados = new Set();
  if (m) {
    for (const part of m[1].replace(/\.$/, '').split(/,| y /)) {
      const name = part.replace(/\(.*?\)/g, '').trim();
      if (!name || /^el asistente$/.test(name)) continue;
      if (!NOMBRES[name]) { err(`${s}: agente desconocido en "Usada por": ${name}`); continue; }
      declarados.add(NOMBRES[name]);
    }
  } else if (!soloAsistente) err(`${s}: sin línea "Usada por" ni "Solo la usa el asistente"`);
  const reales = cargan[s] || new Set();
  for (const a of reales) if (!declarados.has(a)) err(`${s}: la carga ${a} pero no lo dice "Usada por"`);
  for (const a of declarados) if (!reales.has(a)) err(`${s}: "Usada por" dice ${a}, que no la carga`);
}

// Menciones lf-…
const conocidos = new Set([...Object.keys(skills), ...Object.keys(agents), ...HOOKS, ...PLANTILLAS,
  'lf-hooks', 'lf-plantilla', 'lf-setup', 'lf-architecture', 'lf-product', 'lf-correccion', 'lf-test', 'lf-guard']);
function scan(file) {
  // El README nombra piezas del paquete 0.4 en su sección de rescate.
  const text = fs.readFileSync(file, 'utf8').split('\n## Qué se rescató')[0]
    .replace(/\n### Si tenías la 0\.4[\s\S]*?(?=\n### )/, '');
  for (const m of text.matchAll(/\blf-[a-z][a-z-]*[a-z]/g)) {
    if (!conocidos.has(m[0])) err(`${path.relative(root, file)}: menciona ${m[0]}, que no existe`);
  }
  for (const m of text.matchAll(/`(\.\.\/lf-asistente\/[^`\s]+)`/g)) {
    const target = path.resolve(path.dirname(file), m[1]);
    if (!fs.existsSync(target)) err(`${path.relative(root, file)}: ruta inexistente ${m[1]}`);
  }
}
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.md$/.test(e.name)) scan(p);
  }
}
walk(skillsDir);
walk(agentsDir);
if (fs.existsSync(path.join(root, 'README.md'))) scan(path.join(root, 'README.md'));

// Plantillas y hooks
for (const p of PLANTILLAS) {
  if (!fs.existsSync(path.join(skillsDir, 'lf-asistente', 'plantillas', `${p}.md`))) err(`falta plantilla ${p}`);
}
const hookSrc = fs.readFileSync(path.join(root, 'hooks', 'lf-hooks.mjs'), 'utf8');
for (const h of HOOKS) if (!hookSrc.includes(h)) err(`hook ${h} no aparece en lf-hooks.mjs`);

// Versiones: VERSION manda; los manifiestos y el bloque de AGENTS.md la repiten.
const version = fs.existsSync(path.join(root, 'VERSION'))
  ? fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim() : null;
if (version) {
  const versiones = {
    'package.json': () => JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version,
    '.claude-plugin/plugin.json': () => JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/plugin.json'), 'utf8')).version,
    '.claude-plugin/marketplace.json': () => JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/marketplace.json'), 'utf8')).metadata.version,
    'plugin.json': () => JSON.parse(fs.readFileSync(path.join(root, 'plugin.json'), 'utf8')).version,
    'bloque-instrucciones.md': () => /legacyforge:inicio v([\d.]+)/.exec(fs.readFileSync(
      path.join(skillsDir, 'lf-asistente/plantillas/documentos/bloque-instrucciones.md'), 'utf8'))?.[1],
  };
  for (const [f, get] of Object.entries(versiones)) {
    let v = null;
    try { v = get(); } catch { /* archivo ausente */ }
    if (v && v !== version) err(`${f}: versión ${v}, VERSION dice ${version}`);
  }
  // Los hooks del plugin llaman al mismo script que se instala.
  const hj = path.join(root, 'hooks', 'hooks.json');
  if (fs.existsSync(hj) && !fs.readFileSync(hj, 'utf8').includes('lf-hooks.mjs')) err('hooks/hooks.json no llama a lf-hooks.mjs');
}

// Presupuesto de descripciones (las de disable-model-invocation no se cargan)
let total = 0;
for (const [s, { meta }] of Object.entries(skills)) {
  if (meta['disable-model-invocation'] === 'true') continue;
  total += meta.description.length;
}
const BUDGET = 7000;
const line = `descripciones que carga el modelo: ${total} caracteres (tope de referencia ${BUDGET})`;
if (total > BUDGET) warn.push(line); else console.log(line);

console.log(`skills: ${Object.keys(skills).length} (1 núcleo, ${trabajo.length} de trabajo, ${ENTRADAS.length} entradas) · agentes: ${Object.keys(agents).length} · hooks: ${HOOKS.length} · plantillas: ${PLANTILLAS.length}`);
for (const w of warn) console.log(`aviso: ${w}`);
for (const e of errors) console.log(`× ${e}`);
console.log(errors.length ? `${errors.length} errores` : 'sin errores');
process.exit(errors.length ? 1 : 0);
