To build initial ranking:

```
python ranking.py DATE > http/FILENAME.html
```

To build subsequent rankings:

```
python ranking.py DATE PREVIOUS_DATE > http/FILENAME.html
```

To compile edition list header into ranking:

```
python editions.py DATE_CONFIG http/FILENAME.html
```

To build players' pages:
```
python players.py http/players/ [DATES_CONFIG]
```

Name, surname and club are always used from the current `players` table. Regions, genders and age categories are read per-ranking.
