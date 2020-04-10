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
    
    git status
}

function Clean() {
    git push -d origin mobbing 
    git branch -D mobbing
    Remove-Item .mob
}

function Save() {
    git add -u
    git reset -- .mob
    git commit -m 'wip'
    git push
}

function Start-Session() {
    git rev-parse --abbrev-ref HEAD > .mob
    git checkout -B mobbing
    git push --set-upstream origin mobbing
}

function Stop() {
    git checkout $(Get-Content .mob)
    Clean
    git fetch --prune
}

function Drive() {
    git fetch
    git checkout mobbing
    git pull
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