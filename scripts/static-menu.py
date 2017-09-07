import copy, json, os, sys

from bs4 import BeautifulSoup as bs4

config_file = sys.argv[1]
content_file = sys.argv[2]
link_prefix = sys.argv[3] if len(sys.argv) > 3 else ''

content = bs4(file(content_file), 'lxml')

for menu_container in content.select('.static-menu'):
    menu_container.clear()
    for menu_item in json.load(file(config_file)):
        href = os.path.relpath(
            os.path.join(link_prefix, menu_item['url']),
            os.path.dirname(content_file)
        )
        link = bs4('<a class="btn btn-default"></a>', 'html.parser')
        link.a['href'] = href
        link.a['title'] = menu_item['header']
        link.a.string = menu_item['label']
        menu_container.append(link.a)

file(content_file, 'w').write(content.prettify().encode('utf-8'))
