#!/bin/bash
CONFIG=$1
DIR=$2
rm config/dates.json
ln -s $CONFIG config/dates.json
PREV_DATE=""
cat config/dates.json |
    jq '.[] | .date, .url, .index, .name' |
    xargs -n4 |
    while read DATE URL INDEX NAME
    do
        python ranking.py $DATE $PREV_DATE > $DIR/$URL
        PREV_DATE=$DATE
    done
find $DIR -maxdepth 1 -type f -name \*.html |
    while read FILE
    do
        python editions.py $FILE
    done
python players.py $DIR/players
