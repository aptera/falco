#!/bin/bash

thisDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
binDir="/usr/local/bin/falco"

mkdir -p $binDir
cp -f $thisDir/falco.sh $binDir/falco
cp -rf $thisDir/../git $binDir
chmod a+x $binDir/falco
chmod a+x $binDir/git/*.git

if ! grep -q $binDir ~/.bash_profile 
then 
    echo 'export PATH="'$binDir':$PATH"' >> ~/.bash_profile 
    . ~/.bash_profile
fi