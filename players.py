import copy, json, os, sys
from bs4 import BeautifulSoup as bs4
from math import ceil
from pyranking.fetch import fetch_ranking

output_directory = sys.argv[1]

dates = {}
for date_config in json.load(file('config/dates.json')):
    dates[date_config['date']] = date_config['url']

players = {}

for date in sorted(dates.keys()):
    for player, ranking in fetch_ranking(date, True).iteritems():
        if player not in players:
            players[player] = {'rankings':{}}
        players[player]['name'] = ranking['player']
        players[player]['club'] = ranking['club']
        players[player]['rankings'][date] = {'change': 'N','change-class':'primary'}
        for field in ['place', 'score']:
            players[player]['rankings'][date][field] = ranking[field]
        for field in ['gender', 'age', 'region']:
            players[player]['rankings'][date][field] = ranking[field]
            players[player]['rankings'][date][field + '-place'] = ranking[field + '-place']
            players[player]['rankings'][date][field + '-change'] = 'N'
            players[player]['rankings'][date][field + '-change-class'] = 'primary'

for pid, player in players.iteritems():

    template = bs4(file('templates/player.html'), 'lxml')
    template.select('h2.name')[0].insert(0, player['name'])
    template.select('h3.club')[0].string = player['club']
    template.select('a.pid-link')[0]['href'] = 'https://msc.com.pl/cezar/?p=21&pid=%d' % (pid)

    missing_row = template.select('tr.missing')[0].extract()
    normal_row = template.select('tr.normal')[0].extract()

    for date in dates:
        if date not in player['rankings']:
            player['rankings'][date] = None
    prev = None
    for date, ranking in sorted(player['rankings'].iteritems(), lambda x,y: cmp(x[0], y[0])):
        if prev is not None and ranking is not None:
            ranking['change'] = prev['place'] - ranking['place']
            for field in ['gender', 'age', 'region']:
                if prev[field] == ranking[field]:
                    ranking[field + '-change'] = prev[field + '-place'] - ranking[field + '-place']
            for field in ['', 'gender-', 'age-', 'region-']:
                if ranking[field+'change'] == 0:
                    ranking[field+'change'] = '='
                    ranking[field+'change-class'] = 'default'
                elif ranking[field+'change'] == 'N':
                    ranking[field+'change-class'] = 'primary'
                else:
                    ranking[field+'change-class'] = 'success' if ranking[field+'change'] > 0 else 'danger'
                    ranking[field+'change'] = '%+d' % (ranking[field+'change'])
        prev = ranking

        row = copy.copy(missing_row) if ranking is None else copy.copy(normal_row)
        rank_link = row.find('td').a
        rank_link.string = '.'.join(date.split('-')[::-1])
        base_rank_link = '../%s' % (dates[date])
        if ranking is not None and ranking['place'] > 50:
            rank_link['href'] = '../%s#page:%d' % (
                dates[date], ceil(ranking['place'] / 50.0)
            )
        else:
            rank_link['href'] = base_rank_link
        if ranking is not None:
            score_cell = row.select('.score span')[0]
            score_cell.string = '%.2f' % (ranking['score'])
            score_cell['title'] = str(ranking['score'])
            for field in ['region', 'age', 'gender']:
                link = row.select('td.'+field+' a')[0]
                if ranking[field+'-place'] > 40:
                    link['href'] = base_rank_link + '#%s:%s;page:%d' % (
                        field, ranking[field], ceil(ranking[field+'-place'] / 40.0)
                    )
                else:
                    link['href'] = base_rank_link + '#%s:%s' % (
                        field, ranking[field]
                    )
                link.string = ranking[field] if len(ranking[field]) else '-'
            for field in ['', 'region-', 'age-', 'gender-']:
                row.select('td.'+field+'place')[0].string = '%d.' % (ranking[field+'place'])
                change_label = row.select('td.'+field+'place-change span.label')[0]
                change_label.string = ranking[field+'change']
                change_label['class'] = change_label['class'] + ['label-'+ranking[field+'change-class']]
        template.select('table.table tbody')[0].insert(0, row)
        file(os.path.join(output_directory, '%d.html' % pid), 'w').write(template.prettify().encode('utf-8'))
