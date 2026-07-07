# DOCKER-DISABLED: Docker Desktop setup inactive. Active deployment: mvn spring-boot:run or java -jar (see MIGRATION-NOTES.md).
# Re-enable: uncomment body below and restore docker-compose services + CI docker job.
Write-Host "Docker setup is disabled. Run: mvn spring-boot:run (requires local PostgreSQL)." -ForegroundColor Yellow
exit 0

# # Docker Desktop setup helper (requires Administrator + reboot for WSL).
# # Run in an elevated PowerShell:  Right-click PowerShell -> Run as administrator
#
# $ErrorActionPreference = "Stop"
#
# function Test-Admin {
#     ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
#         [Security.Principal.WindowsBuiltInRole]::Administrator)
# }
#
# if (-not (Test-Admin)) {
#     Write-Host "This script must be run as Administrator." -ForegroundColor Red
#     Write-Host "Right-click PowerShell -> Run as administrator, then run:"
#     Write-Host "  cd d:\JAVA\Projects\stwmovers-backend\scripts"
#     Write-Host "  .\setup-docker.ps1"
#     exit 1
# }
#
# Write-Host "Step 1: Enabling WSL (required by Docker Desktop)..."
# wsl --install --no-distribution
# if ($LASTEXITCODE -ne 0) {
#     Write-Host "WSL may already be enabled or needs a reboot." -ForegroundColor Yellow
# }
#
# $dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
# $installer = "$env:TEMP\DockerDesktopInstaller.exe"
#
# if (Get-Command docker -ErrorAction SilentlyContinue) {
#     Write-Host "Docker is already installed." -ForegroundColor Green
# } else {
#     Write-Host "Step 2: Downloading Docker Desktop..."
#     Invoke-WebRequest -Uri $dockerUrl -OutFile $installer -UseBasicParsing
#
#     Write-Host "Step 3: Installing Docker Desktop (this may take several minutes)..."
#     Start-Process -FilePath $installer -ArgumentList "install", "--quiet", "--accept-license" -Wait
#     Remove-Item $installer -ErrorAction SilentlyContinue
# }
#
# Write-Host ""
# Write-Host "Next steps:" -ForegroundColor Cyan
# Write-Host "  1. Reboot your PC if WSL was just installed"
# Write-Host "  2. Start Docker Desktop from the Start menu"
# Write-Host "  3. From stwmovers-backend, run:"
# Write-Host "       docker compose -f docker-compose.infra.yml up -d"
# Write-Host "     (Postgres only while Redis disabled; keeps local mvn backend on 8080)"
# Write-Host ""
# Write-Host "  Or run the full stack:"
# Write-Host "       docker compose up -d --build"
