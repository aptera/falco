#!/bin/bash

command=$1
message=$2
thisDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
gitDir=$thisDir/git

function main() {
    case $command
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
    rm -f .mob
}

function save() {
    . $gitDir/save.git 
}

function start() {
    . $gitDir/start.git 
}

function stop() {
    . $gitDir/stop.git $(cat .mob)
    rm -f .mob
}

function drive() {
    . $gitDir/drive.git 
}

function commit() {
    if [ -z "$message" ]
        then
        >&2 echo "Please specify a commit message."
    else
        save
        merge $message
        clean
    fi 
}

function merge() {
    . $gitDir/merge.git $(cat .mob) "$1"
}

function test() {
    . $gitDir/status.git "hi"
}

main