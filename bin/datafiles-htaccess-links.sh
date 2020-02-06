#!/bin/bash
DATE=$1

shift 1
LINKS=$@

echo $LINKS | while read LINK
do
    SOURCE_PREFIX="${LINK//.html/}"
    echo "RewriteRule $SOURCE_PREFIX.json _data/$DATE.json [L]"
    echo "RewriteRule $SOURCE_PREFIX.minimal.json _data/$DATE.minimal.json [L]"
    echo "RewriteRule $SOURCE_PREFIX.csv https://raw.githubusercontent.com/emkael/pzbs-ranking/master/data/rankings/$DATE.csv [R,L]"
done
