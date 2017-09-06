import csv, sys

data = list(csv.reader(file(sys.argv[1]), delimiter=";"))

output = csv.writer(file(sys.argv[2], 'w'))

date = data[1][3]
for row in data[4:1004]:
    output.writerow([row[0], date, row[2], row[1]])
