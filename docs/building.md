To build initial ranking:

```
python ranking.py RANKING_NAME RANKING_INDEX DATE > http/FILENAME.html
```

To build subsequent rankings:

```
python ranking.py RANKING_NAME RANKING_INDEX DATE PREVIOUS_DATE > http/FILENAME.html
```

To compile edition list header into ranking:

```
python editions.py http/FILENAME.html
```

To build players' pages:
```
python players.py http/players/
```

Name, surname and club are always used from the current `players` table. Regions, genders and age categories are read per-ranking.

---

Provided, is also a Makefile to do all the work within a standard setup.

To build all the pages, use:

```
make
```

To minimize generated ranking pages, use:

```
make minimize
```

To sync the generated content to a remote server of your choice, use:

```
make deploy
```

Note that the last command is designed with automatization in mind, so you'd need:

* `sshpass` utility to be able to provide SSH password for `rsync` in command line
 * proper `config/deploy-path` and `config/deploy-pass` files, which are encrypted in this repository

If you want to use some other way of deploying content to your target environment (like passwordless SSH connection for rsync/sftp), for now you have to do it manually.

You can also use subtargets of `make`, which (re)build only part of the content:

 * `make rankings` builds only ranking pages (and consists of `make tables` which creates ranking tables and `make editions` which inserts ranking editions menu into ranking page - useful if you generated ranking page for an edition manually and now you only want to re-render that menu in other ranking pages)
 * `make players` builds only players pages
