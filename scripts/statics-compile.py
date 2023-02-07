import copy, os, sys
from bs4 import BeautifulSoup as bs4

content_files = []
page_header = ''

arguments = sys.argv[1:]

while True:
    page_header = arguments[0]
    arguments = arguments[1:]
    if os.path.exists(page_header):
        content_files.append(page_header)
        page_header = ''
    if len(arguments) == 0:
        break

template = bs4(open('templates/static.html'), 'lxml')

content_wrapper = template.find('div', {'id': 'wrapper'}).extract()
del content_wrapper['id']

template.select('h2 small')[0].string = page_header

footer = template.find('div', {'id': 'footer'})

for content_file in content_files:
    content = copy.copy(content_wrapper)
    content.div.append(
        bs4(open(content_file).read(), 'html.parser')
    )
    footer.insert_before(content)

print(template.prettify())
