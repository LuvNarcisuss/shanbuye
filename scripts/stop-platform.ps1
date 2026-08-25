param(
  [switch]$Silent
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

$pidFile = Join-Path $projectRoot '.server.pid'
$portFile = Join-Path $projectRoot '.server.port'
$lockFile = Join-Path $projectRoot '.lifecycle.lock'

function Open-LifecycleLock {
  $deadline = (Get-Date).AddSeconds(12)
  while ((Get-Date) -lt $deadline) {
    try {
      return [System.IO.File]::Open($lockFile, 'OpenOrCreate', 'ReadWrite', 'None')
    } catch [System.IO.IOException] {
      Start-Sleep -Milliseconds 300
    }
  }
  throw 'Another start or stop operation is running. Please retry in a few seconds.'
}

function Get-RecordedNumber([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) { return $null }
  $value = 0
  if ([int]::TryParse((Get-Content -LiteralPath $path -Raw).Trim(), [ref]$value)) { return $value }
  return $null
}

function Test-PlatformProcess([int]$processId) {
  $process = Get-CimInstance Win32_Process -Filter "ProcessId=$processId" -ErrorAction SilentlyContinue
  if (-not $process -or $process.Name -ne 'node.exe') { return $false }
  return [bool]($process.CommandLine -match 'server\.ts')
}

$lock = $null
try {
  $lock = Open-LifecycleLock
  $processId = Get-RecordedNumber $pidFile
  $port = Get-RecordedNumber $portFile

  if ((-not $processId -or -not (Test-PlatformProcess $processId)) -and $port) {
    $connection = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($connection -and (Test-PlatformProcess $connection.OwningProcess)) { $processId = $connection.OwningProcess }
  }

  if ($processId -and (Test-PlatformProcess $processId)) {
    & taskkill.exe /PID $processId /T /F 2>$null | Out-Null
    Start-Sleep -Milliseconds 300
    if (Get-Process -Id $processId -ErrorAction SilentlyContinue) { throw "Process $processId is still running." }
    Write-Host 'Platform stopped successfully.' -ForegroundColor Green
  } else {
    Write-Host 'Platform is not running. Stale state was removed.' -ForegroundColor Yellow
  }

  Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $portFile -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath (Join-Path $projectRoot '.server.logs') -Force -ErrorAction SilentlyContinue
  exit 0
} catch {
  Write-Host "Shutdown failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
} finally {
  if ($lock) { $lock.Dispose() }
}
