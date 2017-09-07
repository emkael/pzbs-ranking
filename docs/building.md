There's a Makefile provided to do all the work within a standard setup.

To build all the pages, use:

```
make
```

To minimize generated ranking pages, use:

```
make minimize
```

To sync the generated content to a remote server of your choice, use:

```
make deploy
```

Note that the last command is designed with automatization in mind, so you'd need:

* `sshpass` utility to be able to provide SSH password for `rsync` in command line
 * proper `config/deploy-path` and `config/deploy-pass` files, which are encrypted in this repository

If you want to use some other way of deploying content to your target environment (like passwordless SSH connection for rsync/sftp), for now you have to do it manually.

You can also use subtargets of `make`, which (re)build only part of the content:

 * `make statics` build pre-defined static pages, using `static.html` template and content files from `static/` defined as in `config/static.json`
 * `make rankings` builds only ranking pages
 * `make players` builds only players pages

The subtarget for `rankings` is separated into several stages, some of them independent:

 * `make datafiles` generates JSON data files that HTML front-end loads to display tables of ranking data
 * `make menus` pre-generates top menu to insert into HTML pages for ranking pages (this subtarget is also a dependency for `make players`)
 * `make tables` generates ranking table HTML pages for editions defined in `config/dates.json`
 * `make editions` compiles editions menu into ranking table pages (e.g. if you're not rebuilding all ranking pages and just generating the newest)
 * `make group-json` updates JSON data file for group ranking tools (below)

The special target `make group-tools` compiles special static page that consists of some forms to calculate cumulative ranking for groups of contestants.
