Param(
    [parameter(Position=0,Mandatory=$true)][string]$command,
    [parameter(Position=1,Mandatory=$false)][string]$message
)

function Main() {
    switch ($command) {
        'start' { Start-Session; break; }
        'drive' { Drive; break; }
        'pass' { Save; break; }
        'commit' { Commit; break; }
        'stop' { Stop; break; }
        Default {
            Write-Host "wat"
        }
    }
    
    Invoke-Git "status"
}

function Invoke-Git($file) {
    $git = $(Get-Content "$PSScriptRoot\git\$file.git" -Raw)
    Invoke-Expression "$git"
}

function Clean() {
    Invoke-Git "clean"
    Remove-Item .mob
}

function Save() {
    Invoke-Git "save"
}

function Start-Session() {
    Invoke-Git "start"
}

function Stop() {
    git checkout $(Get-Content .mob)
    Clean
    git fetch --prune
}

function Drive() {
    Invoke-Git "drive"
}

function Commit() {
    if ($null -eq $message) {
        Write-Error 'Please specify a commit message.'
        return
    }

    Save
    Merge
    Clean
}

function Merge() {
    git checkout $(Get-Content .mob)
    git merge mobbing --squash 
    git commit -m $message
    git push
}

Main