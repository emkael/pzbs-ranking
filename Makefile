all: rankings players

rankings: tables editions minimize

tables:
	bin/build-rankings.sh config/dates.json http

rankfiles := $(patsubst %.html,%.html.ed,$(wildcard http/*.html))

editions: $(rankfiles)

$(rankfiles):
	python editions.py $(patsubst %.ed,%,$@)

tmpfiles := $(patsubst %.html,%.html.tmp,$(wildcard http/*.html))

minimize: $(tmpfiles)

$(tmpfiles):
	htmlmin $(patsubst %.tmp,%,$@) $@
	mv $@ $(patsubst %.tmp,%,$@)

players:
	bin/build-players.sh http

deploy:
	sshpass -p `cat config/deploy-pass` rsync -urpP http/ `cat config/deploy-path`
