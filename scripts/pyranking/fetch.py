from pyranking.db import cursor

def fetch_ranking(date, assoc=False):
    sql = '''SELECT
    rankings.place,
    rankings.pid,
    CONCAT(players.name, " ", players.surname) player,
    players.rank,
    rankings.region, players.club,
    REPLACE(rankings.flags, "K", "") age,
    IF(rankings.flags LIKE 'K%', "K", "") gender,
    rankings.score
FROM rankings
JOIN players
    ON players.id = rankings.pid
WHERE rankings.date = %(date)s
ORDER BY rankings.place
    '''
    cursor.execute(sql, {'date': date})
    ranks = {
        'gender': {},
        'age': {},
        'region': {}
    }
    ranking = cursor.fetchall()
    for row in ranking:
        if row['gender'] == '':
            row['gender'] = 'M'
        for category in ['gender', 'age', 'region']:
            if row[category] not in ranks[category]:
                ranks[category][row[category]] = 0
            ranks[category][row[category]] += 1
            row[category + '-place'] = ranks[category][row[category]]
        for category in ['place', 'gender', 'age', 'region']:
            row[category + '-change'] = 'N'
            row[category + '-change-class'] = 'info'
    if assoc:
        result = {}
        for row in ranking:
            result[row['pid']] = row
        return result
    return ranking
