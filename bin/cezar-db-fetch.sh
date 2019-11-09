#!/bin/bash
PAGEDIR=`dirname $0`
DATE=`date --date='yesterday' +%Y%m%d`
OUTPUTFILE=`realpath $PAGEDIR/../data/cezar/$DATE.csv`
TMPFILE=$PAGEDIR/temp
wget http://msc.com.pl/cezar/download/baza2.csv -q -O $TMPFILE
if [ -s $TMPFILE ]; then
    tail -n +2 $TMPFILE | sort > $OUTPUTFILE
    echo "Downloaded Cezar CSV into $OUTPUTFILE"
else
    echo 'Cezar CSV fetch failed'
fi
rm $TMPFILE
