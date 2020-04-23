function main() {
    $dir="$env:appdata\falco"
    Install-Files $dir
    Add-ToPath $dir
    Unblock-File "$dir\**\*"
}

function Install-Files($dir) {
    New-Item -Path $dir -ItemType Directory -Force >$null
    Copy-Item -Force "$PSScriptRoot\falco.ps1" $dir
    Copy-Item -Force -Recurse "$PSScriptRoot\..\git" $dir
}

function Add-ToPath($dir) {
    $envPaths = $env:Path -split ';'
    if ($envPaths -notcontains $dir) {
        $envPaths = $envPaths + $dir | Where-Object { $_ }
        $updatedPath = $envPaths -join ';'
		Set-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name PATH -Value $updatedPath
    }
}
    
main