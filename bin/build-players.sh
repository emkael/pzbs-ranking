#!/bin/bash
DIR=$1
mkdir -p $DIR/players
python scripts/players.py $DIR/players
