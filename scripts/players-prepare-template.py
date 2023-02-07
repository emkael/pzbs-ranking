import copy, os, sys
import simplejson as json
from bs4 import BeautifulSoup as bs4

output_directory = sys.argv[1]

template = bs4(open('templates/player.html'), 'lxml')
menu_file = sys.argv[2]
menu_content = bs4(open(menu_file), 'html.parser')
menu = template.select('div.static-menu')[0]
menu.append(copy.copy(menu_content))

open(os.path.join(output_directory, 'index.html'), 'w').write(template.prettify())
