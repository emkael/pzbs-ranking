import os, sys, time
from bs4 import BeautifulSoup as bs4

ranking_date = sys.argv[4]
subtitle = 'notowanie %s (%s), stan na %s' % (
    sys.argv[1], sys.argv[2], '.'.join(ranking_date.split('-')[::-1])
)

table = bs4(file('templates/ranking.html'), 'lxml')
table.select('.page-header h2 small')[0].string = subtitle

table.select('table.data-table')[0]['data-ranking'] = '_data/%s.json?%d' % (
    ranking_date, int(time.time()))

script_src = table.select('script[src="_res/ranking.js"]')[0]
script_src['src'] = '%s?%d' % ('_res/ranking.js', os.path.getmtime('http/_res/ranking.js'))

style_href = table.select('link[href="_res/ranking.css"]')[0]
style_href['href'] = '%s?%d' % ('_res/ranking.css', os.path.getmtime('http/_res/ranking.css'))

rawlink = table.select('a#rawlink')[0]
rawlink['href'] = '%s/%s.csv' % (rawlink['href'], ranking_date)

age_menu = sys.argv[5]
age_menu_file = file('templates/menu-age-%s.html' % (age_menu))
age_menu_placeholder = table.select('div[data-menu="age"]')[0]
age_menu_placeholder.clear()
age_menu_placeholder.append(bs4(age_menu_file, 'html.parser'))

menu_file = file(sys.argv[3])
menu = table.select('div.static-menu')[0]
menu.clear()
menu.append(bs4(menu_file, 'html.parser'))

print table.prettify().encode('utf-8')
