# REDIS-DISABLED: OTP uses in-memory store; this script is inactive. Re-enable: uncomment body when Redis is restored.
Write-Host "Redis is disabled (in-memory OTP store active)." -ForegroundColor Yellow
exit 0

# $ErrorActionPreference = "Stop"
# $redisDir = Join-Path $PSScriptRoot "..\tools\redis" | Resolve-Path
# $cli = Join-Path $redisDir "redis-cli.exe"
#
# if (-not (Test-Path $cli)) {
#     Write-Host "redis-cli not found." -ForegroundColor Red
#     exit 1
# }
#
# $pong = & $cli ping 2>$null
# if ($pong -ne "PONG") {
#     Write-Host "Redis is not running." -ForegroundColor Yellow
#     exit 0
# }
#
# & $cli shutdown
# Write-Host "Redis stopped." -ForegroundColor Green
