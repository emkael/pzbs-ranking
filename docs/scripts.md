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

The above scripts can be used to prepare the database for generating ranking pages with any meaningful data. Data import is not covered by any `Makefile` targets, so you need to prepare the database manually (or via these scripts).

For PBU data included in the repository, you'd have to run:

```
bin/cezar-db-fetch.sh
bin/cezar-db-import.sh data/cezar/DATE.csv
```

followed by:

```
python scripts/rankings-csv-convert.py data/rankings/imports/DATE.csv data/rankings/DATE.csv
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
