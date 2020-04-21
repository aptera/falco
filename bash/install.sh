#!/bin/bash

thisDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
binDir="/usr/local/bin"

cp -f $thisDir/falco.sh $binDir/falco
chmod +x $binDir/falco