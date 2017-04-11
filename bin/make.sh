#!/bin/bash
python ranking.py config/dates.json 2016-12-31 > http/index.html
python players.py http/players config/dates.json
