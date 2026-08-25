param(
  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

$pidFile = Join-Path $projectRoot '.server.pid'
$portFile = Join-Path $projectRoot '.server.port'
$lockFile = Join-Path $projectRoot '.lifecycle.lock'
$logDirectory = Join-Path $projectRoot 'logs'

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

function Test-PlatformReady([int]$port) {
  if ($port -lt 1) { return $false }
  try {
    $response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$port/api/stats" -TimeoutSec 1
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Test-PortAvailable([int]$candidate) {
  $listener = $null
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidate)
    $listener.Start()
    return $true
  } catch {
    return $false
  } finally {
    if ($listener) { $listener.Stop() }
  }
}

function Clear-StaleState {
  Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $portFile -Force -ErrorAction SilentlyContinue
}

function Open-PlatformBrowser([string]$url) {
  & $env:ComSpec /d /c start '""' $url | Out-Null
}

$lock = $null
try {
  $lock = Open-LifecycleLock

  $recordedPid = Get-RecordedNumber $pidFile
  $recordedPort = Get-RecordedNumber $portFile
  if ($recordedPid -and $recordedPort -and (Test-PlatformProcess $recordedPid) -and (Test-PlatformReady $recordedPort)) {
    $url = "http://127.0.0.1:$recordedPort"
    Write-Host "Platform is already running: $url" -ForegroundColor Green
    if (-not $NoBrowser) { Open-PlatformBrowser $url }
    exit 0
  }

  Clear-StaleState

  $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
  $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if (-not $nodeCommand) { throw 'Node.js was not found. Install Node.js 20 or newer.' }
  if (-not $npmCommand) { throw 'npm was not found. Verify the Node.js PATH configuration.' }

  if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules\tsx\package.json'))) {
    Write-Host '[1/3] Installing dependencies...' -ForegroundColor Cyan
    & $npmCommand.Source install
    if ($LASTEXITCODE -ne 0) { throw "Dependency installation failed with exit code $LASTEXITCODE." }
  } else {
    Write-Host '[1/3] Dependencies are ready.' -ForegroundColor DarkGreen
  }

  Write-Host '[2/3] Building the frontend...' -ForegroundColor Cyan
  & $npmCommand.Source run build
  if ($LASTEXITCODE -ne 0) { throw "Frontend build failed with exit code $LASTEXITCODE." }

  $preferredPort = $recordedPort
  $port = $null
  if ($preferredPort -ge 3000 -and $preferredPort -le 3099 -and (Test-PortAvailable $preferredPort)) {
    $port = $preferredPort
  } else {
    $port = 3000..3099 | Where-Object { Test-PortAvailable $_ } | Select-Object -First 1
  }
  if (-not $port) { throw 'No free port was found between 3000 and 3099.' }

  New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
  $stdoutLog = Join-Path $logDirectory "server-$stamp.out.log"
  $stderrLog = Join-Path $logDirectory "server-$stamp.err.log"
  Set-Content -LiteralPath (Join-Path $projectRoot '.server.logs') -Value "$stdoutLog`n$stderrLog" -Encoding UTF8

  Write-Host "[3/3] Starting http://127.0.0.1:$port ..." -ForegroundColor Cyan
  $quotedCommand = '""{0}" --import tsx backend/server.ts --production --port={1} --host=127.0.0.1 1>>"{2}" 2>>"{3}""' -f $nodeCommand.Source, $port, $stdoutLog, $stderrLog
  $processInfo = [System.Diagnostics.ProcessStartInfo]::new()
  $processInfo.FileName = $env:ComSpec
  $processInfo.Arguments = "/d /s /c $quotedCommand"
  $processInfo.WorkingDirectory = $projectRoot
  $processInfo.UseShellExecute = $true
  $processInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
  $serverProcess = [System.Diagnostics.Process]::Start($processInfo)

  Set-Content -LiteralPath $portFile -Value $port -Encoding ASCII

  $ready = $false
  for ($attempt = 0; $attempt -lt 40; $attempt++) {
    if ($serverProcess.HasExited) { break }
    if (Test-PlatformReady $port) { $ready = $true; break }
    Start-Sleep -Milliseconds 500
  }

  if (-not $ready) {
    if (-not $serverProcess.HasExited) { & taskkill.exe /PID $serverProcess.Id /T /F 2>$null | Out-Null }
    Clear-StaleState
    $details = if (Test-Path -LiteralPath $stderrLog) { (Get-Content -LiteralPath $stderrLog -Tail 20) -join [Environment]::NewLine } else { 'No error log was produced.' }
    throw "The server did not become ready in time.`n$details"
  }

  $url = "http://127.0.0.1:$port"
  $actualPid = Get-RecordedNumber $pidFile
  if (-not $actualPid -or -not (Test-PlatformProcess $actualPid)) {
    $connection = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($connection) { Set-Content -LiteralPath $pidFile -Value $connection.OwningProcess -Encoding ASCII }
  }
  Write-Host "Platform started successfully: $url" -ForegroundColor Green
  Write-Host "Current log: $stdoutLog" -ForegroundColor DarkGray
  if (-not $NoBrowser) { Open-PlatformBrowser $url }
  exit 0
} catch {
  Write-Host "Startup failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
} finally {
  if ($lock) { $lock.Dispose() }
}
