var playerClick = function(ev) {
    if (!$(ev.target).closest('a').size()) {
        var row = $(this);
        var pid = row.find('td.pid').text();
        if (pid) {
            var link = 'players/' + pid.trim() + '.html';
            location.href = link;
        }
    }
}

var parseHash = function() {
    var hash = location.hash.replace(/^#/, '');
    var hashParams = hash.split(',');
    var params = new Map();
    hashParams.forEach(function(hashParam) {
        var param = hashParam.split(':');
        if (param.length > 1) {
            params.set(param[0], param[1]);
        }
    });
    return params;
}

var constructHash = function(params) {
    return Array.from(params).map(function(param) {
        return param[0] + ':' + param[1];
    }).join(',');
}

var readHash = function() {
    $('button.btn-primary').removeClass('btn-primary');
    var params = parseHash();
    params.forEach(function(value, param) {
        $('button[data-filter="' + param + '"][data-value="' + value + '"]').addClass('btn-primary');
    });
    var allParams = ['age', 'gender', 'region'];
    allParams.forEach(function(param) {
        if ($('button[data-filter="' + param + '"].btn-primary').size() == 0) {
            $('button[data-clear="' + param + '"]').addClass('btn-primary');
        }
    });
    filterRows(params);
}

var filterRows = function(params) {
    $('table.table tbody tr').show().removeClass('gold silver bronze').each(function() {
        var row = $(this);
        params.forEach(function(value, param) {
            if (row.find('td.' + param).text().trim() != value) {
                row.hide();
            }
        });
    });
    $('table.table tbody tr:visible').eq(0).addClass('gold');
    $('table.table tbody tr:visible').eq(1).addClass('silver');
    $('table.table tbody tr:visible').eq(2).addClass('bronze');
    $('table.table').css('opacity', 1);
}

$('.container .table tbody tr').click(playerClick);

$(document).ready(function() {
    $(window).on('hashchange', readHash).trigger('hashchange');
});

$('button[data-filter]').click(function() {
    $('table.table').css('opacity', 0.1);
    var button = $(this);
    var params = parseHash();
    params.set(button.attr('data-filter'), button.attr('data-value'));
    location.hash = constructHash(params);
});

$('button[data-clear]').click(function() {
    $('table.table').css('opacity', 0.1);
    var button = $(this);
    var params = parseHash();
    params.delete(button.attr('data-clear'));
    location.hash = constructHash(params);
});
