import copy, json, sys
from bs4 import BeautifulSoup as bs4

from pyranking.fetch import fetch_ranking

dates_config = json.load(file(sys.argv[1]))
ranking_date = sys.argv[2]
ranking = fetch_ranking(ranking_date)
old_ranking = fetch_ranking(sys.argv[3], True) if len(sys.argv) > 3 else {}

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

table.select('.page-header h1 small')[0].string = 'stan na %s' % (
    '.'.join(ranking_date.split('-')[::-1])
)

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

editions = {}
for date, link in dates_config.iteritems():
    year = date.split('-')[0]
    if year not in editions:
        editions[year] = []
    editions[year].append(('.'.join(date.split('-')[::-1][0:2]), link, date))

date_group = table.select('#editions')[0]
year_group = date_group.select('div[role="group"]')[0].extract()
ranking_link = year_group.select('.btn-default')[0].extract()
for year, dates in editions.iteritems():
    group = copy.copy(year_group)
    group.select('.year')[0].string = str(year)
    for date in dates:
        link = copy.copy(ranking_link)
        link.string = date[0]
        link['href'] = date[1]
        link['datetime'] = date[2]
        group.append(link)
    date_group.append(group)

print table.prettify().encode('utf-8')
