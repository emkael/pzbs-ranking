tmpfiles := $(patsubst %.html,%.html.tmp,$(wildcard http/*.html))
rankfiles := $(patsubst %.html,%.html.ed,$(wildcard http/*.html))

$(tmpfiles):
	python -m htmlmin.command $(patsubst %.tmp,%,$@) $@
	mv $@ $(patsubst %.tmp,%,$@)

$(rankfiles):
	python editions.py $(patsubst %.ed,%,$@)

all: rankings players

minimize: $(tmpfiles)

deploy:
	bin/deploy.sh

rankings: tables editions

tables:
	bin/build-rankings.sh config/dates.json http

editions: $(rankfiles)

players:
	bin/build-players.sh http
