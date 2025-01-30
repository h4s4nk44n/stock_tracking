import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS stock_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT,
        timestamp TEXT,
        open REAL,
        high REAL,
        low REAL,
        close REAL,
        volume INTEGER
    )
''')

# Create news table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS news_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT,
        timestamp TEXT,
        headline TEXT,
        sentiment TEXT,
        sentiment_score REAL
    )
''')

# Commit changes and close the connection
conn.commit()
conn.close()

print("Tables created successfully!")