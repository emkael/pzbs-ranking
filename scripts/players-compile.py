import os, sys
import simplejson as json
from math import ceil
from pyranking.fetch import fetch_ranking

output_directory = sys.argv[2]
pagesize = 100.0

dates = {}
for date_config in json.load(file(sys.argv[1])):
    dates[date_config['date']] = date_config['url']

players = {}

for date in sorted(dates.keys()):
    for player, ranking in fetch_ranking(date, True).iteritems():
        if not ranking['hidden']:
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

pcount = 0
for pid, player in players.iteritems():
    player['url'] = 'https://msc.com.pl/cezar/?p=21&pid=%d' % (pid)
    for date in dates:
        if date not in player['rankings']:
            player['rankings'][date] = {'place': None}

    prev = None
    for date, ranking in sorted(player['rankings'].iteritems(), lambda x,y: cmp(x[0], y[0])):
        if prev is not None and prev['place'] is not None and ranking['place'] is not None:
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

        base_rank_link = '../%s' % (dates[date])
        if ranking['place'] is not None and ranking['place'] > int(pagesize):
            ranking['href'] = '../%s#page:%d' % (
                dates[date], ceil(ranking['place'] / pagesize)
            )
        else:
            ranking['href'] = base_rank_link
        if ranking['place']  is not None:
            for field in ['region', 'age', 'gender']:
                if ranking[field+'-place'] > int(pagesize):
                    ranking[field+'-href'] = base_rank_link + '#%s:%s;page:%d' % (
                        field, ranking[field], ceil(ranking[field+'-place'] / pagesize)
                    )
                else:
                    ranking[field+'-href'] = base_rank_link + '#%s:%s' % (
                        field, ranking[field]
                    )

    json.dump(player, file(os.path.join(output_directory, '%d.json' % pid), 'w'))

    pcount += 1
    sys.stdout.write("[%d/%d]\r" % (pcount, len(players)))
    sys.stdout.flush()
