#!/bin/bash
CONFIG=$1
HTACCESS_FILE=$2
cat $HTACCESS_FILE |
    sed -e '/^# auto-generated from this point below$/,$d' > $HTACCESS_FILE.tmp
echo '# auto-generated from this point below' >> $HTACCESS_FILE.tmp
cat $CONFIG |
    jq -r '.[] | .date, .url' | xargs -n 2 |
    while read DATE URL
    do
        PREFIX="${URL//.html/}"
        echo "RewriteRule $PREFIX.json _data/$DATE.json [L]" >> $HTACCESS_FILE.tmp
        echo "RewriteRule $PREFIX.minimal.json _data/$DATE.minimal.json [L]" >> $HTACCESS_FILE.tmp
        echo "RewriteRule $PREFIX.csv https://raw.githubusercontent.com/emkael/pzbs-ranking/master/data/rankings/$DATE.csv [R,L]" >> $HTACCESS_FILE.tmp
    done
cat $CONFIG |
    jq -r '.[] | if .links then [.date, .links] else [] end | flatten | @sh' | grep -v '^$' |
    xargs -L 1 bin/datafiles-htaccess-links.sh >> $HTACCESS_FILE.tmp
mv $HTACCESS_FILE.tmp $HTACCESS_FILE
