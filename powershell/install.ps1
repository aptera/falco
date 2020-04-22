function main() {
    $dir="$env:appdata\falco"
    $script="$PSScriptRoot\falco.ps1"
    Install-Script $script $dir
    Add-ToPath $dir
    Unblock-File "$dir\falco.ps1"
}

function Install-Script($script, $dir) {
    New-Item -Path $dir -ItemType Directory -Force >$null
    Copy-Item -Force $script $dir
}

function Add-ToPath($dir) {
    $envPaths = $env:Path -split ';'
    if ($envPaths -notcontains $dir) {
        $envPaths = $envPaths + $dir | Where-Object { $_ }
        $env:Path = $envPaths -join ';'
    }
}
    
main