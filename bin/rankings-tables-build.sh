#!/bin/bash
CONFIG=$1
DIR=$2

cat $CONFIG |
    jq -r '.[] | [.date, .url, .index, .menu_age // "old", .name, .links // []] | flatten | @sh' | xargs -L 1 bin/rankings-tables-generate.sh $DIR
