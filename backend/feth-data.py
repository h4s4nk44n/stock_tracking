import sqlite3
import yfinance as yf
import pandas as pd
import numpy as np

# Database file path
DB_PATH = "database.db"
SYMBOL = "GOOGL"

# ✅ Automatically adjust period & interval based on need
PERIOD = "1d"  # Choose from '7d', '60d', '1y', '10y', etc.
INTERVAL = "1m"  # '1m' for intraday, '1d' for long-term

def init_db(symbol, period):
    """Initialize the database and create the stock_data table if not exists"""
    table_name = f"stock_data_{symbol}_{period.replace(' ', '_')}"  # ✅ Ensure table name is valid
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS {table_name} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT,
            timestamp TEXT,  -- ✅ Removed UNIQUE constraint
            open REAL,
            high REAL,
            low REAL,
            close REAL,
            volume INTEGER
        )
    ''')

    conn.commit()
    conn.close()
    return table_name

def fetch_and_store_stock(symbol):
    """Fetch stock data and store it in the database"""
    print(f"📡 Fetching last {PERIOD} of {symbol} stock data ({INTERVAL} interval)...")

    try:
        df = yf.download(symbol, period=PERIOD, interval=INTERVAL)

        if df.empty:
            print(f"❌ No data found for {symbol}.")
            return

        # ✅ Flatten MultiIndex if necessary
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)  # Take only first level

        # ✅ Ensure "timestamp" is a column, not an index
        df.reset_index(inplace=True)

        # ✅ Rename "Date" or "Datetime" column to "timestamp"
        df.rename(columns={"Date": "timestamp", "Datetime": "timestamp"}, inplace=True)

        # ✅ Convert "timestamp" to string format (YYYY-MM-DD HH:MM:SS)
        df["timestamp"] = pd.to_datetime(df["timestamp"]).dt.strftime("%Y-%m-%d %H:%M:%S")

        # ✅ Convert column names to lowercase
        df.columns = df.columns.str.lower()

        # ✅ Handle NaN values
        df.replace({np.nan: None}, inplace=True)

        # ✅ Convert all values to Python native types
        df["open"] = df["open"].astype(float)
        df["high"] = df["high"].astype(float)
        df["low"] = df["low"].astype(float)
        df["close"] = df["close"].astype(float)
        df["volume"] = df["volume"].fillna(0).astype(int)

        # Connect to SQLite database
        table_name = f"stock_data_{symbol}_{PERIOD.replace(' ', '_')}"  # ✅ Use a valid table name
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Insert stock data into the database
        for _, row in df.iterrows():
            try:
                cursor.execute(f'''
                    INSERT INTO {table_name} (symbol, timestamp, open, high, low, close, volume)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (symbol, row["timestamp"], row["open"], row["high"], row["low"], row["close"], row["volume"]))
            except sqlite3.IntegrityError:
                print(f"⚠️ Skipping duplicate entry for {symbol} at {row['timestamp']}")

        # Commit and close
        conn.commit()
        conn.close()

        print(f"✅ Successfully stored last {PERIOD} of {symbol} stock data in {DB_PATH}!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")


# Run the script
if __name__ == '__main__':
    table_name = init_db(SYMBOL, PERIOD)  # ✅ Pass symbol and period dynamically
    fetch_and_store_stock(SYMBOL)  # Fetch & store stock data
