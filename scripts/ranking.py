import os, sys
from bs4 import BeautifulSoup as bs4

ranking_date = sys.argv[3]
subtitle = 'notowanie %s (%s), stan na %s' % (
    sys.argv[1], sys.argv[2], '.'.join(ranking_date.split('-')[::-1])
)

table = bs4(file('templates/ranking.html'), 'lxml')
table.select('.page-header h2 small')[0].string = subtitle

table.select('table.data-table')[0]['data-ranking'] = '_data/%s.json' % (
    ranking_date)

script_src = table.select('script[src="_res/ranking.js"]')[0]
script_src['src'] = '%s?%d' % ('_res/ranking.js', os.path.getmtime('http/_res/ranking.js'))

rawlink = table.select('a#rawlink')[0]
rawlink['href'] = '%s/%s.csv' % (rawlink['href'], ranking_date)

print table.prettify().encode('utf-8')
