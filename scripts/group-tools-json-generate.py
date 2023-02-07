import json, sys
from pyranking.db import cursor

date = sys.argv[1]

sql = '''SELECT
   rankings.place,
   players.id,
   players.rank,
   rankings.score
FROM players
LEFT JOIN rankings
   ON players.id = rankings.pid
   AND rankings.date = %(date)s
'''
cursor.execute(sql, {'date': date})

result = {}
for row in cursor.fetchall():
    if row['place'] is not None:
        result[row['id']] = {
            'place': int(row['place']),
            'rank': float(row['rank']),
            'score': float(row['score'])
        }
    else:
        result[row['id']] = {
            'rank': float(row['rank'])
        }

print(json.dumps(result))
