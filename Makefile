all: statics rankings players menus

targetfiles := $(shell bin/target-ranking-files.sh config/dates.json)
tmpfiles := $(patsubst %.html,http/%.html.tmp,$(targetfiles))
rankfiles := $(patsubst %.html,http/%.html.ed,$(targetfiles))

rankings: datafiles tables editions json

datafiles:
	bin/build-datafiles.sh config/dates.json http/_data

tables:
	bin/build-rankings.sh config/dates.json http

editions: $(rankfiles)

$(rankfiles):
	python scripts/editions.py $(patsubst %.ed,%,$@)

json:
	bin/generate-json.sh config/dates.json http

players:
	bin/build-players.sh http

statics:
	python scripts/generate-static-menu.py config/static.json http http > http/.menu.html
	bin/generate-statics.sh config/static.json static http

menus:
	bin/write-menus.sh config/static.json http

group-tools:
	python scripts/static.py static/group-intro.html static/group-form-loading.html static/group-form.html > http/ranking-grupowy.html
	python scripts/generate-static-menu.py config/static.json http http > http/.menu.html
	python scripts/static-menu.py http/ranking-grupowy.html http/.menu.html

minimize: $(tmpfiles)

$(tmpfiles):
	python -m htmlmin.command $(patsubst %.tmp,%,$@) $@
	mv $@ $(patsubst %.tmp,%,$@)

deploy:
	find http -type f -name .menu.html -delete
	bin/deploy.sh

clean:
	find http -type f -name \*.html -delete
