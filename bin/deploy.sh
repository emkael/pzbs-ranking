#!/bin/bash
DEPLOYPATH=`cat config/deploy-path`
if [ -s config/deploy-pass ]
then
    sshpass -p `cat config/deploy-pass` rsync -urpP --delete http/ $DEPLOYPATH
else
    rsync -urpP --delete http/ $DEPLOYPATH
fi
