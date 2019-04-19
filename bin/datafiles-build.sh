#!/bin/bash
CONFIG=$1
DIR=$2
PREV_DATE=""
cat $CONFIG |
    jq -r '.[] | .date' |
    while read DATE
    do
        python scripts/datafiles-generate.py $DATE $PREV_DATE > "$DIR/$DATE.json"
        python scripts/datafiles-generate-minimal.py $DATE > "$DIR/$DATE.minimal.json"
        PREV_DATE=$DATE
    done
