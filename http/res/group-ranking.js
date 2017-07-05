$(document).ready(function() {
    $('div.panel').eq(2).hide();
    $.getJSON('res/ranking.json', function(data) {
        var minRating = Number.POSITIVE_INFINITY;
        for (var pid in data) {
            if (data[pid].score < minRating) {
                minRating = data[pid].score;
            }
        };
        $(document).trigger(
            'rankingLoaded',
            {
                ranks: data,
                minRating: minRating
            }
        );
    });
});

$(document).on('rankingLoaded', function(ev, params) {

    var getScore = function(pid) {
        if (params.ranks[pid]) {
            return params.ranks[pid].score ||
                Math.max(
                    0.1, Math.min(
                        params.minRating, params.ranks[pid].rank * 2.0
                    )
                );
        }
        return 0.1;
    };

    var getPlace = function(pid) {
        if (params.ranks[pid]) {
            return params.ranks[pid].place || 1500;
        }
        return 1500;
    };

    var averages = {
        place: function() {
            var sum = 0.0;
            for (var p = 0; p < arguments.length; p++) {
                sum += getPlace(arguments[p].pid);
            }
            return sum / arguments.length;
        },
        arithmetic: function() {
            var sum = 0.0;
            for (var p = 0; p < arguments.length; p++) {
                sum += getScore(arguments[p].pid);
            }
            return sum / arguments.length;
        },
        geometric: function() {
            var product = 1.0;
            for (var p = 0; p < arguments.length; p++) {
                product *= getScore(arguments[p].pid);
            }
            return Math.pow(product, 1.0/arguments.length);
        },
        harmonic: function() {
            var sum = 0.0;
            for (var p = 0; p < arguments.length; p++) {
                sum += 1.0 / getScore(arguments[p].pid);
            }
            return arguments.length / sum;
        }
    };

    var tourRowTemplate = $('<tr><td class="place text-right"></td><td class="pair"></td><td class="mean-place text-right"></td><td class="mean-arithmetic text-right"></td><td class="mean-geometric text-right"></td><td class="mean-harmonic text-right"></td></tr>');

    $('div.panel').eq(1).hide();
    $('div.panel').eq(2).show();

    $('#group-results').hide();

    $('#group-submit').on('click', function() {
        $('#group-results tr').not('.mean').remove();
        var players =
            $('#group-pids').val().trim().split("\n").filter(
                function(text) {
                    return text.trim().length > 0;
                }
            ).map(function(str) {
                return { pid: parseInt(str.trim()) };
            });
        players.forEach(function(pl) {
            $('#group-results tbody').prepend(
                $(
                    '<tr><th>PID: '
                        + pl.pid
                        + '</th><td class="text-right">'
                        + getPlace(pl.pid)
                        + '.</td><td class="text-right">'
                        + getScore(pl.pid)
                        + '</td>'
                )
            );
        });
        for (var f in averages) {
            $('#group-results td.mean-' + f).text(Math.round(
                averages[f].apply(this, players) * 100
            ) / 100);
        }
        $('#group-results').show();
    });

    var tourTable = $('#tournament-table');
    tourTable.hide();
    var tourSort = new Tablesort(
        tourTable[0],
        { descending: true }
    );

    $('#tournament-file').fileinput({
        showPreview: false,
        showUpload: false,
        showRemove: false,
        allowedFileTypes: ['html'],
        allowedFileExtensions: ['html'],
        browseLabel: 'Wybierz...'
    }).on('change', function(ev) {
        if (ev.target.files.length > 0) {
            var reader = new FileReader();
            reader.onloadend = function() {

                tourTable.hide();

                var content = $(reader.result);
                var pairs = content.find('tr').filter(
                    function(i, elem) {
                        return $(elem).find('td.l').size() > 0;
                    }
                );
                var pairData = pairs.map(function(i, pair) {
                    pair = $(pair);
                    var playerCell = pair.find('td.l').eq(0);
                    var players = playerCell.contents().filter(
                        function (i, elem) {
                            return elem.tagName != 'BR';
                        }
                    ).map(
                        function(i, elem) {
                            if (elem.tagName == 'A') {
                                var pidMatch = $(elem).attr('href').match(/http:\/\/www\.msc\.com\.pl\/cezar\/.*&pid=(\d+),*/);
                                return {
                                    name: $(elem).text(),
                                    pid: pidMatch ? parseInt(pidMatch[1]) : 0
                                }
                            } else {
                                return {
                                    name: $(elem).text(),
                                    pid: 0
                                }
                            }
                        }
                    );

                    return {
                        place: i+1,
                        players: players
                    };
                });
                $('#tournament-table tbody tr').remove();
                pairData.each(function(p, pair) {
                    var row = tourRowTemplate.clone();
                    row.find('td.place').text(pair.place);
                    row.find('td.pair').text(
                        $.map(
                            pair.players,
                            function(pl) {
                                return pl.name;
                            }
                        ).join(' - ')
                    );
                    for (var f in averages) {
                        row.find('td.mean-' + f).text(Math.round(
                            averages[f].apply(this, pair.players) * 100
                        ) / 100);
                    }
                    $('#tournament-table tbody').append(row);
                });

                $('#tournament-table').show();
                tourSort.refresh();

            };
            reader.readAsText(ev.target.files[0]);
        }
    });
});
