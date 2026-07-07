# REDIS-DISABLED: OTP uses in-memory store; this script is inactive. Re-enable: uncomment body when Redis is restored.
Write-Host "Redis setup is disabled (in-memory OTP store active). See MIGRATION-NOTES.md." -ForegroundColor Yellow
exit 0

# $ErrorActionPreference = "Stop"
# $redisDir = Join-Path $PSScriptRoot "..\tools\redis"
# $zip = Join-Path $redisDir "Redis-x64-5.0.14.1.zip"
# $url = "https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.zip"
#
# New-Item -ItemType Directory -Force -Path $redisDir | Out-Null
#
# if (Test-Path (Join-Path $redisDir "redis-server.exe")) {
#     Write-Host "Redis already installed in $redisDir" -ForegroundColor Green
#     exit 0
# }
#
# Write-Host "Downloading Redis for Windows..."
# Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
#
# Write-Host "Extracting..."
# Expand-Archive -Path $zip -DestinationPath $redisDir -Force
# Remove-Item $zip
#
# Write-Host "Done. Run scripts/start-redis.ps1 to start Redis." -ForegroundColor Green
