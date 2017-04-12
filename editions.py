import copy, json, sys

from bs4 import BeautifulSoup as bs4

dates_config = json.load(file(sys.argv[1]))
output_file = bs4(file(sys.argv[2]), 'lxml')

editions = {}
for date, link in dates_config.iteritems():
    year = date.split('-')[0]
    if year not in editions:
        editions[year] = []
    editions[year].append(('.'.join(date.split('-')[::-1][0:2]), link, date))

template = bs4(file('templates/ranking.html'), 'lxml')

date_group = template.select('#editions')[0].extract()
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

output_file.select('#editions')[0].replace_with(date_group)
file(sys.argv[2], 'w').write(output_file.prettify().encode('utf-8'))
