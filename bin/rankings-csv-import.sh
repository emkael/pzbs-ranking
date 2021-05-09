#!/bin/bash
DBCONFIG=($(jq -r '.[]' config/import-db.json))
mysql --local-infile=1 -h ${DBCONFIG[2]} -P ${DBCONFIG[3]} -u ${DBCONFIG[0]} --password=${DBCONFIG[1]} -e "SET foreign_key_checks = 0;
DELETE FROM temp_rankings;
LOAD DATA LOCAL INFILE '$1'
REPLACE
INTO TABLE temp_rankings
FIELDS TERMINATED BY ',';
INSERT INTO rankings (
       SELECT pid, \`date\`, place, score, region, gender, flags, rank, club, 0
       FROM temp_rankings
       JOIN players
            ON players.id = temp_rankings.pid
);
UPDATE rankings SET hidden = 1 WHERE pid IN (SELECT pid FROM hidden_players);
SET foreign_key_checks = 1
" ${DBCONFIG[4]}
