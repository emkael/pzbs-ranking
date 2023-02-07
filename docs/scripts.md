Contents of this repository is grouped in several directories, the most significant of them being as follows.

`config` - configuration files
==============================

`db.json`, `import-db.json`

MySQL configuration for the tools. Both files are encrypted in this repository, but they follow the format as defined in `docs/db-example.json`. `db.json` is used by tools that fetch data from the database, `import-db.json` is used by tools that write data into the database - so you can have some granularity in RDBMS permissions.

---

`static.json`

List of pages linked in the top page menu. It's also used to define the list of auto-generated static pages - each entry's `content` property can define content file from `static` directory, in which case the page is being generated via `make statics`.

---

`dates.json`

Defines ranking editions and their basic properties. Every script which iterates over ranking editions, reads this config file.

---

`deploy-path`, `deploy-pass`

Configuration for `deploy.sh` script (invoked via `make deploy`). Files define parameters that are directly compiled into `rsync` invokation and are encrypted in this repository.

`bin` - executable shell scripts
================================

Data import operations
----------------------

`cezar-db-fetch.sh`

Downloads and sanitizes MSC Cezar players file in CSV format (`baza.csv`). Data file is always put in `data/cezar` directory, regardless of current working directory, and its name is the previous day's date.

---

`cezar-db-import.sh`

Loads the downloaded MSC Cezar players CSV file into `players` table, as is. Existing rows (identified by player ID) are replaced, old rows (i.e. ones that are not in the CSV file) are not removed.

---

`rankings-csv-import.sh`

Loads the prepared ranking data CSV file (as processed by `scripts/rankings-csv-convert.py`) into the database. CSV file is first loaded as in into intermediate table, and then joined with *current* player data and processed into `rankings` table.

---

`hidden-import.sh`

Imports PIDs of players hidden (but not disqualified) from the result pages of the rankings.

---

The above scripts can be used to prepare the database for generating ranking pages with any meaningful data. Data import is not covered by any `Makefile` targets, so you need to prepare the database manually (or via these scripts).

For PBU data included in the repository, you'd have to run:

```
bin/cezar-db-fetch.sh
bin/cezar-db-import.sh data/cezar/DATE.csv
bin/hidden-import.sh data/hidden.csv
```

followed by:

```
python3 scripts/rankings-csv-convert.py data/rankings/imports/DATE.csv data/rankings/DATE.csv
bin/rankings-csv-import.sh data/rankings/DATE.csv
```

(the first command is optional, as converted CSV files are included in the repository). This results in a fully prepared ranking edition for a date that's defined in the data/rankings/imports/DATE.csv file header - which then can be defined in `config/dates.json` are produce proper ranking page for that date. If you want ranking changes visible on the ranking page, of course you need to improt at least two ranking editions imported into the database.

Data export tools
-----------------

`datafiles-build.sh`

Generates JSON data files used by ranking table pages. Takes `config/dates.json` file location and desired output directory as parameters and produces files named by ranking editions dates.

---

`group-tools-json.sh`

Generates JSON data file used by special static page for estimated cumulative ranking for groups of players. Takes the `config/dates.json` file location and output directory **of the special group-tools static page** as parameters. The latest (chronologically) edition of the ranking is always taken as data source.

Static content generating scripts
---------------------------------

`menus-build.sh`

Takes two parameters: `config/static.json` file location and output directory. The output directory is then scanned for subdirectories (these beginning with an underscore are ignored) and in each of these subdirectories, script writes a `.menu.html` file, containing HTML snippet with static pages menu, with links adjusted as relative to the output directory.

---

`statics-generate.sh`

Generates all the static pages with defined content from `config/static.json` (which is the script's first parameter). Content source files are resolved relative to script's second parameter, the third being output directory for the pages.

Ranking pages generating scripts
--------------------------------

`rankings-target-files.sh`

Helper script which takes `config/dates.json` and produces target files for ranking pages for `Makefile` purposes (each ranking table file gets its own target via `Makefile` expansion).

---

`rankings-tables-build.sh`

Iterates through ranking editions from `config/dates.json` (script's first parameter) and generates corresponding ranking pages in output directory (second parameter).

Players pages generating scripts
--------------------------------

`players-build.sh`

Ensures `players` subdirectory in the output directory (script's parameter) and generates player page for every player present in any ranking edition in the database.

Deployment scripts
------------------

`deploy.sh`

Just run it to sync pages output directory (script's parameter) with a remote location, via `rsync`. If `config/deploy-pass` is present, it's provided to rsync via `sshpass`. `config/deploy-path` defines remote path for sync.

Temporary menu HTML snippet files are ignored while deploying.

`scripts` - Python scripts
==========================

`pyranking`

Subdirectory contains Python modules shared between scripts, used to fetch rankings from the database.

Data import scripts
-------------------

`rankings-csv-convert.py`

Converts ranking CSV provided by MSC Cezar to format which can be easily loaded into the database.

Data export scripts
-------------------

`datafiles-generate.py`

Dumps processed ranking data for specified date in JSON format. If a second date is provided, changes in the ranking are also indicated.

---

`group-tools-json-generate.py`

Generate JSON data dump for group tools page - ranking list for every player in the database with classification rank filling in for actual ranking for unranked players. Takes ranking date as an argument.

HTML snippet generating scripts
-------------------------------

`menus-compile.py`

Compiles a single HTML file containg menu snippet for static pages to be used from within specified directory, using relative links.

The params are: static pages config file, base directory for static pages, target directory.

---

`menus-write.py`

Writes a pre-compiled menu HTML snippet into HTML page. Looks for a certain, template-specific menu container within HTML page and writes provided content into it. Takes the target HTML file as first argument, HTML snippet file as the second.

---

`rankings-editions.py`

Compiles edition menu from `dates.json` config and writes it into static HTML page, provided as the argument.

HTML content generating scripts
-------------------------------

`rankings-tables-compile.py`

Compiles edition data into ranking table page template. Outputs ranking table page to standard output.

Parameters: edition designation (e.g. `I 2017`), edition ordinal number, static menu snippet file, edition date.

---

`players-compile.py`

Compiles and writes player summary table HTML files for all the players in any of the rankings. Takes output directory and menu HTML snippet file for that directory as arguments.

---

`statics-compile.py`

Compiles static page from a common template and HTML content snippets. HTML content is written to standard output.

The last command line argument serves as header title for the page, all the other arguments are file paths to HTML snippets which are compiled as separate sections of the result page.
