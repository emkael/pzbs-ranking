import copy, json, sys
from collections import OrderedDict

from bs4 import BeautifulSoup as bs4

dates_config = json.load(file('config/dates.json'))
output_file = bs4(file(sys.argv[1]), 'lxml')

editions = OrderedDict()
for date_config in dates_config:
    year = date_config['name'].split(' ')[1]
    if year not in editions:
        editions[year] = []
    editions[year].append((
        '%s (%s)' % (date_config['name'].split(' ')[0], date_config['index']),
        date_config['url'],
        date_config['date']
    ))

template = bs4(file('templates/ranking.html'), 'lxml')

date_group = template.select('#editions')[0].extract()
year_group = date_group.select('div[role="group"]')[0].extract()
ranking_link = year_group.select('.btn-default')[0].extract()
for year, dates in editions.iteritems():
    group = copy.copy(year_group)
    group.select('.year')[0].string = str(year)
    for date in dates[::-1]:
        link = copy.copy(ranking_link)
        link.string = date[0]
        link['href'] = date[1]
        link['datetime'] = date[2]
        group.append(link)
    date_group.insert(0, group)

output_file.select('#editions')[0].replace_with(date_group)
file(sys.argv[1], 'w').write(output_file.prettify().encode('utf-8'))
