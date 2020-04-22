#!/bin/bash

thisDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
gitDir=$thisDir/git

function main() {
    case $1
    in

    "start") start;;
    "drive") drive;;
    "pass") save;;
    "commit") commit;;
    "stop") stop;;
    "test") test;;

    *) >&2 echo "wat";;
    esac

    git status
}

function clean() {
    . $gitDir/clean.git 
}

function save() {
    . $gitDir/save.git 
}

function start() {
    . $gitDir/start.git 
}

function stop() {
    . $gitDir/stop.git $(cat .mob)
}

function drive() {
    . $gitDir/drive.git 
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
    . $gitDir/merge.git $(cat .mob) "$2"
}

function test() {
    . $gitDir/status.git "hi"
}

main