#!/bin/bash

DIR=$1
DATE=$2
URL=$3
INDEX=$4
AGEMENU=$5
NAME=$6

python scripts/rankings-tables-compile.py "$NAME" $INDEX $DIR/.menu.html $DATE "$AGEMENU" > $DIR/$URL

shift 6
LINKS=$@

echo $LINKS | grep -v "^$" | while read LINK
do
    ln -sf $URL $DIR/$LINK
done
