all: statics rankings players

targetfiles := $(shell bin/rankings-target-files.sh config/dates.json)
tmpfiles := $(patsubst %.html,http/%.html.tmp,$(targetfiles))
rankfiles := $(patsubst %.html,http/%.html.ed,$(targetfiles))

rankings: datafiles menus tables editions group-json

datafiles:
	bin/datafiles-build.sh config/dates.json http/_data
	bin/datafiles-htaccess.sh config/dates.json http/.htaccess

menus:
	bin/menus-build.sh config/static.json http

tables:
	find http -type l -delete
	bin/rankings-tables-build.sh config/dates.json http

editions: $(rankfiles)

$(rankfiles):
	python3 scripts/rankings-editions.py $(patsubst %.ed,%,$@)

players: player-pages player-data

player-pages: menus
	mkdir -p http/players
	python3 scripts/players-prepare-template.py http/players http/players/.menu.html

player-data:
	python3 scripts/players-compile.py config/dates.json http/players

statics:
	python3 scripts/menus-compile.py config/static.json http http > http/.menu.html
	bin/statics-generate.sh config/static.json static http

group-json:
	bin/group-tools-json.sh config/dates.json http

group-tools:
	python3 scripts/statics-compile.py static/group-intro.html static/group-form-loading.html static/group-form.html > http/ranking-grupowy.html
	python3 scripts/menus-compile.py config/static.json http http > http/.menu.html
	python3 scripts/menus-write.py http/ranking-grupowy.html http/.menu.html

minimize: $(tmpfiles)

$(tmpfiles):
	python3 -m htmlmin.command $(patsubst %.tmp,%,$@) $@
	mv $@ $(patsubst %.tmp,%,$@)

deploy:
	bin/deploy.sh http

clean:
	find http -type f -name \*.html -delete
