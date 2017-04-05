Update categories from current `players` table:

```
UPDATE rankings
JOIN players
     ON players.id = rankings.pid
SET rankings.region = players.region,
    rankings.flags = players.flags
WHERE rankings.date = '#DATE#';
```

After importing ranking CSV to `temp_rankings`, copy to `rankings` with current categories:

```
INSERT INTO rankings (
       SELECT pid, `date`, place, score, region, flags \
       FROM temp_rankings
       JOIN players
            ON players.id = temp_rankings.pid
);
```
