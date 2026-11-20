# LegacyForge

Un copiloto para quien mantiene un sistema heredado. Le ahorra lo técnico
y le enseña el negocio mientras trabaja, para que decida con criterio de
empresa sin romper lo que ya funciona: entiende el punto que se va a
tocar antes de proponer, diagnostica de lo más barato a lo más caro,
propone el cambio que encaja con el código que lo rodea y no edita nada
sin que escribas `APPLY`.

Funciona sobre **Claude Code**, **GitHub Copilot** (VS Code y CLI) y
**Codex**, y en cualquier asistente compatible con
[Agent Skills](https://agentskills.io). Versión actual: **0.4.1**
([cambios](CHANGELOG.md)).

| Pieza | Qué es | ¿Obligatoria? |
|---|---|---|
| 18 skills (`skills/`) | El criterio y los procedimientos: entender, diagnosticar, analizar, cambiar, probar, debatir, proponer y recordar | Sí |
| 4 ayudantes (`agents/`) | Subagentes de solo lectura: explorador, crítico, verificador y simulador de escenarios | No |
| Protección de cambios (`hooks/`) | Hook `lf-guard` que bloquea ediciones sin `APPLY`, lectura de secretos y git destructivo | No, recomendada |

La guía de uso completa está en [docs/GUIA.md](docs/GUIA.md).

## Instalación rápida

| Asistente | Comando |
|---|---|
| Claude Code | `/plugin marketplace add thejoemr/legacy-forge` y luego `/plugin install legacyforge@legacy-forge` |
| Copilot CLI | `copilot plugin marketplace add thejoemr/legacy-forge && copilot plugin install legacyforge@legacy-forge` |
| Copilot en VS Code, Codex o varios a la vez (macOS, Linux, WSL) | `curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh \| bash` |
| Lo mismo en Windows (PowerShell) | `irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1 \| iex` |

El instalador sin opciones detecta qué asistentes tienes (Claude Code,
Copilot, Codex) e instala las skills y los ayudantes a nivel de usuario,
para todos tus proyectos. Después, abre una sesión nueva y escribe
`/lf-help` (en Codex, `$lf-help`).

Requisitos: nada para las skills. Node.js 18 o superior para la
protección de cambios. `curl` o `wget` en macOS y Linux; PowerShell 5.1 o
superior en Windows.

## Claude Code

### Como plugin (recomendado)

Dentro de Claude Code:

```text
/plugin marketplace add thejoemr/legacy-forge
/plugin install legacyforge@legacy-forge
/plugin install legacyforge-guard@legacy-forge
```

O desde la terminal:

```bash
claude plugin marketplace add thejoemr/legacy-forge
claude plugin install legacyforge@legacy-forge
claude plugin install legacyforge-guard@legacy-forge   # opcional: protección de cambios
```

- `legacyforge` instala las 18 skills y los 4 ayudantes.
- `legacyforge-guard` instala la protección de cambios. Es opcional y se
  puede desactivar sin quitar las skills (`/plugin` → deshabilitar).
- Las skills de un plugin llevan el prefijo del plugin: escribe
  `/legacyforge:lf-help`, `/legacyforge:lf-init`, etc.
- Para actualizar: `/plugin marketplace update legacy-forge`.

### Con el instalador

Si prefieres los comandos cortos (`/lf-help`) o quieres instalar dentro
de un repositorio para todo el equipo:

```bash
# Para todos tus proyectos, con la protección de cambios
curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash -s -- --harness claude --hooks

# Solo en un repositorio (lo que se confirme en git lo tendrá todo el equipo)
curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash -s -- --harness claude --scope project --project ~/src/facturacion --hooks
```

```powershell
# Windows
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1))) -Harness claude -Hooks
```

Con `--hooks`, el instalador agrega las entradas de `lf-guard` a tu
`settings.json` sin tocar lo demás y deja un respaldo en
`settings.json.lf-bak`.

## GitHub Copilot

### Copilot CLI (plugin)

```bash
copilot plugin marketplace add thejoemr/legacy-forge
copilot plugin install legacyforge@legacy-forge
```

Instala las 18 skills. Para actualizar:
`copilot plugin update legacyforge@legacy-forge`. Los ayudantes y la
protección de cambios se instalan con el instalador (abajo).

### Copilot en VS Code (y Copilot CLI sin plugin)

```bash
# Skills en ~/.agents/skills y ayudantes en ~/.copilot/agents
curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash -s -- --harness copilot

# Protección de cambios: se instala por repositorio, en .github/hooks
curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash -s -- --harness copilot --scope project --project ~/src/facturacion --hooks
```

```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1))) -Harness copilot
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1))) -Harness copilot -Scope project -Project C:\src\facturacion -Hooks
```

- Los ayudantes necesitan la herramienta de subagentes activada en el
  selector de herramientas del chat.
- Los hooks de Copilot están en vista previa y tu organización puede
  tenerlos desactivados. Compruébalo: pide un cambio pequeño y, sin
  escribir `APPLY`, verifica que la edición se bloquea. Si no, define
  `LF_GUARD_DEBUG=1`, repite y revisa `legacyforge-guard/debug.log` en tu
  carpeta temporal.

## Codex

```bash
curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash -s -- --harness codex
```

```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1))) -Harness codex
```

Instala las skills en `~/.agents/skills` (o en `.agents/skills` del
repositorio con `--scope project`). Invócalas con `$`: `$lf-help`,
`$lf-init`. Codex no tiene subagentes ni hooks: el copiloto hace las
revisiones en pasadas separadas y la regla de `APPLY` la aplican las
skills.

## Otros asistentes compatibles con Agent Skills

Cursor, Gemini CLI, OpenCode y otros leen el mismo formato. Puedes copiar
la carpeta `skills/` completa a la carpeta de skills de tu asistente, o
usar la herramienta de terceros [`skills`](https://github.com/vercel-labs/skills):

```bash
npx skills add thejoemr/legacy-forge --skill '*'
```

Instala siempre las 18 juntas: comparten referencias en
`skills/lf-core/references/`.

## Opciones del instalador

| `install.sh` | `install.ps1` | Qué hace |
|---|---|---|
| `--harness claude,copilot,codex` o `all` | `-Harness ...` | Asistentes. Sin esta opción, los detecta |
| `--scope user` (por defecto) o `project` | `-Scope ...` | Para todos tus proyectos o solo un repositorio |
| `--project RUTA` | `-Project RUTA` | Repositorio para `project` y para la protección de Copilot |
| `--hooks` | `-Hooks` | Agrega la protección de cambios (Node.js 18+) |
| `--no-agents` | `-NoAgents` | No instala los ayudantes |
| `--ref v0.4.1` | `-Ref v0.4.1` | Instala una versión concreta (etiqueta o rama) |
| `--source RUTA` | `-Source RUTA` | Instala desde un clon local |
| `--uninstall` | `-Uninstall` | Quita solo lo que instala LegacyForge |
| `--dry-run` | `-DryRun` | Muestra lo que haría sin cambiar nada |

Dónde queda cada cosa:

| Asistente | Ámbito | Skills | Ayudantes | Protección |
|---|---|---|---|---|
| Claude Code | usuario | `~/.claude/skills` | `~/.claude/agents` | `~/.claude/hooks` + `~/.claude/settings.json` |
| Claude Code | proyecto | `.claude/skills` | `.claude/agents` | `.claude/hooks` + `.claude/settings.json` |
| Copilot | usuario | `~/.agents/skills` | `~/.copilot/agents` | solo por proyecto |
| Copilot | proyecto | `.agents/skills` | `.claude/agents` | `.github/hooks` |
| Codex | usuario | `~/.agents/skills` | no aplica | no aplica |
| Codex | proyecto | `.agents/skills` | no aplica | no aplica |

Copilot y Codex comparten `~/.agents/skills`. Copilot también lee
`~/.claude/skills`; si instalas para Claude Code y Copilot a la vez, verá
las skills en las dos carpetas.

## Actualizar y desinstalar

- Plugin de Claude Code: `/plugin marketplace update legacy-forge`.
- Plugin de Copilot CLI: `copilot plugin update legacyforge@legacy-forge`.
- Instalador: vuelve a correrlo con las mismas opciones. Reemplaza cada
  carpeta `lf-*` completa y no toca tus otras skills.
- Si el bloque de `AGENTS.md` de un proyecto es de una versión anterior,
  ejecuta `/lf-init` otra vez; `/lf-help` te avisa cuando hace falta.
- Desinstalar: `install.sh --harness all --uninstall` (agrega
  `--scope project --project RUTA` para un repositorio).

## Primeros pasos

1. Abre el chat de tu asistente en modo agente, en la carpeta del
   proyecto.
2. Escribe `/lf-help`. Revisa el proyecto y te dice por dónde empezar.
3. La primera vez, `/lf-init`: resume cómo correr el proyecto, cómo está
   construido y para qué existe, y prepara `AGENTS.md`. Una sola
   confirmación al final.
4. Después, háblale como a un colega: "a un cliente le sale saldo
   insuficiente y sí tiene saldo", "agrega el descuento por pronto pago".
   Antes de tocar cualquier archivo te muestra el cambio y espera que
   escribas `APPLY`.

## Estructura del repositorio

```text
skills/                 las 18 skills (formato Agent Skills)
agents/                 ayudantes de solo lectura y el simulador de pruebas
hooks/                  lf-guard y su configuración para Claude Code y Copilot
plugins/legacyforge-guard/   plugin de Claude Code con la protección de cambios
.claude-plugin/         plugin y marketplace de Claude Code (los lee también Copilot CLI)
plugin.json             manifiesto de plugin para Copilot CLI
install.sh, install.ps1 instaladores
scripts/                comprobaciones, pruebas del guard e índice de skills
pruebas/                escenarios de simulación e informe
docs/                   guía de uso e historial de diseño
```

## Desarrollo

```bash
node scripts/check.mjs          # encabezados, referencias, versiones, listas e índice
node scripts/test-guard.mjs     # 57 casos del guard
node scripts/indice-skills.mjs  # regenera pruebas/indice-skills.md tras cambiar una descripción
claude plugin validate .        # valida el plugin de Claude Code
```

Para publicar una versión: actualiza `VERSION`, la versión en
`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`,
`plugin.json`, `plugins/legacyforge-guard/.claude-plugin/plugin.json` y la
segunda línea de `skills/lf-init/assets/plantilla-AGENTS.md`; agrega la
sección en `CHANGELOG.md`; corre `node scripts/check.mjs` y crea la
etiqueta `vX.Y.Z`. Si cambias `hooks/lf-guard.mjs`, cópialo también a
`plugins/legacyforge-guard/hooks/`. `node scripts/check.mjs` avisa si
algo de esto no cuadra.

Antes de cambiar una skill, lee la sección "Probar el paquete" de la
[guía](docs/GUIA.md): los escenarios de `pruebas/` con el agente
`lf-simulador` muestran dónde falla el texto antes de llevarlo a un
proyecto real.
