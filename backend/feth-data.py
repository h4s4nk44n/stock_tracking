import sqlite3
import yfinance as yf
import pandas as pd
import numpy as np

# Database file path
DB_PATH = "database.db"
SYMBOL = "GOOGL"

def init_db():
    """Initialize the database and create table if not exists"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT,
            timestamp TEXT UNIQUE,
            open REAL,
            high REAL,
            low REAL,
            close REAL,
            volume INTEGER
        )
    ''')

    conn.commit()
    conn.close()

def fetch_and_store_stock(symbol):
    """Fetch stock data from Yahoo Finance and store it in the database"""
    print(f"📡 Fetching 10 years of {symbol} stock data...")

    try:
        # Download stock data for the last 10 years (daily)
        df = yf.download(symbol, period="10y", interval="1d")

        if df.empty:
            print(f"❌ No data found for {symbol}.")
            return

        # Reset index to make "Date" a column
        df.reset_index(inplace=True)

        # Convert timestamp to string format YYYY-MM-DD
        df["Date"] = df["Date"].dt.strftime('%Y-%m-%d')

        # Rename columns to match database schema
        df.rename(columns={"Date": "timestamp", "Open": "open", "High": "high",
                           "Low": "low", "Close": "close", "Volume": "volume"}, inplace=True)

        # Handle NaN values (convert them to None for SQLite)
        df.replace({np.nan: None}, inplace=True)

        # Convert all values to Python native types to avoid type errors
        df["open"] = df["open"].astype(float)
        df["high"] = df["high"].astype(float)
        df["low"] = df["low"].astype(float)
        df["close"] = df["close"].astype(float)
        df["volume"] = df["volume"].astype("Int64")  # Use Int64 to handle None

        # Connect to SQLite database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Insert stock data into the database, avoiding duplicates
        for _, row in df.iterrows():
            try:
                # Convert each value to a Python primitive type
                timestamp = str(row["timestamp"])
                open_price = float(row["open"]) if row["open"] is not None else None
                high_price = float(row["high"]) if row["high"] is not None else None
                low_price = float(row["low"]) if row["low"] is not None else None
                close_price = float(row["close"]) if row["close"] is not None else None
                volume = int(row["volume"]) if row["volume"] is not None else None

                # Debugging print to check values before inserting
                print(f"Inserting: {symbol}, {timestamp}, {open_price}, {high_price}, {low_price}, {close_price}, {volume}")

                cursor.execute('''
                    INSERT INTO stock_data (symbol, timestamp, open, high, low, close, volume)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (symbol, timestamp, open_price, high_price, low_price, close_price, volume))

            except sqlite3.IntegrityError:
                # Skip duplicate records
                pass

        # Commit and close database
        conn.commit()
        conn.close()

        print(f"✅ Successfully stored 10 years of {symbol} stock data in {DB_PATH}!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")

# Run the script
if __name__ == '__main__':
    init_db()  # Initialize the database
    fetch_and_store_stock(SYMBOL)  # Fetch & store TSLA data
