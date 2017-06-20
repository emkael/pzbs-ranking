$.fn.paginate = function(pagesize, page) {

    var $this = this;
    if (pagesize == 'clear') {
        $this.removeAttr('data-paginate');
        $this.find('[data-paginate-visible]').removeAttr('data-paginate-visible');
        $this.find('tbody tr').show();
        return;
    }

    var pagesize = pagesize || 50;
    var page = page || 1;

    var rows = $this.find('tbody tr');
    if (!$this.attr('data-paginate')) {
        $this.attr('data-paginate', pagesize);
        rows.filter(':visible').attr('data-paginate-visible', 1);
    } else {
        pagesize = parseInt($this.attr('data-paginate'));
    }

    var visible = rows.filter('[data-paginate-visible=1]');
    visible.each(function(index, row) {
        row = $(row);
        if (index >= (page-1)*pagesize
            && index < page*pagesize) {
            row.show();
        } else { // rollin', rollin', rollin'...
            row.hide();
        }
    });

    return visible.size();
};

var ranking = {

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
                params.set(param[0], param[1].split(','));
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

    readHash : function() {
        var params = ranking.parseHash(location.hash);
        var allParams = ['age', 'gender', 'region', 'name'];
        var paramsChanged = false;
        allParams.forEach(function(param) {
            var newParam = params.get(param) || [];
            var oldParam = ranking.savedParams.get(param) || [];
            if (newParam.length != oldParam.length || newParam.join(',') != oldParam.join(',')) {
                paramsChanged = true;
            }
        });
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
            $('table.table-paginate').paginate('clear');
            ranking.filterRows(params);
            ranking.savedParams = params;
        }
        $('table.data-table, .filters .panel-body').css('opacity', 1);
        ranking.filtersDisabled = false;
        var pagesize = 40;
        var page = params.get('page') || [0];
        var count = $('table.table-paginate').paginate(pagesize, parseInt(page[0]));
        $('table.data-table tbody tr[data-paginate-visible=1]').eq(0).addClass('gold');
        $('table.data-table tbody tr[data-paginate-visible=1]').eq(1).addClass('silver');
        $('table.data-table tbody tr[data-paginate-visible=1]').eq(2).addClass('bronze');
        ranking.buildPaginator('#top-paginator', count, pagesize, page[0] || 1);
        ranking.buildPaginator('#bottom-paginator', count, pagesize, page[0] || 1);
    },

    filtersDisabled: false,

    filterRows : function(params) {
        $('table.data-table tbody tr').show().removeClass('gold silver bronze').each(function() {
            var row = $(this);
            var hidden = false;
            params.forEach(function(value, param) {
                if (param == 'name') {
                    if (row.find('td.' + param).text().trim().toLowerCase().search(value.join('')) == -1) {
                        row.hide();
                        hidden = true;
                    }
                } else if (param != 'page') {
                    if (value.indexOf(row.find('td.' + param).text().trim()) == -1) {
                        row.hide();
                        hidden = true;
                    }
                }
            });
            if (!hidden) {
                row.show();
            }
        });
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
        if (page > 0 && page <= count) {
            params.set('page', [page]);
            location.hash = ranking.constructHash(params);
        } else {
            $('table.data-table').css('opacity', 1);
        }
    },

    init : function() {

        $('.container .table tbody tr').click(ranking.playerClick);

        $(document).ready(function() {
            $(window).on('hashchange', ranking.readHash).trigger('hashchange');
        });

        $('button[data-filter-action]').click(function(ev) {
            if (!ranking.filtersDisabled) {
                ranking.filtersDisabled = true;
                $('table.data-table, .filters .panel-body').css('opacity', 0.1);
                var button = $(this);
                var params = ranking.parseHash(location.hash);
                var param = params.get(button.attr('data-filter-action'));
                var value = $('input[data-filter-field="' + button.attr('data-filter-action') + '"]').val().trim().toLowerCase();
                params.set(button.attr('data-filter-action'), [value]);
                params.delete('page');
                location.hash = ranking.constructHash(params);
            }
        });

        $('button[data-filter]').click(function(ev) {
            if (!ranking.filtersDisabled) {
                ranking.filtersDisabled = true;
                $('table.data-table, .filters .panel-body').css('opacity', 0.1);
                var button = $(this);
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
                location.hash = ranking.constructHash(params);
            }
        });

        $('button[data-clear]').click(function() {
            if (!ranking.filtersDisabled) {
                ranking.filtersDisabled = true;
                $('table.data-table, .filters .panel-body').css('opacity', 0.1);
                var button = $(this);
                var params = ranking.parseHash(location.hash);
                params.delete(button.attr('data-clear'));
                params.delete('page');
                location.hash = ranking.constructHash(params);
            }
        });

        $(document).on('click', 'button.paginator-prev, button.paginator-next, button.paginator-page', ranking.changePage);
    }

};

ranking.init();
