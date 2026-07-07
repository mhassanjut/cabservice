# REDIS-DISABLED: OTP uses in-memory store; this script is inactive. Re-enable: uncomment body and restore start-dev.ps1 call.
Write-Host "Redis is disabled (in-memory OTP store active). To restore Redis, see MIGRATION-NOTES.md." -ForegroundColor Yellow
exit 0

# $ErrorActionPreference = "Stop"
# $redisDir = Join-Path $PSScriptRoot "..\tools\redis" | Resolve-Path
# $server = Join-Path $redisDir "redis-server.exe"
# $conf = Join-Path $redisDir "redis.windows.conf"
# $cli = Join-Path $redisDir "redis-cli.exe"
#
# if (-not (Test-Path $server)) {
#     Write-Host "Redis not found. Run scripts/setup-redis.ps1 first." -ForegroundColor Red
#     exit 1
# }
#
# $existing = try { & $cli ping 2>$null } catch { $null }
# if ($existing -eq "PONG") {
#     Write-Host "Redis is already running on localhost:6379" -ForegroundColor Green
#     exit 0
# }
#
# Start-Process -FilePath $server -ArgumentList $conf -WindowStyle Hidden
# Start-Sleep -Seconds 2
#
# $pong = try { & $cli ping 2>$null } catch { $null }
# if ($pong -eq "PONG") {
#     Write-Host "Redis started on localhost:6379" -ForegroundColor Green
# } else {
#     Write-Host "Redis failed to start. Check if port 6379 is in use." -ForegroundColor Red
#     exit 1
# }
