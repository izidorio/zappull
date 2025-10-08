# build.ps1
Write-Host "Empacotando o sistema..." -ForegroundColor Green
Compress-Archive -Path "src", "manifest.json" -DestinationPath "zappull.zip" -Force
Write-Host "Arquivo criado: zappull.zip" -ForegroundColor Green