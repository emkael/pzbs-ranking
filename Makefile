tmpfiles := $(patsubst %.html,%.html.tmp,$(wildcard http/*.html))
rankfiles := $(patsubst %.html,%.html.ed,$(wildcard http/*.html))

$(tmpfiles):
	htmlmin $(patsubst %.tmp,%,$@) $@
	mv $@ $(patsubst %.tmp,%,$@)

$(rankfiles):
	python editions.py $(patsubst %.ed,%,$@)

all: rankings players

minimize: $(tmpfiles)

deploy:
	sshpass -p `cat config/deploy-pass` rsync -urpP http/ `cat config/deploy-path`

rankings: tables editions

tables:
	bin/build-rankings.sh config/dates.json http

editions: $(rankfiles)

players:
	bin/build-players.sh http
