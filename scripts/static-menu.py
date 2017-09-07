import copy, json, os, sys

from bs4 import BeautifulSoup as bs4

content_file = sys.argv[1]
menu_content = file(sys.argv[2])

content = bs4(file(content_file), 'lxml')

for menu_container in content.select('.static-menu'):
    menu_container.clear()
    menu_container.append(bs4(menu_content, 'html.parser'))

file(content_file, 'w').write(content.prettify().encode('utf-8'))
