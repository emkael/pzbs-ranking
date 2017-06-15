#!/bin/bash
DEPLOYPATH=`cat config/deploy-path`
if [ -s config/deploy-pass ]
then
    sshpass -p `cat config/deploy-pass` rsync -urpP http/ $DEPLOYPATH
else
    rsync -urpP http/ $DEPLOYPATH
fi
