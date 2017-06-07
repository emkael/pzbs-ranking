#!/bin/bash
PAGEDIR=`dirname $0`
DATE=`date --date='yesterday' +%Y%m%d`
OUTPUTFILE=`realpath $PAGEDIR/../data/cezar/$DATE.csv`
wget http://msc.com.pl/cezar/download/baza.csv -q -O - | iconv -f windows-1250 -t utf-8 > temp
if [ -s temp ]; then
    tail -n +2 temp | sort > $OUTPUTFILE
    echo "Downloaded Cezar CSV into $OUTPUTFILE"
else
    echo 'Cezar CSV fetch failed'
fi
rm temp
