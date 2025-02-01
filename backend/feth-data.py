import sqlite3
import yfinance as yf
import pandas as pd
import numpy as np

# Database file path
DB_PATH = "database.db"
SYMBOL = "GOOGL"

def init_db():
    """Initialize the database and create the stock_data_10years table if not exists"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_data_10years (
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
    """Fetch 1 year of daily stock data and store it in the database"""
    print(f"📡 Fetching last 1 year of {symbol} stock data (daily interval)...")

    try:
        df = yf.download(symbol, period="10y", interval="1d")

        if df.empty:
            print(f"❌ No data found for {symbol}.")
            return

        # ✅ Flatten MultiIndex if necessary
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)  # Take only first level

        # ✅ Ensure "Date" is a column, not an index
        if "Date" not in df.columns:
            df.reset_index(inplace=True)

        # ✅ Rename "Date" column to "timestamp"
        df.rename(columns={"Date": "timestamp"}, inplace=True)

        # ✅ Ensure "timestamp" column exists
        if "timestamp" not in df.columns:
            raise ValueError("❌ ERROR: 'timestamp' column missing after processing!")

        # ✅ Convert "timestamp" to string format (YYYY-MM-DD HH:MM:SS)
        df["timestamp"] = pd.to_datetime(df["timestamp"]).dt.strftime("%Y-%m-%d %H:%M:%S")

        # ✅ Convert columns to lowercase
        df.columns = df.columns.str.lower()

        # ✅ Handle NaN values (convert them to None for SQLite)
        df.replace({np.nan: None}, inplace=True)

        # ✅ Convert all values to Python native types
        df["open"] = df["open"].astype(float)
        df["high"] = df["high"].astype(float)
        df["low"] = df["low"].astype(float)
        df["close"] = df["close"].astype(float)
        df["volume"] = df["volume"].fillna(0).astype(int)  # Fix volume NaN issue

        # Connect to SQLite database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Insert stock data into the database, avoiding duplicates
        for _, row in df.iterrows():
            try:
                timestamp = str(row["timestamp"])
                open_price = float(row["open"]) if row["open"] is not None else None
                high_price = float(row["high"]) if row["high"] is not None else None
                low_price = float(row["low"]) if row["low"] is not None else None
                close_price = float(row["close"]) if row["close"] is not None else None
                volume = int(row["volume"]) if row["volume"] is not None else None

                # Debugging print to check values before inserting
                print(f"Inserting: {symbol}, {timestamp}, {open_price}, {high_price}, {low_price}, {close_price}, {volume}")

                cursor.execute('''
                    INSERT INTO stock_data_10years (symbol, timestamp, open, high, low, close, volume)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (symbol, timestamp, open_price, high_price, low_price, close_price, volume))

            except sqlite3.IntegrityError:
                print(f"⚠️ Skipping duplicate entry for {symbol} at {timestamp}")

        # Commit and close database
        conn.commit()
        conn.close()

        print(f"✅ Successfully stored last 1 year of {symbol} stock data in {DB_PATH}!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")


# Run the script
if __name__ == '__main__':
    init_db()  # Initialize the database
    fetch_and_store_stock(SYMBOL)  # Fetch & store stock data
