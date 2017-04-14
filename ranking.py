import copy, sys
from bs4 import BeautifulSoup as bs4

from pyranking.fetch import fetch_ranking

ranking_date = sys.argv[3]
subtitle = 'notowanie %s (%s), stan na %s' % (
    sys.argv[1], sys.argv[2], '.'.join(ranking_date.split('-')[::-1])
)
ranking = fetch_ranking(ranking_date)
old_ranking = fetch_ranking(sys.argv[4], True) if len(sys.argv) > 4 else {}

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

table = bs4(file('templates/ranking.html'), 'lxml')
table_body = table.select('tbody')[0]
table_row = table_body.select('tr')[0].extract()

table.select('.page-header h2 small')[0].string = subtitle

for row in ranking:
    new_row = copy.copy(table_row)
    new_row.select('td.pid')[0].string = str(row['pid'])
    new_row.select('td.pidlink a')[0]['href'] = 'https://msc.com.pl/cezar/?p=21&pid=%d' % (row['pid'])
    new_row.select('td.name')[0].string = row['player']
    new_row.select('td.club')[0].string = row['club']
    for category in ['gender', 'age', 'region']:
        new_row.select('td.' + category)[0].string = row[category]
        new_row.select('td.' + category + '-place .rank')[0].string = str(row[category + '-place'])
        badge = new_row.select('td.' + category + '-place .change')[0]
        badge.string = row[category + '-change']
        badge['class'] = badge['class'] + ['label-' + row[category + '-change-class']]
    new_row.select('td.ranking')[0].string = str(row['score'])
    new_row.select('td.place .rank')[0].string = str(row['place'])
    badge = new_row.select('td.place .change')[0]
    badge.string = row['place-change']
    badge['class'] = badge['class'] + ['label-' + row['place-change-class']]
    for category in ['gender', 'age', 'region']:
        if row[category + '-place'] == 1:
            new_row['class'] = new_row.get('class', []) + ['info']
    table_body.append(new_row)

print table.prettify().encode('utf-8')
