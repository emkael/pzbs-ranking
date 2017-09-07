#!/bin/bash
CONFIG=$1
DIR=$2
cat $CONFIG |
    jq '.[] | .date, .url, .index, .name' |
    xargs -n4 |
    while read DATE URL INDEX NAME
    do
        python scripts/ranking.py "$NAME" $INDEX $DIR/.menu.html $DATE > $DIR/$URL
    done
