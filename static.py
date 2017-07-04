import os, sys
from bs4 import BeautifulSoup as bs4

content_file = sys.argv[1]
page_header = sys.argv[2] if len(sys.argv) > 2 else ''

template = bs4(file('templates/static.html'), 'lxml')
template.select('h2 small')[0].string = page_header
template.find('div', {'id': 'content'}).append(
    bs4(file(content_file).read(), 'lxml')
)

print template.prettify().encode('utf-8')
