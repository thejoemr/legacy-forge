// Utilidades compartidas por los scripts de mantenimiento.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Lee el encabezado YAML simple de un SKILL.md o de un agente: claves de
// una línea, con valores entre comillas dobles o sin comillas.
export function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!m) throw new Error(`${file}: sin encabezado YAML`);
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`${file}: línea de encabezado no reconocida: ${line}`);
    let value = kv[2].trim();
    if (value.startsWith('"')) {
      if (!value.endsWith('"') || value.length < 2) throw new Error(`${file}: comillas sin cerrar en ${kv[1]}`);
      value = JSON.parse(value);
    } else if (/: /.test(value)) {
      throw new Error(`${file}: "${kv[1]}" contiene ": " sin comillas (YAML inválido)`);
    }
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    data[kv[1]] = value;
  }
  return { data, body: text.slice(m[0].length) };
}

export function skillNames() {
  return fs.readdirSync(path.join(ROOT, 'skills'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, 'skills', d.name, 'SKILL.md')))
    .map((d) => d.name)
    .sort();
}

export function invocation(data) {
  if (data['disable-model-invocation'] === true) return 'solo si el usuario la invoca con / (o $ en Codex).';
  if (data['user-invocable'] === false) return 'solo la activa el asistente por su descripción; no aparece en el menú /.';
  return 'la activa el asistente por su descripción, o el usuario con /.';
}

export function buildIndex(version) {
  const out = [
    '# Índice de skills de LegacyForge',
    '',
    'Lo único que un asistente ve de cada skill antes de activarla: nombre,',
    `descripción y cómo se invoca. Generado de los encabezados (${version})`,
    'con `node scripts/indice-skills.mjs`.',
  ];
  for (const name of skillNames()) {
    const { data } = frontmatter(path.join(ROOT, 'skills', name, 'SKILL.md'));
    out.push('', `## ${name}`, '',
      `- Invocación: ${invocation(data)}`,
      `- Archivo: \`skills/${name}/SKILL.md\``,
      `- Descripción: ${data.description}`);
  }
  return out.join('\n') + '\n';
}

export function version() {
  return fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
}
