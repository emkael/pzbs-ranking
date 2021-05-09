#!/bin/bash
DBCONFIG=($(jq -r '.[]' config/import-db.json))
mysql --local-infile=1 -h ${DBCONFIG[2]} -P ${DBCONFIG[3]} -u ${DBCONFIG[0]} --password=${DBCONFIG[1]} -e "SET foreign_key_checks = 0;
LOAD DATA LOCAL INFILE '$1'
REPLACE
INTO TABLE players
FIELDS TERMINATED BY ';' ENCLOSED BY '\"';
SET foreign_key_checks = 1
" ${DBCONFIG[4]}
