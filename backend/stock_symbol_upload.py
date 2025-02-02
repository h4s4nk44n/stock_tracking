import sqlite3
import pandas as pd

# Database file path
DB_PATH = "database.db"
CSV_FILE = "nasdaq_stock_symbols.csv"  # Replace with actual file path

def init_db():
    """Initialize the database and create the stock_symbols table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_symbols (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT UNIQUE,
            name TEXT
        )
    ''')

    conn.commit()
    conn.close()

def upload_stock_symbols():
    """Read stock symbols from CSV and upload them to SQLite database."""
    try:
        # Read CSV file
        df = pd.read_csv(CSV_FILE)

        # Extract relevant columns (assuming 'Symbol' and 'Name' exist)
        df = df[["Symbol", "Name"]]

        # Convert column names
        df.rename(columns={"Symbol": "symbol", "Name": "name"}, inplace=True)

        # Connect to SQLite database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Insert stock symbols into database
        for _, row in df.iterrows():
            try:
                cursor.execute("INSERT INTO stock_symbols (symbol, name) VALUES (?, ?)", (row["symbol"], row["name"]))
            except sqlite3.IntegrityError:
                # Skip duplicate entries
                pass

        conn.commit()
        conn.close()

        print(f"✅ Successfully uploaded {len(df)} stock symbols to {DB_PATH}!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == '__main__':
    init_db()  # Initialize the database
    upload_stock_symbols()  # Upload stock symbols
