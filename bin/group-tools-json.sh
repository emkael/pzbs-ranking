#!/bin/bash
CONFIG=$1
OUTPUT=$2
LAST_DATE=`cat $CONFIG | jq -r '.[] | .date' | sort | tail -n1`
python3 scripts/group-tools-json-generate.py $LAST_DATE > $OUTPUT/_data/group-data.json
