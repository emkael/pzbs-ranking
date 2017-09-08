all: statics rankings players

targetfiles := $(shell bin/rankings-target-files.sh config/dates.json)
tmpfiles := $(patsubst %.html,http/%.html.tmp,$(targetfiles))
rankfiles := $(patsubst %.html,http/%.html.ed,$(targetfiles))

rankings: datafiles menus tables editions group-json

datafiles:
	bin/datafiles-build.sh config/dates.json http/_data

menus:
	bin/menus-build.sh config/static.json http

tables:
	bin/rankings-tables-build.sh config/dates.json http

editions: $(rankfiles)

$(rankfiles):
	python scripts/rankings-editions.py $(patsubst %.ed,%,$@)

players: menus player-pages

player-pages:
	bin/players-build.sh http

statics:
	python scripts/menus-compile.py config/static.json http http > http/.menu.html
	bin/statics-generate.sh config/static.json static http

group-json:
	bin/group-tools-json.sh config/dates.json http

group-tools:
	python scripts/statics-compile.py static/group-intro.html static/group-form-loading.html static/group-form.html > http/ranking-grupowy.html
	python scripts/menus-compile.py config/static.json http http > http/.menu.html
	python scripts/menus-write.py http/ranking-grupowy.html http/.menu.html

minimize: $(tmpfiles)

$(tmpfiles):
	python -m htmlmin.command $(patsubst %.tmp,%,$@) $@
	mv $@ $(patsubst %.tmp,%,$@)

deploy:
	bin/deploy.sh http

clean:
	find http -type f -name \*.html -delete
