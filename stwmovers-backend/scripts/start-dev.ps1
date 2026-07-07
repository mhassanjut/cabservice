# Start Spring Boot backend for local development (Redis no longer required).
$ErrorActionPreference = "Stop"
$backendRoot = (Join-Path $PSScriptRoot "..") | Resolve-Path

# REDIS-DISABLED: was start-redis.ps1 before backend. Re-enable: uncomment next two lines when Redis OTP store is restored.
# & (Join-Path $PSScriptRoot "start-redis.ps1")
# if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$envFile = Join-Path $backendRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "Loaded $envFile"
} else {
    Write-Host "No .env file found. Copy .env.example to .env and adjust credentials." -ForegroundColor Yellow
}

Set-Location $backendRoot
Write-Host "Starting backend on http://localhost:8080 ..."
mvn spring-boot:run
