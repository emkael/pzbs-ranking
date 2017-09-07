import json
import mysql.connector

settings = json.load(file('config/db.json'))

connection = mysql.connector.connect(
    user=settings['user'],
    password=settings['pass'],
    host=settings['host'],
    port=settings['port'],
    database=settings['db']
)
cursor = connection.cursor(dictionary=True, buffered=True)
