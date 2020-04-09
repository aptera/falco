#!/bin/bash

function clean() {
    git push -d origin mobbing 
    git branch -D mobbing
    rm .mob
}

function save() {
    git add -u
    git reset -- .mob
    git commit -m 'wip'
    git push
}

function start() {
    git rev-parse --abbrev-ref HEAD > .mob
    git checkout -B mobbing
    git push --set-upstream origin mobbing
}

function stop() {
    git checkout $(cat .mob)
    clean
    git fetch --prune
}

function drive() {
    git fetch
    git checkout mobbing
    git pull
}

function commit() {
    if [ -z "$2" ]
        then
        >&2 echo "Please specify a commit message."
    else
        save
        merge
        clean
    fi 
}

function merge() {
    git checkout $(cat .mob)
    git merge mobbing --squash 
    git commit -m "$2"
    git push
}

case $1
in

"start") start;;
"drive") drive;;
"pass") save;;
"commit") commit;;
"stop") stop;;

*) >&2 echo "wat";;
esac

git status
