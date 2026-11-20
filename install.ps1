<#
.SYNOPSIS
  Instalador de LegacyForge para Claude Code, GitHub Copilot y Codex (Windows PowerShell 5.1+ o PowerShell 7).

.DESCRIPTION
  Uso rapido (sin clonar):
    irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1 | iex
    & ([scriptblock]::Create((irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1))) -Harness claude -Hooks

  Desde un clon:
    .\install.ps1 -Harness copilot,codex -Scope project -Project C:\src\facturacion

.PARAMETER Harness
  claude, copilot, codex o all. Sin este parametro se detectan los asistentes instalados.
.PARAMETER Scope
  user (todos tus proyectos, por defecto) o project.
.PARAMETER Project
  Carpeta del repositorio para -Scope project y para la proteccion de Copilot. Por defecto, la actual.
.PARAMETER Hooks
  Instala tambien la proteccion de cambios (lf-guard). Requiere Node.js 18+. En Copilot solo con -Scope project.
.PARAMETER NoAgents
  No instala los ayudantes de solo lectura.
.PARAMETER Ref
  Rama o etiqueta a descargar (por defecto: main).
.PARAMETER Source
  Instala desde una copia local del repositorio.
.PARAMETER Uninstall
  Quita lo que instala este script, sin tocar nada mas.
.PARAMETER DryRun
  Muestra lo que haria, sin cambiar nada.
#>
[CmdletBinding()]
param(
  [string[]]$Harness = @(),
  [ValidateSet('user', 'project')][string]$Scope = 'user',
  [string]$Project = (Get-Location).Path,
  [switch]$Hooks,
  [switch]$NoAgents,
  [string]$Ref = $(if ($env:LF_REF) { $env:LF_REF } else { 'main' }),
  [string]$Source = '',
  [switch]$Uninstall,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$Repo = 'thejoemr/legacy-forge'
$Skills = @('lf-analyze', 'lf-architecture', 'lf-branch', 'lf-change', 'lf-core', 'lf-debate',
  'lf-delegate', 'lf-diagnose', 'lf-explain', 'lf-help', 'lf-init', 'lf-memory', 'lf-optimize',
  'lf-product', 'lf-propose', 'lf-setup', 'lf-team', 'lf-test')
$Agents = @('lf-explorador', 'lf-critico', 'lf-verificador', 'lf-escenarios')
$UserHome = [Environment]::GetFolderPath('UserProfile')
$Tmp = $null

function Say([string]$m) { Write-Host $m }
function Warn([string]$m) { Write-Warning $m }
function Fail([string]$m) { throw "error: $m" }

function Invoke-Step([string]$Description, [scriptblock]$Action) {
  if ($DryRun) { Write-Host "  [dry-run] $Description" } else { & $Action }
}

function Copy-Dir([string]$From, [string]$To) {
  Invoke-Step "copiar $From -> $To" {
    if (Test-Path -LiteralPath $To) { Remove-Item -LiteralPath $To -Recurse -Force }
    Copy-Item -LiteralPath $From -Destination $To -Recurse -Force
  }
}

function Ensure-Dir([string]$Path) {
  Invoke-Step "crear $Path" { New-Item -ItemType Directory -Force -Path $Path | Out-Null }
}

function Remove-IfEmpty([string]$Path) {
  if (-not $DryRun -and (Test-Path -LiteralPath $Path) -and -not (Get-ChildItem -LiteralPath $Path -Force)) {
    Remove-Item -LiteralPath $Path -Force
  }
}

function Remove-PathIfExists([string]$Path) {
  if (Test-Path -LiteralPath $Path) {
    Invoke-Step "borrar $Path" { Remove-Item -LiteralPath $Path -Recurse -Force }
  }
}

# --- Asistentes ------------------------------------------------------------

function Test-Cmd([string]$Name) { [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

if (-not (Test-Path -LiteralPath $Project)) { Fail "no existe la carpeta del proyecto: $Project" }
$Project = (Resolve-Path -LiteralPath $Project).Path

$list = @($Harness | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim().ToLower() } | Where-Object { $_ })
if ($list.Count -eq 0) {
  if ((Test-Cmd 'claude') -or (Test-Path (Join-Path $UserHome '.claude'))) { $list += 'claude' }
  if ((Test-Cmd 'copilot') -or (Test-Cmd 'code') -or (Test-Path (Join-Path $UserHome '.copilot'))) { $list += 'copilot' }
  if ((Test-Cmd 'codex') -or (Test-Path (Join-Path $UserHome '.codex'))) { $list += 'codex' }
  if ($list.Count -eq 0) { Fail 'no detecte Claude Code, Copilot ni Codex. Indica cual con -Harness claude|copilot|codex|all' }
  Say ("Asistentes detectados: " + ($list -join ', '))
}
if ($list -contains 'all') { $list = @('claude', 'copilot', 'codex') }
foreach ($h in $list) {
  if ($h -notin @('claude', 'copilot', 'codex')) { Fail "asistente desconocido: $h (usa claude, copilot, codex o all)" }
}
$WantCopilot = $list -contains 'copilot'

# --- Origen ----------------------------------------------------------------

$Version = '?'
try {
  if (-not $Uninstall) {
    if (-not $Source -and $PSScriptRoot -and (Test-Path (Join-Path $PSScriptRoot 'skills/lf-core/SKILL.md'))) {
      $Source = $PSScriptRoot
    }
    if (-not $Source) {
      $Tmp = Join-Path ([IO.Path]::GetTempPath()) ("legacyforge-" + [guid]::NewGuid())
      New-Item -ItemType Directory -Path $Tmp | Out-Null
      $zip = Join-Path $Tmp 'lf.zip'
      Say "Descargando $Repo ($Ref)..."
      [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
      Invoke-WebRequest -UseBasicParsing -Uri "https://codeload.github.com/$Repo/zip/$Ref" -OutFile $zip
      Expand-Archive -LiteralPath $zip -DestinationPath $Tmp -Force
      $Source = (Get-ChildItem -LiteralPath $Tmp -Directory | Select-Object -First 1).FullName
    }
    if (-not (Test-Path (Join-Path $Source 'skills/lf-core/SKILL.md'))) { Fail "no encuentro las skills en $Source" }
    $vf = Join-Path $Source 'VERSION'
    if (Test-Path $vf) { $Version = (Get-Content -LiteralPath $vf -Raw).Trim() }
  }

  # --- Operaciones ---------------------------------------------------------

  function Install-Skills([string]$Dest) {
    Ensure-Dir $Dest
    foreach ($s in $Skills) { Copy-Dir (Join-Path $Source "skills/$s") (Join-Path $Dest $s) }
    Say "  skills    -> $Dest"
  }

  function Remove-Skills([string]$Dest) {
    foreach ($s in $Skills) { Remove-PathIfExists (Join-Path $Dest $s) }
    Remove-IfEmpty $Dest
    Say "  skills    quitadas de $Dest"
  }

  function Install-Agents([string]$Dest, [string]$Ext) {
    Ensure-Dir $Dest
    foreach ($a in $Agents) {
      $from = Join-Path $Source "agents/$a.md"; $to = Join-Path $Dest "$a$Ext"
      Invoke-Step "copiar $from -> $to" { Copy-Item -LiteralPath $from -Destination $to -Force }
    }
    Say "  ayudantes -> $Dest"
  }

  function Remove-Agents([string]$Dest, [string]$Ext) {
    foreach ($a in $Agents) { Remove-PathIfExists (Join-Path $Dest "$a$Ext") }
    Remove-IfEmpty $Dest
    Say "  ayudantes quitados de $Dest"
  }

  function Assert-Node {
    if (-not (Test-Cmd 'node')) { Fail 'la proteccion de cambios necesita Node.js 18 o superior en el PATH' }
    $major = [int](& node -p "process.versions.node.split('.')[0]")
    if ($major -lt 18) { Fail "la proteccion de cambios necesita Node.js 18+ (tienes $(& node --version))" }
  }

  function Update-HooksConfig([string]$Action, [string]$Settings, [string]$Command = '') {
    $script = if ($Source) { Join-Path $Source 'scripts/hooks-config.mjs' } else { '' }
    if (-not $script -or -not (Test-Path $script)) {
      $script = Join-Path (Split-Path $Settings -Parent) 'hooks/lf-hooks-config.mjs'
    }
    if ($DryRun) { Write-Host "  [dry-run] node hooks-config.mjs $Action $Settings"; return }
    if ((Test-Path $script) -and (Test-Cmd 'node')) {
      if ($Action -eq 'merge') { & node $script merge $Settings $Command } else { & node $script remove $Settings }
      if ($LASTEXITCODE -ne 0) { Fail "no pude actualizar $Settings" }
    } else {
      Warn "no pude actualizar $Settings; quita a mano las entradas que llaman a lf-guard.mjs"
    }
  }

  function Invoke-Claude {
    $base = if ($Scope -eq 'user') { Join-Path $UserHome '.claude' } else { Join-Path $Project '.claude' }
    $settings = Join-Path $base 'settings.json'
    Say "Claude Code ($Scope):"
    if ($Uninstall) {
      Remove-Skills (Join-Path $base 'skills')
      Remove-Agents (Join-Path $base 'agents') '.md'
      if (Test-Path (Join-Path $base 'hooks/lf-guard.mjs')) {
        Update-HooksConfig 'remove' $settings
        Remove-PathIfExists (Join-Path $base 'hooks/lf-guard.mjs')
        Remove-PathIfExists (Join-Path $base 'hooks/lf-hooks-config.mjs')
        Remove-IfEmpty (Join-Path $base 'hooks')
        Say '  proteccion quitada'
      }
      return
    }
    Install-Skills (Join-Path $base 'skills')
    if (-not $NoAgents) { Install-Agents (Join-Path $base 'agents') '.md' }
    if ($Hooks) {
      Assert-Node
      $hd = Join-Path $base 'hooks'
      Ensure-Dir $hd
      Invoke-Step "copiar lf-guard.mjs -> $hd" {
        Copy-Item -LiteralPath (Join-Path $Source 'hooks/lf-guard.mjs') -Destination (Join-Path $hd 'lf-guard.mjs') -Force
        Copy-Item -LiteralPath (Join-Path $Source 'scripts/hooks-config.mjs') -Destination (Join-Path $hd 'lf-hooks-config.mjs') -Force
      }
      if ($Scope -eq 'user') {
        $guard = (Join-Path $hd 'lf-guard.mjs') -replace '\\', '/'
        $cmd = "node `"$guard`""
      } else {
        $cmd = 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/lf-guard.mjs"'
      }
      Update-HooksConfig 'merge' $settings $cmd
      Say "  proteccion -> $settings"
    }
  }

  function Invoke-Copilot {
    if ($Scope -eq 'user') {
      $skills = Join-Path $UserHome '.agents/skills'; $agents = Join-Path $UserHome '.copilot/agents'; $ext = '.agent.md'
    } else {
      $skills = Join-Path $Project '.agents/skills'; $agents = Join-Path $Project '.claude/agents'; $ext = '.md'
    }
    $gh = Join-Path $Project '.github/hooks'
    Say "GitHub Copilot ($Scope):"
    if ($Uninstall) {
      Remove-Skills $skills
      Remove-Agents $agents $ext
      if (Test-Path (Join-Path $gh 'legacyforge.json')) {
        Remove-PathIfExists (Join-Path $gh 'legacyforge.json')
        Remove-PathIfExists (Join-Path $gh 'lf-guard.mjs')
        Remove-IfEmpty $gh
        Say "  proteccion quitada de $gh"
      }
      return
    }
    Install-Skills $skills
    if (-not $NoAgents) { Install-Agents $agents $ext }
    if ($Hooks) {
      if ($Scope -eq 'user') {
        Warn 'en Copilot la proteccion se instala por repositorio: repite con -Scope project -Project <repo> -Hooks'
      } else {
        Assert-Node
        Ensure-Dir $gh
        Invoke-Step "copiar proteccion -> $gh" {
          Copy-Item -LiteralPath (Join-Path $Source 'hooks/lf-guard.mjs') -Destination (Join-Path $gh 'lf-guard.mjs') -Force
          Copy-Item -LiteralPath (Join-Path $Source 'hooks/copilot-hooks.json') -Destination (Join-Path $gh 'legacyforge.json') -Force
        }
        Say "  proteccion -> $gh (en vista previa: compruebala, ver README)"
      }
    }
  }

  function Invoke-Codex {
    $skills = if ($Scope -eq 'user') { Join-Path $UserHome '.agents/skills' } else { Join-Path $Project '.agents/skills' }
    Say "Codex ($Scope):"
    if ($Uninstall) { Remove-Skills $skills; return }
    if ($WantCopilot) { Say "  skills    -> $skills (compartidas con Copilot)" } else { Install-Skills $skills }
    if ($Hooks) { Warn 'Codex no tiene hooks: la regla de APPLY la aplican las skills' }
    if (-not $NoAgents) { Say '  ayudantes: Codex no usa subagentes; el copiloto hace esas revisiones en pasadas' }
  }

  if ($DryRun) { Say 'Modo dry-run: no se cambia nada.' }
  if ($Uninstall) { Say 'Desinstalando LegacyForge...' } else { Say "Instalando LegacyForge $Version desde $Source" }

  if ($list -contains 'claude') { Invoke-Claude }
  if ($list -contains 'copilot') { Invoke-Copilot }
  if ($list -contains 'codex') { Invoke-Codex }

  if (-not $Uninstall) {
    Say ''
    Say 'Listo. Abre una sesion nueva de tu asistente y escribe /lf-help (en Codex, $lf-help).'
    Say 'Si es la primera vez en un proyecto, sigue con /lf-init.'
  }
}
finally {
  if ($Tmp -and (Test-Path -LiteralPath $Tmp)) { Remove-Item -LiteralPath $Tmp -Recurse -Force }
}
