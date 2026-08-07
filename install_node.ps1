$nodeUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
$zipPath = "$env:USERPROFILE\node.zip"
$destPath = "$env:USERPROFILE\node"

Write-Host "Descargando Node.js v20.18.0..."
Invoke-WebRequest -Uri $nodeUrl -OutFile $zipPath

Write-Host "Extrayendo archivos..."
Expand-Archive -Path $zipPath -DestinationPath $destPath -Force
Remove-Item $zipPath

$nodeBinPath = "$destPath\node-v20.18.0-win-x64"

# Añadir a la sesión actual
$env:PATH = "$nodeBinPath;" + $env:PATH

# Añadir a las variables de entorno de Usuario permanentemente (no requiere admin)
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notmatch [regex]::Escape($nodeBinPath)) {
    [Environment]::SetEnvironmentVariable("Path", "$nodeBinPath;$userPath", "User")
    Write-Host "Se ha añadido al PATH del usuario."
}

Write-Host "Node.js se ha instalado correctamente sin necesitar permisos de administrador."
Write-Host "Por favor, CIERRA ESTA TERMINAL Y ÁBRELA DE NUEVO."
