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
    write-host "args count = $($args.Length)"
    $expression = $(Get-Content "$PSScriptRoot\git\$file.git" -Raw)
    for ($i=0; $i -lt $args.Length; $i++) {
        $expression = $expression.Replace("`$$($i+1)", $args[$i])
    }
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
    Remove-Item .mob
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