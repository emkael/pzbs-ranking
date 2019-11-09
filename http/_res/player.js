$(document).ready(function() {

    var missingTemplate = $('tr.missing').remove();
    var rankingTemplate = $('tr.normal').remove();

    var path = location.pathname.split('/');
    var pid = parseInt(path[path.length-1].replace('.html', ''));
    $.getJSON(pid + '.json', function(data) {
        var nameHeader = $('h2.name');
        nameHeader.prepend(data['name']);
        var pidLink = nameHeader.find('a.pid-link');
        pidLink.attr('href', data['url']);
        $('h3.club').text(data['club']);
        var dates = Object.keys(data['rankings']).sort().reverse();
        dates.forEach(function(date) {
            var ranking = data['rankings'][date];
            var row;
            if (ranking['place']) {
                row = rankingTemplate.clone();
                row.find('td.score span.auto-tooltip').text(ranking['score'].toFixed(2)).attr('title', ranking['score'].toFixed(4));
                row.find('td.place').text(ranking['place']+'.');
                row.find('td.place-change span.label').addClass('label-'+ranking['change-class']).text(ranking['change']);
                ['region', 'age', 'gender'].forEach(function(category) {
                    row.find('td.'+category+' a').attr('href', ranking[category+'-href']).text(ranking[category] || '-');
                    row.find('td.'+category+'-place').text(ranking[category+'-place']+'.');
                    row.find('td.'+category+'-place-change span.label').addClass('label-'+ranking[category+'-change-class']).text(ranking[category+'-change']);
                });
            } else {
                row = missingTemplate.clone();
            }
            row.find('td.date a').attr('href', ranking['href']).text(date);
            $('table.history tbody').append(row);
        });
        initQTip();
    });

});
