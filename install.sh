#!/usr/bin/env bash
# Instalador de LegacyForge para Claude Code, GitHub Copilot y Codex
# (macOS, Linux, WSL, Git Bash). Descarga el repositorio y ejecuta
# scripts/instalar.mjs con las mismas opciones. Requiere Node.js 18+.
#
# Uso rápido (sin clonar):
#   curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash -s -- --harness claude
#   curl -fsSL https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.sh | bash -s -- --scope project --project ~/src/facturacion
#
# Desde un clon:
#   ./install.sh --harness copilot,codex --scope project --project ~/src/facturacion
#
# Opciones propias de este script (el resto pasa al instalador; ver --help):
#   --ref REF       rama o etiqueta a descargar (por defecto: main, o $LF_REF)
#   --source RUTA   instala desde una copia local del repositorio

set -euo pipefail

REPO="thejoemr/legacy-forge"
REF="${LF_REF:-main}"
SOURCE=""
ARGS=()
TMP=""

die() { printf 'error: %s\n' "$*" >&2; exit 1; }
cleanup() { if [ -n "$TMP" ]; then rm -rf "$TMP"; fi; }
trap cleanup EXIT

while [ $# -gt 0 ]; do
  case "$1" in
    --ref)    REF="${2:?falta el valor de --ref}"; shift 2 ;;
    --source) SOURCE="${2:?falta el valor de --source}"; shift 2 ;;
    *)        ARGS+=("$1"); shift ;;
  esac
done

command -v node >/dev/null 2>&1 || die "LegacyForge necesita Node.js 18 o superior en el PATH (https://nodejs.org)"
major="$(node -p 'process.versions.node.split(".")[0]')"
[ "$major" -ge 18 ] || die "LegacyForge necesita Node.js 18 o superior (tienes $(node --version))"

if [ -z "$SOURCE" ] && [ -n "${BASH_SOURCE[0]:-}" ] && [ -f "${BASH_SOURCE[0]}" ]; then
  dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  if [ -f "$dir/scripts/instalar.mjs" ]; then SOURCE="$dir"; fi
fi

if [ -z "$SOURCE" ]; then
  TMP="$(mktemp -d)"
  url="https://codeload.github.com/$REPO/tar.gz/$REF"
  printf 'Descargando %s (%s)...\n' "$REPO" "$REF"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" | tar -xz -C "$TMP"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- "$url" | tar -xz -C "$TMP"
  else
    die "necesito curl o wget para descargar el paquete (o usa --source)"
  fi
  for d in "$TMP"/*/; do SOURCE="${d%/}"; break; done
fi

[ -f "$SOURCE/scripts/instalar.mjs" ] || die "no encuentro scripts/instalar.mjs en $SOURCE (¿la referencia $REF es anterior a 1.0?)"
node "$SOURCE/scripts/instalar.mjs" ${ARGS[@]+"${ARGS[@]}"}
