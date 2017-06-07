#!/bin/bash
DBCONFIG=($(jq -r '.[]' config/import-db.json))
mysql -h ${DBCONFIG[2]} -P ${DBCONFIG[3]} -u ${DBCONFIG[0]} --password=${DBCONFIG[1]} -e "SET foreign_key_checks = 0;
DELETE FROM temp_rankings;
LOAD DATA LOCAL INFILE '$1'
REPLACE
INTO TABLE temp_rankings
FIELDS TERMINATED BY ',';
INSERT INTO rankings (
       SELECT pid, \`date\`, place, score, region, flags
       FROM temp_rankings
       JOIN players
            ON players.id = temp_rankings.pid
);
SET foreign_key_checks = 1
" ${DBCONFIG[4]}
