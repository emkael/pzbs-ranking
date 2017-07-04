all: statics rankings players menus

targetfiles := $(shell bin/target-ranking-files.sh config/dates.json)
tmpfiles := $(patsubst %.html,http/%.html.tmp,$(targetfiles))
rankfiles := $(patsubst %.html,http/%.html.ed,$(targetfiles))

rankings: tables editions

tables:
	bin/build-rankings.sh config/dates.json http

editions: tables $(rankfiles)

$(rankfiles):
	python editions.py $(patsubst %.ed,%,$@)

players:
	bin/build-players.sh http

statics:
	bin/generate-statics.sh config/static.json static http

menus:
	bin/write-menus.sh config/static.json http

minimize: $(tmpfiles)

$(tmpfiles):
	python -m htmlmin.command $(patsubst %.tmp,%,$@) $@
	mv $@ $(patsubst %.tmp,%,$@)

deploy:
	bin/deploy.sh

clean:
	find http -type f -name \*.html -delete
