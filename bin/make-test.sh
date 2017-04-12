#!/bin/bash
python ranking.py 2016-12-31 > http/test/2017-01.html
python ranking.py 2017-04-30 2016-12-31 > http/test/index.html
find http/test -maxdepth 1 -type f -name \*.html |
    while read FILE
    do
        python editions.py config/test-dates.json $FILE
    done
python players.py http/test/players config/test-dates.json
