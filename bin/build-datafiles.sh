#!/bin/bash
CONFIG=$1
DIR=$2
PREV_DATE=""
cat $CONFIG |
    jq -r '.[] | .date' |
    while read DATE
    do
        python datafile.py $DATE $PREV_DATE > "$DIR/$DATE.json"
        PREV_DATE=$DATE
    done
