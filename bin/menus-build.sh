#!/bin/bash
CONFIG_FILE=$1
DIRECTORY=$2
mkdir -p $DIRECTORY/players
find $DIRECTORY -type d -not -name _\* |
    while read HTMLDIR
    do
        python scripts/menus-compile.py $CONFIG_FILE $DIRECTORY $HTMLDIR > $HTMLDIR/.menu.html
    done
