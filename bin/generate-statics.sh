#!/bin/bash
CONFIG=$1
CONTENT_DIR=$2
OUTPUT_DIR=$3
cat $1 |
    jq -r '.[] | .content, .header, .url' |
    while read CONTENT_FILE
    do
        read HEADER
        read OUTPUT_FILE
        if [ -n "$CONTENT_FILE" ]
        then
            python scripts/static.py $CONTENT_DIR/$CONTENT_FILE "$HEADER" > $OUTPUT_DIR/$OUTPUT_FILE
        fi
    done
