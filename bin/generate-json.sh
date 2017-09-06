#!/bin/bash
CONFIG=$1
OUTPUT=$2
LAST_DATE=`cat $CONFIG | jq -r '.[] | .date' | sort | tail -n1`
python generate-json.py $LAST_DATE > $OUTPUT/data/group-data.json
