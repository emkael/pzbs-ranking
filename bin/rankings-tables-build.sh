#!/bin/bash
CONFIG=$1
DIR=$2
cat $CONFIG |
    jq '.[] | .date, .url, .index, .menu_age // "old", .name' |
    xargs -n5 |
    while read DATE URL INDEX AGEMENU NAME
    do
        python scripts/rankings-tables-compile.py "$NAME" $INDEX $DIR/.menu.html $DATE "$AGEMENU" > $DIR/$URL
    done
