import json, os, sys

from bs4 import BeautifulSoup as bs4

config_file = sys.argv[1]
base_directory = sys.argv[2]
menu_directory = sys.argv[3]

for menu_item in json.load(open(config_file)):
    href = os.path.relpath(
        os.path.join(base_directory, menu_item['url']),
        menu_directory
    )
    link = bs4('<a class="btn btn-default"></a>', 'html.parser')
    link.a['href'] = href
    link.a['title'] = menu_item['header']
    link.a.string = menu_item['label']
    print(link.a)
