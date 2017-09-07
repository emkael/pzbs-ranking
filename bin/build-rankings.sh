#!/bin/bash
CONFIG=$1
DIR=$2
PREV_DATE=""
cat $CONFIG |
    jq '.[] | .date, .url, .index, .name' |
    xargs -n4 |
    while read DATE URL INDEX NAME
    do
        python scripts/ranking.py "$NAME" $INDEX $DATE $PREV_DATE > $DIR/$URL
        PREV_DATE=$DATE
    done
