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

function Invoke-Git($file, $arg1, $arg2) {
    $git = $(Get-Content "$PSScriptRoot\git\$file.git" -Raw)
    $expression = $git.Replace('$1', $arg1).Replace('$2', $arg2)
    Invoke-Expression $expression
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
    Invoke-Git "stop" $(Get-Content .mob)
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
    Invoke-Git "merge" $(Get-Content .mob) $message
}

Main