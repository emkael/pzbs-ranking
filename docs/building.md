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
