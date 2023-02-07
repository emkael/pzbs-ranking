import csv, sys

data = list(csv.reader(open(sys.argv[1], encoding='cp1250'), delimiter=";"))

output = csv.writer(open(sys.argv[2], 'w'))

date = data[1][3]
for row in data[4:-1]:
    output.writerow([row[0], date, row[2], row[1]])
