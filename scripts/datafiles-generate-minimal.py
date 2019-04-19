import json, sys

from pyranking.fetch import fetch_ranking

ranking_date = sys.argv[1]
ranking = fetch_ranking(ranking_date)

output = {}
for row in ranking:
    output[row['pid']] = {
        'p': row['place'],
        'r': float(row['score'])
    }

print json.dumps(output)
