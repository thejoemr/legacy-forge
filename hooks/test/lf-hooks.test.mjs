// Pruebas de lf-hooks.mjs. Uso: node hooks/test/lf-hooks.test.mjs
// Crea proyectos temporales con git y simula los eventos del asistente.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HOOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'lf-hooks.mjs');
let pass = 0;
let fail = 0;
const failures = [];

function project({ branch = 'lf/correccion-rfc', config } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lf-test-'));
  execSync('git init -q -b main && git config user.email t@t && git config user.name t', { cwd: dir });
  fs.writeFileSync(path.join(dir, 'app.js'), 'const a = 1;\nconsole.log(a);\n');
  fs.writeFileSync(path.join(dir, 'viejo.bas'), Buffer.from('Dim s\r\ns = "Facturaci\xf3n"\r\n', 'latin1'));
  execSync('git add app.js viejo.bas && git commit -qm init', { cwd: dir });
  if (branch !== 'main') execSync(`git switch -qc ${branch}`, { cwd: dir });
  if (config) {
    fs.mkdirSync(path.join(dir, '.legacyforge'), { recursive: true });
    fs.writeFileSync(path.join(dir, '.legacyforge', 'config.json'), JSON.stringify(config));
  }
  return dir;
}

function run(dir, event, extra = {}, env = {}, args = []) {
  const input = { hook_event_name: event, session_id: path.basename(dir), cwd: dir, ...extra };
  const r = spawnSync('node', [HOOK, ...args], {
    input: JSON.stringify(input), encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir, LF_HOOKS_DEBUG: '', ...env },
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

const prompt = (dir, text) => run(dir, 'UserPromptSubmit', { prompt: text });
const pre = (dir, tool, ti, extra = {}) => run(dir, 'PreToolUse', { tool_name: tool, tool_input: ti, ...extra });
const post = (dir, tool, ti, tr, extra = {}) => run(dir, 'PostToolUse', { tool_name: tool, tool_input: ti, tool_response: tr, ...extra });
const AG = { agent_id: 'a1', agent_type: 'lf-investigador' };

function t(name, cond, detail = '') {
  if (cond) pass++;
  else { fail++; failures.push(`${name} ${detail}`); }
}
const allows = (name, r) => t(name, r.code === 0, `(código ${r.code}: ${r.err.trim()})`);
const blocks = (name, r, re) => t(name, r.code === 2 && (!re || re.test(r.err)), `(código ${r.code}: ${r.err.trim()})`);

// ---------------------------------------------------- lf-guard-apply
{
  const d = project();
  blocks('edit sin APPLY', pre(d, 'Edit', { file_path: path.join(d, 'app.js') }), /APPLY/);
  prompt(d, 'APPLY');
  allows('edit con APPLY', pre(d, 'Edit', { file_path: path.join(d, 'app.js') }));
  allows('write relativo con APPLY', pre(d, 'Write', { file_path: 'nuevo.js' }));
  prompt(d, 'gracias');
  blocks('APPLY retirado por otro mensaje', pre(d, 'Edit', { file_path: 'app.js' }), /APPLY/);
  prompt(d, '  APPLY con mejora ');
  allows('APPLY con mejora', pre(d, 'MultiEdit', { file_path: 'app.js' }));
  prompt(d, 'apply');
  blocks('apply en minúsculas no cuenta', pre(d, 'Edit', { file_path: 'app.js' }));
  prompt(d, 'APPLY por favor');
  blocks('APPLY con texto extra no cuenta', pre(d, 'Edit', { file_path: 'app.js' }));
  prompt(d, 'hola');
  allows('memoria sin APPLY', pre(d, 'Write', { file_path: '.legacyforge/memoria/sistema.md' }));
  allows('expediente sin APPLY', pre(d, 'Write', { file_path: '.legacyforge/expediente/x/mapa.md' }));
  allows('fuera del proyecto', pre(d, 'Write', { file_path: path.join(os.tmpdir(), 'plan.md') }));
  blocks('SETUP.md necesita APPLY', pre(d, 'Write', { file_path: 'SETUP.md' }));
  blocks('parche de Codex sin APPLY', pre(d, 'apply_patch', { input: '*** Begin Patch\n*** Update File: app.js\n@@\n' }));
  blocks('herramienta de Copilot sin APPLY', pre(d, 'replace_string_in_file', { filePath: path.join(d, 'app.js') }));
  blocks('sed -i sin APPLY', pre(d, 'Bash', { command: "sed -i 's/a/b/' app.js" }));
  blocks('redirección sin APPLY', pre(d, 'Bash', { command: 'echo x > app.js' }));
  blocks('rm sin APPLY', pre(d, 'Bash', { command: 'rm app.js' }));
  blocks('Set-Content sin APPLY', pre(d, 'PowerShell', { command: 'Set-Content app.js "x"' }));
  blocks('crear rama sin APPLY', pre(d, 'Bash', { command: 'git switch -c lf/otra' }));
  allows('redirección al expediente', pre(d, 'Bash', { command: 'npm test > .legacyforge/expediente/x/salidas/t.txt' }));
  allows('2>&1 no es escritura', pre(d, 'Bash', { command: 'npm test 2>&1' }));
  allows('a /dev/null', pre(d, 'Bash', { command: 'npm test >/dev/null 2>&1' }));
  allows('flecha entre comillas', pre(d, 'Bash', { command: 'grep "a -> b" app.js' }));
  allows('rm entre comillas', pre(d, 'Bash', { command: 'grep "rm -rf" app.js' }));
  allows('git status', pre(d, 'Bash', { command: 'git status --short' }));
  prompt(d, 'APPLY');
  allows('sed -i con APPLY', pre(d, 'Bash', { command: "sed -i 's/a/b/' app.js" }));
  allows('crear rama con APPLY', pre(d, 'Bash', { command: 'git switch -c lf/otra' }));
}

// ------------------------------------------------- lf-guard-agentes
{
  const d = project();
  prompt(d, 'APPLY');
  blocks('agente no edita aunque haya APPLY', pre(d, 'Edit', { file_path: 'app.js' }, AG), /no escriben/);
  blocks('agente no escribe en el expediente', pre(d, 'Write', { file_path: '.legacyforge/expediente/x/n.md' }, AG));
  blocks('agente detectado por transcript', pre(d, 'Write', { file_path: 'a.md' },
    { transcript_path: '/h/.claude/projects/p/s/subagents/agent-1.jsonl' }));
  allows('agente lee', pre(d, 'Read', { file_path: 'app.js' }, AG));
  allows('agente git log', pre(d, 'Bash', { command: 'git log --follow --format="%h %s" -- app.js' }, AG));
  allows('agente git -C blame', pre(d, 'Bash', { command: 'git -C sub blame -w app.js' }, AG));
  allows('agente git --no-pager show', pre(d, 'Bash', { command: 'git --no-pager show HEAD --stat' }, AG));
  allows('agente grep con tubería', pre(d, 'Bash', { command: 'grep -rn "Factura" src | head -50' }, AG));
  allows('agente 2>/dev/null', pre(d, 'Bash', { command: 'find . -name "*.sql" 2>/dev/null | wc -l' }, AG));
  allows('agente cd y git', pre(d, 'Bash', { command: 'cd sub && git diff HEAD~3 -- x.cs' }, AG));
  allows('agente git branch lista', pre(d, 'Bash', { command: 'git branch -a' }, AG));
  allows('agente file', pre(d, 'Bash', { command: 'file viejo.bas' }, AG));
  blocks('agente git commit', pre(d, 'Bash', { command: 'git commit -m x' }, AG));
  blocks('agente git checkout', pre(d, 'Bash', { command: 'git checkout main' }, AG));
  blocks('agente git branch crear', pre(d, 'Bash', { command: 'git branch nueva' }, AG));
  blocks('agente git stash', pre(d, 'Bash', { command: 'git stash' }, AG));
  blocks('agente redirección', pre(d, 'Bash', { command: 'git log > notas.txt' }, AG));
  blocks('agente tee', pre(d, 'Bash', { command: 'git log | tee notas.txt' }, AG));
  blocks('agente sustitución', pre(d, 'Bash', { command: 'echo $(rm app.js)' }, AG));
  blocks('agente find -delete', pre(d, 'Bash', { command: 'find . -name "*.tmp" -delete' }, AG));
  blocks('agente npm', pre(d, 'Bash', { command: 'npm install' }, AG));
  blocks('agente sed', pre(d, 'Bash', { command: "sed -n '1,5p' app.js" }, AG));
  blocks('agente python', pre(d, 'Bash', { command: 'python -c "open(\'x\',\'w\')"' }, AG));
  blocks('agente sqlcmd', pre(d, 'Bash', { command: 'sqlcmd -S srv -Q "delete from t"' }, AG));
}

// ------------------------------------------------ lf-guard-secretos
{
  const d = project();
  blocks('leer .env', pre(d, 'Read', { file_path: '.env' }), /secretos/);
  blocks('leer .env.production', pre(d, 'Read', { file_path: 'config/.env.production' }));
  blocks('leer llave', pre(d, 'Read', { file_path: 'certs/server.pfx' }));
  blocks('leer id_rsa', pre(d, 'Read', { file_path: '/home/u/.ssh/id_rsa' }));
  blocks('leer secrets.json', pre(d, 'read_file', { filePath: 'secrets.json' }));
  blocks('grep sobre .env', pre(d, 'Grep', { pattern: 'DB', path: '.env' }));
  allows('leer .env.example', pre(d, 'Read', { file_path: '.env.example' }));
  allows('leer appsettings', pre(d, 'Read', { file_path: 'appsettings.json' }));
  blocks('cat .env', pre(d, 'Bash', { command: 'cat .env' }));
  blocks('Get-Content .env.local', pre(d, 'PowerShell', { command: 'Get-Content .env.local' }));
  blocks('grep en .env', pre(d, 'Bash', { command: 'grep PASSWORD .env' }));
  blocks('git show .env', pre(d, 'Bash', { command: 'git show HEAD:.env' }));
  allows('cat .env.example', pre(d, 'Bash', { command: 'cat .env.example' }));
  prompt(d, 'APPLY');
  blocks('editar .env ni con APPLY', pre(d, 'Edit', { file_path: '.env' }));
  const r = post(d, 'Read', { file_path: 'web.config' },
    { file: { content: '<add connectionString="Server=x;Database=y;Password=Sup3rS3cret;" />' } });
  t('aviso de secreto en salida', r.code === 0 && /posible secreto/.test(r.out) && !/Sup3rS3cret/.test(r.out), r.out);
  const r2 = post(d, 'Read', { file_path: 'app.js' }, { file: { content: 'const a = 1;' } });
  t('sin aviso si no hay secreto', r2.out === '', r2.out);
}

// ------------------------------------------------------ lf-guard-git
{
  const d = project();
  blocks('push --force', pre(d, 'Bash', { command: 'git push --force origin x' }), /reescribe/);
  blocks('push -f', pre(d, 'Bash', { command: 'git push -f' }));
  blocks('reset --hard', pre(d, 'Bash', { command: 'git reset --hard HEAD~1' }));
  blocks('add -A', pre(d, 'Bash', { command: 'git add -A' }));
  blocks('add .', pre(d, 'Bash', { command: 'git add .' }));
  blocks('commit -am', pre(d, 'Bash', { command: 'git commit -am "x"' }));
  blocks('commit --amend', pre(d, 'Bash', { command: 'git commit --amend --no-edit' }));
  blocks('stash', pre(d, 'Bash', { command: 'git stash' }));
  blocks('clean', pre(d, 'Bash', { command: 'git clean -fd' }));
  blocks('rebase', pre(d, 'Bash', { command: 'git rebase main' }));
  blocks('checkout --', pre(d, 'Bash', { command: 'git checkout -- app.js' }));
  blocks('checkout .', pre(d, 'Bash', { command: 'git checkout .' }));
  blocks('restore', pre(d, 'Bash', { command: 'git restore app.js' }));
  blocks('git -C reset', pre(d, 'Bash', { command: 'git -C . reset --hard' }));
  blocks('borrar rama sin APPLY', pre(d, 'Bash', { command: 'git branch -D vieja' }), /APPLY/);
  blocks('borrar rama remota sin APPLY', pre(d, 'Bash', { command: 'git push origin --delete vieja' }));
  allows('stash list', pre(d, 'Bash', { command: 'git stash list' }));
  allows('restore --staged', pre(d, 'Bash', { command: 'git restore --staged app.js' }));
  allows('add archivo', pre(d, 'Bash', { command: 'git add app.js' }));
  allows('commit en rama de trabajo', pre(d, 'Bash', { command: 'git commit -m "Corrige RFC"' }));
  prompt(d, 'APPLY');
  allows('borrar rama con APPLY', pre(d, 'Bash', { command: 'git branch -d vieja' }));
  const m = project({ branch: 'main' });
  blocks('commit en main', pre(m, 'Bash', { command: 'git commit -m x' }), /protegida/);
  const r = run(m, 'PreToolUse', { tool_name: 'Bash', tool_input: { command: 'git commit -m x' } }, { LF_RAMAS_PROTEGIDAS: '' });
  allows('LF_RAMAS_PROTEGIDAS vacío', r);
  const c = project({ branch: 'release/1.0', config: { ramasProtegidas: '^release/' } });
  blocks('rama protegida por config', pre(c, 'Bash', { command: 'git commit -m x' }));
}

// ------------------------------------------------ lf-guard-produccion
{
  const d = project({ config: { produccion: ['SRV-PROD-01', 'FACT_PROD'] } });
  blocks('sqlcmd a producción', pre(d, 'Bash', { command: 'sqlcmd -S srv-prod-01 -d FACT -Q "select 1"' }), /producción/);
  blocks('base de producción', pre(d, 'Bash', { command: 'psql -d fact_prod -c "select 1"' }));
  blocks('MCP contra producción', pre(d, 'mcp__db__query', { server: 'SRV-PROD-01', sql: 'select 1' }));
  allows('otro servidor', pre(d, 'Bash', { command: 'sqlcmd -S SRV-QA-01 -Q "select 1"' }));
  allows('nombre parecido', pre(d, 'Bash', { command: 'sqlcmd -S SRV-PROD-010 -Q "select 1"' }));
  allows('leer config que lo menciona', pre(d, 'Read', { file_path: 'appsettings.Production.json' }));
  const e = project();
  const r = run(e, 'PreToolUse', { tool_name: 'Bash', tool_input: { command: 'ssh prod.empresa.local' } }, { LF_PRODUCCION: 'prod.empresa.local' });
  blocks('producción por variable', r);
}

// ------------------------------------------------ lf-respaldo y lf-formato
{
  const d = project();
  prompt(d, 'APPLY');
  allows('edit autorizado', pre(d, 'Edit', { file_path: 'viejo.bas' }));
  const bak = path.join(d, '.legacyforge', 'respaldo', 'lf_correccion-rfc', 'viejo.bas');
  t('respaldo creado', fs.existsSync(bak));
  const original = fs.readFileSync(bak);
  fs.writeFileSync(path.join(d, 'viejo.bas'), 'otra cosa');
  pre(d, 'Edit', { file_path: 'viejo.bas' });
  t('respaldo conserva el original', fs.readFileSync(bak).equals(original));
  pre(d, 'Write', { file_path: 'nuevo.cs' });
  const idx = fs.readFileSync(path.join(d, '.legacyforge', 'respaldo', 'lf_correccion-rfc', 'indice.txt'), 'utf8');
  t('índice registra modificado y nuevo', /modificado\tviejo\.bas/.test(idx) && /nuevo\tnuevo\.cs/.test(idx), idx);

  fs.writeFileSync(path.join(d, 'viejo.bas'), Buffer.from('Dim s\r\ns = "Facturación 2"\r\n', 'utf8'));
  blocks('formato: codificación cambiada', post(d, 'Edit', { file_path: 'viejo.bas' }, {}), /codificaci/);
  fs.writeFileSync(path.join(d, 'viejo.bas'), Buffer.from('Dim s\ns = "Facturaci\xf3n 2"\n', 'latin1'));
  blocks('formato: fin de línea cambiado', post(d, 'Edit', { file_path: 'viejo.bas' }, {}), /fin de l/);
  fs.writeFileSync(path.join(d, 'viejo.bas'), Buffer.from('Dim s\r\ns = "Facturaci\xf3n 2"\r\n', 'latin1'));
  allows('formato conservado', post(d, 'Edit', { file_path: 'viejo.bas' }, {}));
  pre(d, 'Edit', { file_path: 'app.js' });
  fs.writeFileSync(path.join(d, 'app.js'), 'const a = "ñ";\n');
  allows('ASCII a UTF-8 no es cambio de formato', post(d, 'Edit', { file_path: 'app.js' }, {}));
}

// ------------------------------------------------------- lf-salidas
{
  const d = project();
  const big = Array.from({ length: 200 }, (_, i) => `línea ${i}`).join('\n');
  const r = post(d, 'Bash', { command: 'npm test' }, { stdout: big, stderr: '' });
  const dir = path.join(d, '.legacyforge', 'expediente', 'lf_correccion-rfc', 'salidas');
  t('salida larga guardada', fs.existsSync(dir) && fs.readdirSync(dir).length === 1);
  t('referencia al asistente', /lf-lector-evidencia/.test(r.out), r.out);
  const r2 = post(d, 'Bash', { command: 'git status' }, { stdout: 'ok', stderr: '' });
  t('salida corta no se guarda', r2.out === '' && fs.readdirSync(dir).length === 1);
  const r3 = post(d, 'Bash', { command: 'npm test' }, { stdout: big }, AG);
  t('salida de agente no se guarda', fs.readdirSync(dir).length === 1 && r3.out === '');
  const w = spawnSync('node', [HOOK, 'salida', '--', 'node -e "for(let i=0;i<30;i++)console.log(\'Password=abc12345 l\'+i);process.exit(3)"'],
    { cwd: d, encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: d } });
  t('registrador devuelve el código', w.status === 3, w.stderr);
  t('registrador resume y enmascara', /código de salida: 3/.test(w.stdout) && !/abc12345/.test(w.stdout), w.stdout);
  const saved = fs.readdirSync(dir).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('');
  t('salida guardada sin secretos', !/abc12345/.test(saved));
}

// ------------------------------------------------------- lf-informe
{
  const d = project();
  const full = '## Respuesta\nx\n## Evidencia\n- a\n## Confianza\nalta\n## No revisado\nnada\n## Para decidir\nnada';
  t('informe completo pasa', run(d, 'SubagentStop', { agent_type: 'lf-investigador', last_assistant_message: full }).out === '');
  const r = run(d, 'SubagentStop', { agent_type: 'lf-critico', last_assistant_message: '## Respuesta\nx\n## Evidencia\ny' });
  t('informe incompleto se devuelve', /"decision":"block"/.test(r.out) && /Confianza/.test(r.out), r.out);
  t('sin acentos también cuenta', run(d, 'SubagentStop', { agent_type: 'lf-x',
    last_assistant_message: full.replace('No revisado', 'NO REVISADO') }).out === '');
  t('stop_hook_active no repite', run(d, 'SubagentStop', { agent_type: 'lf-x', stop_hook_active: true, last_assistant_message: 'x' }).out === '');
  t('agente ajeno no se revisa', run(d, 'SubagentStop', { agent_type: 'Explore', last_assistant_message: 'x' }).out === '');
  const tr = path.join(d, 't.jsonl');
  fs.writeFileSync(tr, [
    JSON.stringify({ type: 'user', message: { role: 'user', content: 'encargo' } }),
    JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: '## Respuesta\nsolo esto' }] } }),
  ].join('\n'));
  const r2 = run(d, 'SubagentStop', { agent_type: 'lf-historiador', agent_transcript_path: tr });
  t('informe leído del transcript', /No revisado/.test(r2.out), r2.out);
}

// ------------------------------------------------- lf-inicio y lf-cierre
{
  const d = project();
  const r = run(d, 'SessionStart', { source: 'startup' });
  t('inicio sin memoria sugiere iniciar', /lf-asistente/.test(r.out) && /\/lf-iniciar/.test(r.out), r.out);
  const lf = path.join(d, '.legacyforge');
  fs.mkdirSync(path.join(lf, 'memoria'), { recursive: true });
  fs.mkdirSync(path.join(lf, 'expediente', 'lf_correccion-rfc', 'informes'), { recursive: true });
  fs.writeFileSync(path.join(lf, 'memoria', 'sesiones.md'), '### 2026-11-20 · RFC\nEstado: abierto\n');
  fs.writeFileSync(path.join(lf, 'memoria', 'decisiones.md'),
    '### 2026-11-01 · Descuentos\nEstado: vigente\n\n### 2026-11-02 · Cierre\nEstado: señal cumplida 2026-11-20\n');
  const r2 = run(d, 'SessionStart', { source: 'startup' });
  t('inicio con expediente, sesión y señales', /Expediente abierto/.test(r2.out) && /RFC/.test(r2.out) &&
    /vigentes.*1/.test(r2.out) && /Cierre/.test(r2.out), r2.out);

  t('cierre sin pendientes no dice nada', run(d, 'Stop', {}).out === '');
  prompt(d, 'APPLY');
  pre(d, 'Edit', { file_path: 'app.js' });
  fs.writeFileSync(path.join(d, 'app.js'), 'cambiado\n');
  fs.writeFileSync(path.join(lf, 'expediente', 'lf_correccion-rfc', 'pendientes.md'), '- [ ] guardar causa\n- [x] hecho\n');
  const r3 = run(d, 'Stop', {});
  t('cierre recuerda sin commit y pendientes', /app\.js/.test(r3.out) && /1 pendiente/.test(r3.out), r3.out);
  t('cierre no repite lo mismo', run(d, 'Stop', {}).out === '');
  t('cierre respeta stop_hook_active', run(d, 'Stop', { stop_hook_active: true }).out === '');
}

// ----------------------------------------------- --solo-preparados
{
  const d = project();
  const SP = ['--solo-preparados'];
  const edit = () => run(d, 'PreToolUse', { tool_name: 'Edit', tool_input: { file_path: 'app.js' } }, {}, SP);
  allows('proyecto sin preparar: no actúa', edit());
  t('proyecto sin preparar: inicio callado', run(d, 'SessionStart', {}, {}, SP).out === '');
  fs.writeFileSync(path.join(d, 'AGENTS.md'), '# x\n<!-- legacyforge:inicio v1.0.0 -->\n<!-- legacyforge:fin -->\n');
  blocks('preparado por AGENTS.md: actúa', edit(), /APPLY/);
  const e = project({ config: {} });
  blocks('preparado por .legacyforge: actúa',
    run(e, 'PreToolUse', { tool_name: 'Edit', tool_input: { file_path: 'app.js' } }, {}, SP));
}

// ------------------------------------------------------------ general
{
  const d = project();
  const r = run(d, 'PreToolUse', { tool_name: 'Edit', tool_input: { file_path: 'app.js' } }, { LF_HOOKS_OFF: '1' });
  allows('LF_HOOKS_OFF', r);
  const bad = spawnSync('node', [HOOK], { input: 'no es json', encoding: 'utf8' });
  t('entrada ilegible no bloquea', bad.status === 0);
  allows('herramienta desconocida', pre(d, 'TodoWrite', { todos: [] }));
}

console.log(`${pass} pasan, ${fail} fallan`);
for (const f of failures) console.log(`  × ${f}`);
process.exit(fail ? 1 : 0);
