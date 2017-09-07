import json, sys
from decimal import Decimal

from pyranking.fetch import fetch_ranking

ranking_date = sys.argv[1]
ranking = fetch_ranking(ranking_date)
old_ranking = fetch_ranking(sys.argv[2], True) if len(sys.argv) > 2 else {}

for row in ranking:
    if row['pid'] in old_ranking:
        row['place-change'] = old_ranking[row['pid']]['place'] - row['place']
        row['place-change-class'] = 'success' if row['place-change'] > 0 else 'danger'
        row['place-change'] = '%+d' % (row['place-change'])
        if row['place-change'] == '+0':
            row['place-change'] = '='
            row['place-change-class'] = 'default'
        for category in ['gender', 'age', 'region']:
            if row[category] == old_ranking[row['pid']][category]:
                row[category + '-change'] = old_ranking[row['pid']][category + '-place'] - row[category + '-place']
                row[category + '-change-class'] = 'success' if row[category + '-change'] > 0 else 'danger'
                row[category + '-change'] = '%+d' % (row[category + '-change'])
                if row[category + '-change'] == '+0':
                    row[category + '-change'] = '='
                    row[category + '-change-class'] = 'default'
    for field in row:
        if isinstance(row[field], Decimal):
            row[field] = float(row[field])

print json.dumps(ranking)
