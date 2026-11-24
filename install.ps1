<#
.SYNOPSIS
  Instalador de LegacyForge para Claude Code, GitHub Copilot y Codex (Windows PowerShell 5.1+ o PowerShell 7).

.DESCRIPTION
  Descarga el repositorio y ejecuta scripts/instalar.mjs. Requiere Node.js 18+.

  Uso rapido (sin clonar):
    irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1 | iex
    & ([scriptblock]::Create((irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1))) -Harness claude
    & ([scriptblock]::Create((irm https://raw.githubusercontent.com/thejoemr/legacy-forge/main/install.ps1))) -Scope project -Project C:\src\facturacion

  Desde un clon:
    .\install.ps1 -Harness copilot,codex -Scope project -Project C:\src\facturacion

.PARAMETER Harness
  claude, copilot, codex o all. Sin este parametro se detectan los asistentes instalados.
.PARAMETER Scope
  user (todos tus proyectos, por defecto) o project.
.PARAMETER Project
  Carpeta del proyecto para -Scope project y para los hooks de Copilot. Por defecto, la actual.
.PARAMETER NoHooks
  No instala los hooks (no recomendado).
.PARAMETER NoAgents
  No instala los agentes.
.PARAMETER Ref
  Rama o etiqueta a descargar (por defecto: main).
.PARAMETER Source
  Instala desde una copia local del repositorio.
.PARAMETER Uninstall
  Quita LegacyForge (1.0 y 0.4) sin tocar nada mas.
.PARAMETER DryRun
  Muestra lo que haria, sin cambiar nada.
#>
[CmdletBinding()]
param(
  [string[]]$Harness = @(),
  [ValidateSet('user', 'project')][string]$Scope = 'user',
  [string]$Project = (Get-Location).Path,
  [switch]$NoHooks,
  [switch]$Hooks,   # compatibilidad con 0.4: los hooks ya se instalan por defecto
  [switch]$NoAgents,
  [string]$Ref = $(if ($env:LF_REF) { $env:LF_REF } else { 'main' }),
  [string]$Source = '',
  [switch]$Uninstall,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$Repo = 'thejoemr/legacy-forge'
$Tmp = $null

try {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) { throw 'error: LegacyForge necesita Node.js 18 o superior en el PATH (https://nodejs.org)' }
  $major = [int](& node -p 'process.versions.node.split(".")[0]')
  if ($major -lt 18) { throw "error: LegacyForge necesita Node.js 18 o superior (tienes $(& node --version))" }

  if (-not $Source -and $PSCommandPath) {
    $here = Split-Path -Parent $PSCommandPath
    if (Test-Path (Join-Path $here 'scripts/instalar.mjs')) { $Source = $here }
  }

  if (-not $Source) {
    $Tmp = Join-Path ([IO.Path]::GetTempPath()) ("legacyforge-" + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $Tmp | Out-Null
    $zip = Join-Path $Tmp 'repo.zip'
    Write-Host "Descargando $Repo ($Ref)..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -UseBasicParsing -Uri "https://codeload.github.com/$Repo/zip/$Ref" -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $Tmp -Force
    $Source = (Get-ChildItem -Path $Tmp -Directory | Select-Object -First 1).FullName
  }

  $installer = Join-Path $Source 'scripts/instalar.mjs'
  if (-not (Test-Path $installer)) { throw "error: no encuentro scripts/instalar.mjs en $Source (la referencia $Ref es anterior a 1.0?)" }

  $args2 = @()
  if ($Harness.Count -gt 0) { $args2 += @('--harness', ($Harness -join ',')) }
  $args2 += @('--scope', $Scope, '--project', $Project)
  if ($NoHooks) { $args2 += '--no-hooks' }
  if ($NoAgents) { $args2 += '--no-agents' }
  if ($Uninstall) { $args2 += '--uninstall' }
  if ($DryRun) { $args2 += '--dry-run' }

  & node $installer @args2
  if ($LASTEXITCODE -ne 0) { throw "error: el instalador termino con codigo $LASTEXITCODE" }
}
finally {
  if ($Tmp -and (Test-Path $Tmp)) { Remove-Item -Recurse -Force $Tmp }
}
