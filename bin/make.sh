#!/bin/bash
python ranking.py 2016-12-31 > http/index.html
python editions.py config/dates.json http/index.html
python players.py http/players config/dates.json
