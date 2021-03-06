#!/bin/bash
LOCALPATH=$1
DEPLOYPATH=`cat config/deploy-path`
RSYNCOPTS='-urpP --delete --links --exclude=.menu.html'
if [ -s config/deploy-pass ]
then
    sshpass -f config/deploy-pass rsync $RSYNCOPTS $LOCALPATH/ $DEPLOYPATH
else
    rsync $RSYNCOPTS $LOCALPATH/ $DEPLOYPATH
fi
echo 'Remember to push CSV datafiles to GitHub!'
