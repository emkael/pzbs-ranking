#!/bin/bash
LOCALPATH=$1
DEPLOYPATH=`cat config/deploy-path`
if [ -s config/deploy-pass ]
then
    sshpass -f config/deploy-pass rsync -urpP --delete $LOCALPATH/ $DEPLOYPATH
else
    rsync -urpP --delete $LOCALPATH/ $DEPLOYPATH
fi
