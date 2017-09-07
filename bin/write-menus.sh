#!/bin/bash
CONFIG_FILE=$1
DIRECTORY=$2
find $DIRECTORY -name \*.html -exec python scripts/static-menu.py $CONFIG_FILE {} $DIRECTORY \;
