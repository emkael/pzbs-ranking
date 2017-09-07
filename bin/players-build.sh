#!/bin/bash
DIR=$1
mkdir -p $DIR/players
python scripts/players-compile.py $DIR/players $DIR/players/.menu.html
