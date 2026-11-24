# LegacyForge 1.0.0

Un asistente para mantener software heredado. Funciona en Claude Code,
GitHub Copilot y Codex.

El asistente plantea y el humano decide. Agentes de solo lectura
investigan, simulan, evalúan y redactan. El asistente integra lo que
devuelven y se lo presenta al desarrollador con una recomendación.
Ningún archivo cambia sin que él escriba APPLY.

Versión **1.0.0** ([cambios](CHANGELOG.md)). Se escribió desde cero a
partir de la definición del asistente (D0 a D3, entrega, agentes y
skills); del paquete 0.4 se rescató lo que servía y lo demás se
descartó (ver la última sección).

## Piezas

| Pieza | Cantidad | Dónde |
|---|---|---|
| Núcleo (`lf-asistente`) | 1 | `skills/lf-asistente/` con `references/` y `plantillas/` |
| Skills de trabajo | 40 | `skills/lf-*/` |
| Puntos de entrada | 4 | `/lf-ayuda`, `/lf-iniciar`, `/lf-revisar`, `/lf-cerrar` |
| Agentes | 13 | `agents/` (Claude Code) y `agents-copilot/` (Copilot), generados por `scripts/agentes.mjs` |
| Hooks | 11 | `hooks/lf-hooks.mjs`, un solo script |
| Plantillas | 9 | `skills/lf-asistente/plantillas/` |
| Almacenes | 2 | memoria y expediente, en `.legacyforge/` del proyecto |

### Agentes

Todos son de solo lectura. No hablan con el humano. Cada uno es una
instancia por unidad de trabajo y devuelve un informe con cinco
secciones: Respuesta, Evidencia, Confianza, No revisado y Para decidir.

| Agente | Una instancia por |
|---|---|
| `lf-investigador` | Proyecto, módulo, flujo, hipótesis o decisión con disenso |
| `lf-historiador` | Zona o conjunto de archivos |
| `lf-lector-evidencia` | Salida guardada (log, traza, plan, build) |
| `lf-simulador-caso` | Caso de caja negra |
| `lf-disenador-pruebas` | Cambio o flujo |
| `lf-evaluador-alternativa` | Opción de solución |
| `lf-analista-impacto` | Repositorio o unidad que el cambio toca |
| `lf-critico` | Propuesta o postura cuestionada |
| `lf-verificador` | Archivo o consumidor del cambio |
| `lf-analista-dependencias` | Proyecto o manifiesto |
| `lf-documentador` | Documento (SETUP, ARCHITECTURE, PRODUCT) |
| `lf-redactor` | Texto para otra área |
| `lf-conciliador` | Par de fuentes y periodo |

### Hooks

| Hook | Evento | Qué hace |
|---|---|---|
| lf-guard-apply | UserPromptSubmit, PreToolUse | El APPLY vale si el último mensaje es exactamente `APPLY` o `APPLY con mejora`. Sin él, se bloquea crear, editar o borrar archivos del proyecto, también desde la terminal (`sed -i`, `>`, `rm`, `Set-Content`, crear ramas…). |
| lf-guard-agentes | PreToolUse | Un subagente no escribe nunca, aunque haya APPLY. En la terminal solo puede usar comandos de lectura (lista permitida). |
| lf-guard-secretos | PreToolUse, PostToolUse | No deja leer ni editar archivos de secretos ni mostrarlos con un comando. Avisa si una salida trae un posible secreto y lo enmascara en lo que se guarda. |
| lf-guard-git | PreToolUse | Bloquea `push --force`, `reset --hard`, `add -A`/`.`, `commit -a`/`--amend`, `stash`, `clean`, `rebase`, `checkout --`, `restore`, `filter-branch` y el commit en ramas protegidas. Borrar ramas requiere APPLY. |
| lf-guard-produccion | PreToolUse | Bloquea comandos y herramientas (incluidas MCP) que nombran un servidor o base marcados como producción. |
| lf-respaldo | PreToolUse | Antes de cada escritura autorizada, copia el original a `.legacyforge/respaldo/<rama>/` y lo anota en `indice.txt`. |
| lf-formato | PostToolUse | Compara la codificación y el fin de línea con el respaldo y avisa si cambiaron. |
| lf-salidas | PostToolUse y `salida` | Guarda en el expediente las salidas de más de 80 líneas y deja solo la referencia. El registrador `node lf-hooks.mjs salida -- <comando>` guarda la salida completa y devuelve un resumen. |
| lf-informe | SubagentStop | Devuelve al agente un informe al que le falte alguna de las cinco secciones. |
| lf-inicio | SessionStart | Carga la rama, los cambios sin commit, el expediente abierto, la última sesión y las señales de revisión cumplidas. |
| lf-cierre | Stop | Recuerda una vez los archivos propios sin commit y los pendientes de memoria. |

## Instalar

Requiere Node.js 18 o posterior (los hooks y el instalador son de Node).

| Asistente | Comando |
|---|---|
| Claude Code (plugin) | `/plugin marketplace add thejoemr/legacy-forge` y luego `/plugin install legacyforge@legacy-forge` |
| Cualquiera, macOS, Linux, WSL | `curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh \| bash` |
| Cualquiera, Windows (PowerShell) | `irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1 \| iex` |
| Cualquiera, con npx | `npx github:thejoemr/legacy-forge` |

Sin opciones, el instalador detecta qué asistentes tienes (Claude Code,
Copilot, Codex) e instala skills, agentes y hooks a nivel de usuario,
para todos tus proyectos. A nivel de usuario, los hooks solo actúan en
los proyectos que prepares con `/lf-iniciar`; en los demás no hacen
nada.

Después, en cada proyecto: abre una sesión nueva y escribe `/lf-iniciar`
(en Codex, `$lf-iniciar`). Genera SETUP, ARCHITECTURE y PRODUCT, el
bloque de `AGENTS.md` y la carpeta de memoria, con una sola autorización.

### Si tenías la 0.4

El instalador quita solo lo que dejó la 0.4 en los mismos lugares:
skills viejas (`lf-core`, `lf-change`, `lf-test`…), los agentes
`lf-explorador`, `lf-simulador` y `lf-escenarios`, `lf-guard.mjs` y sus
entradas en `settings.json`. Tus otras skills, agentes y hooks no se
tocan; antes de cambiar un `settings.json` se guarda una copia
`settings.json.antes-de-legacyforge`.

- Instalaste con `install.sh`/`install.ps1` a nivel de usuario: vuelve a
  correr el instalador.
- La copiaste en un proyecto: corre el instalador con
  `--scope project --project <ruta>`.
- Usabas el plugin de Claude Code: `/plugin marketplace update
  legacy-forge` y quita el plugin `legacyforge-guard`, que ya no existe
  (los hooks vienen dentro de `legacyforge`).

### Opciones

Con `curl … | bash -s -- <opciones>`, `./install.sh <opciones>` o
`npx github:thejoemr/legacy-forge -- <opciones>`:

| `install.sh` y npx | `install.ps1` | Qué hace |
|---|---|---|
| `--harness claude,copilot,codex` o `all` | `-Harness ...` | Asistentes. Sin esta opción, los detecta |
| `--scope user` (por defecto) o `project` | `-Scope ...` | Para todos tus proyectos o solo uno |
| `--project RUTA` | `-Project RUTA` | Proyecto para `project` y para los hooks de Copilot |
| `--no-hooks` | `-NoHooks` | Sin hooks (no recomendado) |
| `--no-agents` | `-NoAgents` | Sin agentes: el asistente hace cada encargo como una pasada aparte |
| `--ref v1.0.0` | `-Ref v1.0.0` | Una versión concreta (etiqueta o rama); solo `install.sh`/`install.ps1` |
| `--source RUTA` | `-Source RUTA` | Desde un clon local; solo `install.sh`/`install.ps1` |
| `--uninstall` | `-Uninstall` | Quita LegacyForge 1.0 y 0.4, nada más |
| `--dry-run` | `-DryRun` | Muestra lo que haría sin cambiar nada |

Dónde queda cada cosa:

| Asistente | Ámbito | Skills | Agentes | Hooks |
|---|---|---|---|---|
| Claude Code | usuario | `~/.claude/skills` | `~/.claude/agents` | `~/.claude/hooks` + `~/.claude/settings.json` (solo proyectos preparados) |
| Claude Code | proyecto | `.claude/skills` | `.claude/agents` | `.claude/hooks` + `.claude/settings.json` |
| Copilot | usuario | `~/.agents/skills` | `~/.copilot/agents` | solo por proyecto |
| Copilot | proyecto | `.agents/skills` | `.github/agents` | `.github/hooks` |
| Codex | usuario | `~/.agents/skills` | no tiene subagentes | no tiene hooks |
| Codex | proyecto | `.agents/skills` | no tiene subagentes | no tiene hooks |

Actualizar: vuelve a correr el instalador (o `/plugin marketplace update
legacy-forge`). Si el bloque de `AGENTS.md` de un proyecto es de otra
versión, `/lf-ayuda` lo avisa y `/lf-iniciar` lo regenera.

## Configuración

`.legacyforge/config.json`, que se crea con `/lf-iniciar`:

```json
{
  "produccion": ["SRV-PROD-01", "FACT_PROD"],
  "ramasProtegidas": "^(main|master|develop|development|trunk)$",
  "memoria": ".legacyforge"
}
```

| Variable | Efecto |
|---|---|
| `LF_HOOKS_OFF=1` | Desactiva todos los hooks. |
| `LF_HOOKS_DEBUG=1` | Anota cada decisión en `<tmp>/legacyforge/debug.log`. Sirve para ver qué nombres de herramienta usa tu asistente. |
| `LF_HOME` | Pone la memoria fuera del proyecto. |
| `LF_PRODUCCION=a,b` | Agrega nombres de producción a los de `config.json`. |
| `LF_RAMAS_PROTEGIDAS` | Regex de ramas protegidas. Vacío desactiva la comprobación. |

## Estructura del repositorio

```text
skills/                 núcleo, 40 skills y 4 puntos de entrada (formato Agent Skills)
agents/                 13 agentes para Claude Code (generados)
agents-copilot/         los mismos 13 para Copilot (generados)
hooks/                  lf-hooks.mjs, sus pruebas y su configuración por asistente
.claude-plugin/         plugin y marketplace de Claude Code
plugin.json             manifiesto de plugin para Copilot CLI
package.json            permite instalar con npx
install.sh, install.ps1 descargan el repositorio y corren scripts/instalar.mjs
scripts/                instalador, generador de agentes y verificador
docs/historial/         análisis y pruebas de las versiones anteriores
```

## Desarrollo

```
npm test                              # pruebas de los hooks y verificación del paquete
node scripts/agentes.mjs              # regenera agents/ y agents-copilot/ (edita aquí, no los .md)
node scripts/verificar.mjs            # nombres, totales, referencias, "Usada por", versiones, presupuesto
claude plugin validate .              # valida el plugin de Claude Code
```

Para publicar una versión: cambia `VERSION`, `package.json`,
`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`,
`plugin.json` y la versión del bloque en
`skills/lf-asistente/plantillas/documentos/bloque-instrucciones.md`;
agrega la sección en `CHANGELOG.md`; corre `npm test` (avisa si una
versión no cuadra) y crea la etiqueta `vX.Y.Z`.

El verificador comprueba que:

- Hay 1 núcleo, 40 skills, 4 entradas, 13 agentes, 11 hooks y 9 plantillas.
- Cada skill que carga un agente existe y coincide con la línea "Usada por" de la skill.
- Toda mención `lf-…` apunta a una pieza que existe.
- Las descripciones que carga el modelo suman 4,774 caracteres. El tope de referencia es 7,000, por el límite de Codex.

## Lo que hay que confirmar en cada instalación

- Detección de subagentes: `lf-guard-agentes` reconoce un subagente por los campos `agent_id` o `agent_type` del evento, o por una ruta de transcripción bajo `subagents/`. Si tu versión del asistente no manda ninguno, la primera barrera sigue siendo la lista `tools` de cada agente, que no incluye herramientas de escritura. Revísalo con `LF_HOOKS_DEBUG=1`.
- Precarga de skills en agentes: los agentes de Claude Code declaran `skills:`. Instalados como plugin, las skills quedan con prefijo (`legacyforge:lf-comprension`); hay que confirmar que el agente las encuentra con el nombre sin prefijo. En Copilot, el cuerpo del agente le pide cargarlas.
- Nombres de herramientas de Copilot: los agentes usan `read`, `search`, `runCommands` y `fetch`. Confírmalos en tu versión de VS Code.
- Las salidas no se pueden reescribir: un hook no puede cambiar lo que una herramienta integrada ya devolvió. lf-guard-secretos avisa y lf-salidas guarda la copia enmascarada. Para que el modelo nunca vea una salida completa, el asistente usa el registrador `salida`.
- Archivos de secretos en `.gitignore`: `.env` puede no ser visible para la búsqueda del asistente. Aun así, el hook bloquea cualquier lectura directa.

## Qué se rescató del paquete 0.4 y qué se descartó

| Del paquete 0.4 | Destino en 1.0 |
|---|---|
| `comunicacion.md`: registro según propósito, topes, recorte, preguntas, canal, formato en pantalla, los tres encabezados | Rescatado en `lf-comunicacion` (+ `references/recorte.md`) y `lf-asistente/references/entrega.md` |
| `solucion.md`: la mejor solución, precedentes, no copiar el desorden, ventana opcional, plazo, dimensionar | Rescatado en `lf-solucion`, `lf-refactor`, `lf-alcance` y `lf-oportunidades` (reporte de deuda) |
| `proyecto-de-trabajo.md` | Rescatado en `lf-asistente/references/proyecto.md` |
| `tipos-de-tarea.md` y "el desarrollador es tu copiloto" | Rescatados en `lf-delegacion` y `references/tipos.md`, con la escalera de atasco |
| `punto-focal.md` (las ocho preguntas, precedentes, desorden) | Repartido entre `lf-comprension`, `lf-solucion` y `lf-desorden` |
| `simulacion.md` (técnicas de caja negra, ficha de entornos) | Rescatado en `lf-simulacion`, `lf-entornos` y `lf-plantilla-entornos` |
| lf-change (estados, codificación heredada, respaldo) | Rescatado en `lf-cambio` y `lf-legado`. El respaldo pasa a un hook (`lf-respaldo`). |
| lf-branch, lf-diagnose (escalera de costo), lf-test (prioridad de casos, interrupciones), lf-optimize, lf-memory, lf-propose, lf-debate | Rescatados en `lf-versiones`, `lf-diagnostico`, `lf-pruebas`, `lf-rendimiento`, `lf-memoria`, `lf-oportunidades` y `lf-debate` |
| Plantillas SETUP, ARCHITECTURE y PRODUCT, `exploracion.md`, `conceptos.md`, bloque gestionado de lf-init, lf-help | Rescatados en `plantillas/documentos/`, `lf-documentador`, `/lf-iniciar` y `/lf-ayuda` |
| `lf-guard.mjs`: APPLY exacto, secretos, git, ramas protegidas, clasificación de herramientas, parches de Codex, depuración | Rescatado y ampliado en `lf-hooks.mjs`: escritura por terminal, agentes, producción, respaldo, formato, salidas, informe, inicio y cierre |
| Lista de comprobación del crítico, pasos del verificador | Rescatados en `lf-critico` y `lf-verificador` |
| Lanzamiento de ayudantes por umbrales (commits, archivos leídos) | Descartado. Los agentes se lanzan por definición (`lf-orquestacion`). |
| Agentes que escribían borradores, notas o archivos de avance | Descartado. Los agentes no escriben; el asistente guarda en el expediente. |
| Excepciones de lf-guard para SETUP, ARCHITECTURE, PRODUCT, AGENTS y borradores | Descartado. Esos documentos piden APPLY; solo `.legacyforge/` queda exenta. |
| Skills por fase (`lf-analyze`, `lf-diagnose`, `lf-change`…) con su propia orquestación | Descartado. Una skill por habilidad; los flujos viven en `lf-asistente/references/flujos.md`. |
| lf-core, lf-team, lf-delegate (como contenedores) | Descartados como piezas. Su contenido útil quedó en el núcleo, en `lf-orquestacion` y en `lf-delegacion`. |
| lf-setup, lf-architecture y lf-product como skills sueltas | Descartadas. Las reemplaza el Documentador con `/lf-iniciar`. |
| Nombres en inglés (`lf-change`, `lf-test`…) | Descartados. Todo en español, como la definición. |
| `.lf-change-respaldo/`, `.lf-borradores/`, `.lf-setup-progreso.md` | Descartados. Todo se guarda en `.legacyforge/`. |
