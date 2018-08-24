var ranking = {

    rankingData : {},

    tableRowTemplate: undefined,

    loadData : function(url, callback) {
        $.getJSON(url, function(data) {
            ranking.rankingData = data;
            callback();
        });
    },

    playerClick : function(ev) {
        if (!$(ev.target).closest('a').size()) {
            var row = $(this);
            var pid = row.find('td.pid').text();
            if (pid) {
                var link = 'players/' + pid.trim() + '.html';
                location.href = link;
            }
        }
    },

    parseHash : function(hash) {
        hash = hash.replace(/^#/, '');
        var hashParams = hash.split(';');
        var params = new Map();
        hashParams.forEach(function(hashParam) {
            var param = hashParam.split(':');
            if (param.length > 1) {
                params.set(param[0], decodeURI(param[1]).split(','));
            }
        });
        return params;
    },

    constructHash : function(params) {
        var paramArray = [];
        params.forEach(function(value, key) {
            paramArray.push(key + ':' + value.join(','));
        });
        return paramArray.join(';');
    },

    savedParams : new Map(),

    paramChanged: function(params, param) {
        var newParam = params.get(param) || [];
        var oldParam = ranking.savedParams.get(param) || [];
        return (newParam.length != oldParam.length) || (newParam.join(',') != oldParam.join(','));
    },

    readHash : function(force) {
        var params = ranking.parseHash(location.hash);
        var allParams = ['age', 'gender', 'region', 'name', 'page', 'pagesize', 'club'];
        var paramsChanged = false;
        if (force) {
            paramsChanged = true;
        } else {
            allParams.forEach(function(param) {
                paramsChanged |= ranking.paramChanged(params, param);
            });
        }
        $('button.btn-primary').removeClass('btn-primary');
        params.forEach(function(values, param) {
            values.forEach(function(value) {
                $('button[data-filter="' + param + '"][data-value="' + value + '"]').addClass('btn-primary');
            });
        });
        var filtersPresent = false;
        allParams.forEach(function(param) {
            if ($('button[data-filter="' + param + '"]').size() > 0
                && $('button[data-filter="' + param + '"].btn-primary').size() == 0) {
                $('button[data-clear="' + param + '"]').addClass('btn-primary');
            } else {
                filtersPresent |= ($('button[data-filter="' + param + '"]').size() > 0);
            }
            var field = $('input[data-filter-field="' + param + '"]');
            if (field.size() > 0) {
                field.val(params.get(param));
                if (field.val().length > 0) {
                    filtersPresent = true;
                }
            }
        });
        if (filtersPresent) {
            $('#filters').collapse();
        }
        if (paramsChanged) {
            ranking.filterRows(params);
            ranking.savedParams = params;
        }
        $('table.data-table, .filters .panel-body').css('opacity', 1);
        ranking.filtersDisabled = false;
    },

    filtersDisabled: false,

    filterRows : function(params) {
        $('table.data-table tbody tr').remove();
        var displayRows = [];
        ranking.rankingData.forEach(function(row) {
            var hidden = false;
            params.forEach(function(value, param) {
                if (param == 'name') {
                    if (row['player'].trim().toLowerCase().search(value.join('')) == -1) {
                        hidden = true;
                    }
                } else if (param == 'club') {
                    if (row['club'].trim().toLowerCase().search(value.join('')) == -1) {
                        hidden = true;
                    }
                } else if (param.substr(0, 4) != 'page') {
                    if (value.indexOf(row[param].trim()) == -1) {
                        hidden = true;
                    }
                }
            });
            if (!hidden) {
                displayRows.push(row);
            }
        });
        var allCount = displayRows.length;
        var page = params.get('page') || [0];
        page = parseInt(page[0]) || 1;
        var pagesize = params.get('pagesize') || [0];
        pagesize = parseInt(pagesize[0]) || parseInt($('select#pagesize').val());
        displayRows = displayRows.slice((page-1) * pagesize, page * pagesize);
        displayRows.forEach(function(row) {
            $('table.data-table tbody').append(ranking.buildTableRow(row));
        });
        ranking.buildPaginator('#top-paginator', allCount, pagesize, page);
        ranking.buildPaginator('#bottom-paginator', allCount, pagesize, page);
        $(document).trigger('pagesizeInfo', { 'count': allCount, 'size': pagesize });
        if (page == 1) {
            $('table.data-table tbody tr').eq(0).addClass('gold');
            $('table.data-table tbody tr').eq(1).addClass('silver');
            $('table.data-table tbody tr').eq(2).addClass('bronze');
        }
    },

    buildTableRow: function(row) {
        var tableRow = ranking.tableRowTemplate.clone(true);
        var filterCategories = ['gender', 'age', 'region'];
        if (row['pid']) {
            tableRow.find('td.pid').text(row['pid']);
            tableRow.find('td.pidlink a').attr(
                'href',
                'https://msc.com.pl/cezar/?p=21&pid=' + row['pid']
            );
            tableRow.find('td.name').text(row['player']);
            tableRow.find('td.club').text(row['club']);
            filterCategories.forEach(function(category) {
                tableRow.find('td.' + category).text(row[category]);
                var categoryPlace = tableRow.find('td.' + category + '-place');
                categoryPlace.find('.rank').text(row[category + '-place']);
                var badge = categoryPlace.find('.change');
                badge.text(row[category + '-change']);
                badge.addClass('label-' + row[category + '-change-class']);
                if (row[category + '-place'] == 1) {
                    tableRow.addClass('info');
                }
            });
            var scoreCell = tableRow.find('td.ranking span');
            scoreCell.attr('title', row['score']);
            scoreCell.text(row['score'].toFixed(2));
            tableRow.find('td.place .rank').text(row['place']);
            var badge = tableRow.find('td.place .change');
            badge.text(row['place-change']);
            badge.addClass('label-' + row['place-change-class']);
        } else {
            var columnCnt = 0;
            tableRow.find('td').each(function(idx) {
                if (idx > 0) {
                    $(this).remove();
                    columnCnt++;
                }
            });
            var fillerRow = $('<td>').attr('colspan', columnCnt);
            filterCategories.forEach(function(category) {
                fillerRow.attr('data-' + category, row.category);
            });
            tableRow.append(fillerRow);
            tableRow.find('.rank').text(row['place']);
        }
        return tableRow;
    },

    buildPaginator: function(selector, count, pagesize, page) {
        var box = $(selector);
        box.html('');
        var buttonGroup = $('<div>').addClass('btn-group');
        var pages = parseInt(Math.ceil(count / pagesize));
        buttonGroup.attr('data-pages', pages);
        buttonGroup.append($('<button>').addClass('btn btn-default paginator-prev').attr('type', 'button').text('<<'));
        for (var i = 0; i < pages; i++) {
            var pageBtn = $('<button>').addClass('btn btn-default paginator-page').attr('type', 'button').attr('data-page', i+1).text(i+1);
            if (i+1 == page) {
                pageBtn.addClass('btn-primary');
            }
            buttonGroup.append(pageBtn);
        }
        buttonGroup.append($('<button>').addClass('btn btn-default paginator-next').attr('type', 'button').text('>>'));
        box.append(buttonGroup);
    },

    changePage: function() {
        $('table.data-table').css('opacity', 0.1);
        var btn = $(this);
        var page = parseInt(btn.attr('data-page'));
        var params = ranking.parseHash(location.hash);
        var currentPage = params.get('page');
        currentPage = currentPage ? parseInt(currentPage[0]) : 1;
        if (btn.hasClass('paginator-prev')) {
            page = currentPage - 1;
        }
        if (btn.hasClass('paginator-next')) {
            page = currentPage + 1;
        }
        var count = parseInt(btn.closest('[data-pages]').attr('data-pages'));
        if (page > 0 && page <= count && page != currentPage) {
            params.set('page', [page]);
            location.hash = ranking.constructHash(params);
        } else {
            $('table.data-table').css('opacity', 1);
        }
    },

    init : function() {

        $(document).ready(function() {
            $(window).on('hashchange', function(ev, params) {
                var force = params ? params['force'] : false;
                ranking.filtersDisabled = true;
                $('table.data-table, .filters .panel-body').css('opacity', 0.1);
                ranking.readHash(force);
            });
            ranking.tableRowTemplate = $('table.data-table tbody tr').remove();
            ranking.tableRowTemplate.click(ranking.playerClick);
            ranking.loadData(
                $('table.data-table').attr('data-ranking'),
                function() {
                    $(window).trigger('hashchange', {'force': true});
                }
            );
        });

        var handleParams = function(callback, target, ev) {
            if (!ranking.filtersDisabled) {
                ranking.filtersDisabled = true;
                $('table.data-table, .filters .panel-body').css('opacity', 0.1);
                var oldHash = location.hash.replace(/^#/, '');
                var newParams = callback(target, ev);
                var newHash = ranking.constructHash(newParams);
                if (oldHash != newHash) {
                    location.hash = newHash;
                } else {
                    $('table.data-table, .filters .panel-body').css('opacity', 1);
                    ranking.filtersDisabled = false;
                }
            }
        };

        $('button[data-filter-action]').click(function(ev) {
            handleParams(function(target, ev) {
                var button = target;
                var params = ranking.parseHash(location.hash);
                var param = params.get(button.attr('data-filter-action'));
                var value = $('input[data-filter-field="' + button.attr('data-filter-action') + '"]').val().trim().toLowerCase();
                if (value.length > 0) {
                    params.set(button.attr('data-filter-action'), [value]);
                    params.delete('page');
                }
                return params;
            }, $(this), ev);
        });

        $('button[data-filter]').click(function(ev) {
            handleParams(function(target, ev) {
                var button = target;
                var params = ranking.parseHash(location.hash);
                var param = params.get(button.attr('data-filter'));
                var value = button.attr('data-value');
                var index = param ? param.indexOf(value) : -1;
                if (index > -1) {
                    param = param.filter(function(v) { return v != value; });
                } else {
                    if (!param || !ev.ctrlKey) {
                        param = [];
                    }
                    param.push(value);
                }
                if (!param.length) {
                    params.delete(button.attr('data-filter'));
                } else {
                    params.set(button.attr('data-filter'), param);
                }
                params.delete('page');
                return params;
            }, $(this), ev);
        });

        $('button[data-clear]').click(function() {
            handleParams(function(target, ev) {
                var button = target;
                var params = ranking.parseHash(location.hash);
                params.delete(button.attr('data-clear'));
                params.delete('page');
                return params;
            }, $(this));
        });

        $('select#pagesize').change(function() {
            handleParams(function(target, ev) {
                var params = ranking.parseHash(location.hash);
                params.delete('page');
                params.set('pagesize', [parseInt(target.val())]);
                return params;
            }, $(this));
        });

        $(document).on('click', 'button.paginator-prev, button.paginator-next, button.paginator-page', ranking.changePage);

        $(document).on('pagesizeInfo', function(ev, params) {
            $('span#paginate-count').text(params.count);
            $('select#pagesize').val(params.size);
        });
    }

};

ranking.init();
