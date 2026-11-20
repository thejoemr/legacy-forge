#!/usr/bin/env bash
# Instalador de LegacyForge para Claude Code, GitHub Copilot y Codex.
#
# Uso rápido (sin clonar):
#   curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash -s -- --harness claude --hooks
#
# Desde un clon:
#   ./install.sh --harness copilot,codex --scope project --project ~/src/facturacion
#
# Ejecuta ./install.sh --help para ver todas las opciones.

set -euo pipefail

REPO="thejoemr/legacy-forge"
REF="${LF_REF:-main}"

SKILLS=(lf-analyze lf-architecture lf-branch lf-change lf-core lf-debate
  lf-delegate lf-diagnose lf-explain lf-help lf-init lf-memory lf-optimize
  lf-product lf-propose lf-setup lf-team lf-test)
AGENTS=(lf-explorador lf-critico lf-verificador lf-escenarios)

HARNESS=""
SCOPE="user"
PROJECT="$PWD"
WITH_AGENTS=1
WITH_HOOKS=0
UNINSTALL=0
DRY_RUN=0
SOURCE=""
TMP=""

usage() {
  cat <<'EOF'
Instalador de LegacyForge

Opciones:
  -t, --harness LISTA   claude, copilot, codex o all (separados por coma).
                        Sin esta opción se detectan los asistentes instalados.
  -s, --scope ÁMBITO    user (todos tus proyectos, por defecto) o project.
  -p, --project RUTA    Carpeta del repositorio para --scope project y para
                        la protección de Copilot. Por defecto, la actual.
      --hooks           Instala también la protección de cambios (lf-guard).
                        Requiere Node.js 18+. En Copilot solo con --scope project.
      --no-agents       No instala los ayudantes de solo lectura.
      --ref REF         Rama o etiqueta a descargar (por defecto: main).
      --source RUTA     Instala desde una copia local del repositorio.
      --uninstall       Quita lo que instala este script, sin tocar nada más.
      --dry-run         Muestra lo que haría, sin cambiar nada.
  -h, --help            Esta ayuda.

Ejemplos:
  install.sh --harness claude --hooks
  install.sh --harness copilot,codex --scope project --project ~/src/nomina
  install.sh --harness all --uninstall
EOF
}

say()  { printf '%s\n' "$*"; }
warn() { printf 'aviso: %s\n' "$*" >&2; }
die()  { printf 'error: %s\n' "$*" >&2; exit 1; }

run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    printf '  [dry-run] %s\n' "$*"
  else
    "$@"
  fi
}

cleanup() { if [ -n "$TMP" ]; then rm -rf "$TMP"; fi; }
trap cleanup EXIT

while [ $# -gt 0 ]; do
  case "$1" in
    -t|--harness) HARNESS="${HARNESS:+$HARNESS,}${2:?falta el valor de --harness}"; shift 2 ;;
    -s|--scope)   SCOPE="${2:?falta el valor de --scope}"; shift 2 ;;
    -p|--project) PROJECT="${2:?falta el valor de --project}"; shift 2 ;;
    --hooks)      WITH_HOOKS=1; shift ;;
    --no-agents)  WITH_AGENTS=0; shift ;;
    --ref)        REF="${2:?falta el valor de --ref}"; shift 2 ;;
    --source)     SOURCE="${2:?falta el valor de --source}"; shift 2 ;;
    --uninstall)  UNINSTALL=1; shift ;;
    --dry-run)    DRY_RUN=1; shift ;;
    -h|--help)    usage; exit 0 ;;
    *) usage >&2; die "opción desconocida: $1" ;;
  esac
done

case "$SCOPE" in user|project) ;; *) die "--scope debe ser user o project" ;; esac
[ -d "$PROJECT" ] || die "no existe la carpeta del proyecto: $PROJECT"
PROJECT="$(cd "$PROJECT" && pwd)"

# --- Asistentes ------------------------------------------------------------

detect() {
  local found=""
  if command -v claude >/dev/null 2>&1 || [ -d "$HOME/.claude" ]; then found="$found,claude"; fi
  if command -v copilot >/dev/null 2>&1 || command -v code >/dev/null 2>&1 || [ -d "$HOME/.copilot" ]; then found="$found,copilot"; fi
  if command -v codex >/dev/null 2>&1 || [ -d "$HOME/.codex" ]; then found="$found,codex"; fi
  printf '%s' "${found#,}"
}

if [ -z "$HARNESS" ]; then
  HARNESS="$(detect)"
  [ -n "$HARNESS" ] || die "no detecté Claude Code, Copilot ni Codex. Indica cuál con --harness claude|copilot|codex|all"
  say "Asistentes detectados: ${HARNESS//,/, }"
fi
HARNESS="${HARNESS//all/claude,copilot,codex}"

WANT_CLAUDE=0; WANT_COPILOT=0; WANT_CODEX=0
IFS=',' read -r -a _list <<<"$HARNESS"
for h in "${_list[@]}"; do
  case "$h" in
    claude)  WANT_CLAUDE=1 ;;
    copilot) WANT_COPILOT=1 ;;
    codex)   WANT_CODEX=1 ;;
    "") ;;
    *) die "asistente desconocido: $h (usa claude, copilot, codex o all)" ;;
  esac
done

# --- Origen ----------------------------------------------------------------

SCRIPT_DIR=""
if [ -n "${BASH_SOURCE[0]:-}" ] && [ -f "${BASH_SOURCE[0]}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

if [ "$UNINSTALL" -eq 0 ]; then
  if [ -z "$SOURCE" ] && [ -n "$SCRIPT_DIR" ] && [ -f "$SCRIPT_DIR/skills/lf-core/SKILL.md" ]; then
    SOURCE="$SCRIPT_DIR"
  fi
  if [ -z "$SOURCE" ]; then
    TMP="$(mktemp -d)"
    url="https://codeload.github.com/$REPO/tar.gz/$REF"
    say "Descargando $REPO ($REF)..."
    if command -v curl >/dev/null 2>&1; then
      curl -fsSL "$url" | tar -xz -C "$TMP"
    elif command -v wget >/dev/null 2>&1; then
      wget -qO- "$url" | tar -xz -C "$TMP"
    else
      die "necesito curl o wget para descargar el paquete (o usa --source)"
    fi
    for d in "$TMP"/*/; do SOURCE="${d%/}"; break; done
  fi
  [ -f "$SOURCE/skills/lf-core/SKILL.md" ] || die "no encuentro las skills en $SOURCE"
  VERSION="$(cat "$SOURCE/VERSION" 2>/dev/null || echo '?')"
fi

# --- Operaciones -----------------------------------------------------------

prune() {  # borra la carpeta si quedó vacía
  if [ "$DRY_RUN" -eq 0 ] && [ -d "$1" ]; then rmdir "$1" 2>/dev/null || true; fi
}

install_skills() {  # $1 = carpeta destino
  local dest="$1"
  run mkdir -p "$dest"
  for s in "${SKILLS[@]}"; do
    run rm -rf "${dest:?}/$s"
    run cp -R "$SOURCE/skills/$s" "$dest/$s"
  done
  say "  skills    -> $dest"
}

remove_skills() {
  local dest="$1"
  for s in "${SKILLS[@]}"; do
    if [ -e "$dest/$s" ]; then run rm -rf "${dest:?}/$s"; fi
  done
  prune "$dest"
  say "  skills    quitadas de $dest"
}

install_agents() {  # $1 = carpeta destino, $2 = extensión (.md o .agent.md)
  local dest="$1" ext="$2"
  run mkdir -p "$dest"
  for a in "${AGENTS[@]}"; do
    run cp "$SOURCE/agents/$a.md" "$dest/$a$ext"
  done
  say "  ayudantes -> $dest"
}

remove_agents() {
  local dest="$1" ext="$2"
  for a in "${AGENTS[@]}"; do
    if [ -e "$dest/$a$ext" ]; then run rm -f "$dest/$a$ext"; fi
  done
  prune "$dest"
  say "  ayudantes quitados de $dest"
}

need_node() {
  command -v node >/dev/null 2>&1 || die "la protección de cambios necesita Node.js 18 o superior en el PATH"
  local major
  major="$(node -p 'process.versions.node.split(".")[0]')"
  [ "$major" -ge 18 ] || die "la protección de cambios necesita Node.js 18+ (tienes $(node --version))"
}

hooks_config() {  # $1 = merge|remove, $2 = settings.json, $3 = comando (merge)
  local script="${SOURCE:-}/scripts/hooks-config.mjs"
  if [ "$UNINSTALL" -eq 1 ] && { [ -z "${SOURCE:-}" ] || [ ! -f "$script" ]; }; then
    script="$(dirname "$2")/hooks/lf-hooks-config.mjs"
  fi
  if [ "$DRY_RUN" -eq 1 ]; then
    printf '  [dry-run] node hooks-config.mjs %s %s\n' "$1" "$2"
    return
  fi
  if [ -f "$script" ] && command -v node >/dev/null 2>&1; then
    node "$script" "$1" "$2" "${3:-}"
  else
    warn "no pude actualizar $2; quita a mano las entradas que llaman a lf-guard.mjs"
  fi
}

do_claude() {
  local base settings cmd
  if [ "$SCOPE" = user ]; then base="$HOME/.claude"; else base="$PROJECT/.claude"; fi
  settings="$base/settings.json"
  say "Claude Code ($SCOPE):"
  if [ "$UNINSTALL" -eq 1 ]; then
    remove_skills "$base/skills"
    remove_agents "$base/agents" ".md"
    if [ -f "$base/hooks/lf-guard.mjs" ]; then
      hooks_config remove "$settings"
      run rm -f "$base/hooks/lf-guard.mjs" "$base/hooks/lf-hooks-config.mjs"
      prune "$base/hooks"
      say "  protección quitada"
    fi
    return
  fi
  install_skills "$base/skills"
  if [ "$WITH_AGENTS" -eq 1 ]; then install_agents "$base/agents" ".md"; fi
  if [ "$WITH_HOOKS" -eq 1 ]; then
    need_node
    run mkdir -p "$base/hooks"
    run cp "$SOURCE/hooks/lf-guard.mjs" "$base/hooks/lf-guard.mjs"
    run cp "$SOURCE/scripts/hooks-config.mjs" "$base/hooks/lf-hooks-config.mjs"
    if [ "$SCOPE" = user ]; then
      cmd="node \"$base/hooks/lf-guard.mjs\""
    else
      cmd='node "$CLAUDE_PROJECT_DIR/.claude/hooks/lf-guard.mjs"'
    fi
    hooks_config merge "$settings" "$cmd"
    say "  protección -> $settings"
  fi
}

do_copilot() {
  local skills agents ext
  if [ "$SCOPE" = user ]; then
    skills="$HOME/.agents/skills"; agents="$HOME/.copilot/agents"; ext=".agent.md"
  else
    skills="$PROJECT/.agents/skills"; agents="$PROJECT/.claude/agents"; ext=".md"
  fi
  say "GitHub Copilot ($SCOPE):"
  if [ "$UNINSTALL" -eq 1 ]; then
    remove_skills "$skills"
    remove_agents "$agents" "$ext"
    if [ -f "$PROJECT/.github/hooks/legacyforge.json" ]; then
      run rm -f "$PROJECT/.github/hooks/legacyforge.json" "$PROJECT/.github/hooks/lf-guard.mjs"
      prune "$PROJECT/.github/hooks"
      say "  protección quitada de $PROJECT/.github/hooks"
    fi
    return
  fi
  install_skills "$skills"
  if [ "$WITH_AGENTS" -eq 1 ]; then install_agents "$agents" "$ext"; fi
  if [ "$WITH_HOOKS" -eq 1 ]; then
    if [ "$SCOPE" = user ]; then
      warn "en Copilot la protección se instala por repositorio: repite con --scope project --project <repo> --hooks"
    else
      need_node
      run mkdir -p "$PROJECT/.github/hooks"
      run cp "$SOURCE/hooks/lf-guard.mjs" "$PROJECT/.github/hooks/lf-guard.mjs"
      run cp "$SOURCE/hooks/copilot-hooks.json" "$PROJECT/.github/hooks/legacyforge.json"
      say "  protección -> $PROJECT/.github/hooks (en vista previa: compruébala, ver README)"
    fi
  fi
}

do_codex() {
  local skills
  if [ "$SCOPE" = user ]; then skills="$HOME/.agents/skills"; else skills="$PROJECT/.agents/skills"; fi
  say "Codex ($SCOPE):"
  if [ "$UNINSTALL" -eq 1 ]; then remove_skills "$skills"; return; fi
  if [ "$WANT_COPILOT" -eq 1 ]; then
    say "  skills    -> $skills (compartidas con Copilot)"
  else
    install_skills "$skills"
  fi
  if [ "$WITH_HOOKS" -eq 1 ]; then warn "Codex no tiene hooks: la regla de APPLY la aplican las skills"; fi
  if [ "$WITH_AGENTS" -eq 1 ]; then say "  ayudantes: Codex no usa subagentes; el copiloto hace esas revisiones en pasadas"; fi
}

if [ "$DRY_RUN" -eq 1 ]; then say "Modo dry-run: no se cambia nada."; fi
if [ "$UNINSTALL" -eq 1 ]; then
  say "Desinstalando LegacyForge..."
else
  say "Instalando LegacyForge $VERSION desde $SOURCE"
fi

if [ "$WANT_CLAUDE" -eq 1 ]; then do_claude; fi
if [ "$WANT_COPILOT" -eq 1 ]; then do_copilot; fi
if [ "$WANT_CODEX" -eq 1 ]; then do_codex; fi

if [ "$UNINSTALL" -eq 0 ]; then
  say ""
  say "Listo. Abre una sesión nueva de tu asistente y escribe /lf-help (en Codex, \$lf-help)."
  say "Si es la primera vez en un proyecto, sigue con /lf-init."
fi
