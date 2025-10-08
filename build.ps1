# build.ps1
Write-Host "Empacotando o sistema..." -ForegroundColor Green
Compress-Archive -Path "src", "manifest.json" -DestinationPath "addon-zappull.zip" -Force
Write-Host "Arquivo criado: addon-zappull.zip" -ForegroundColor Green