#!/bin/bash
CONFIG=$1
jq -jr '.[] | .url + " "' $CONFIG
