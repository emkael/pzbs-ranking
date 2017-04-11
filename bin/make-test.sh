#!/bin/bash
python ranking.py config/test-dates.json 2016-12-31 > http/test/2017-01.html
python ranking.py config/test-dates.json 2017-04-30 2016-12-31 > http/test/index.html
python players.py http/test/players config/test-dates.json
