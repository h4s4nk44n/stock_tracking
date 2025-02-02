from flask import Flask, jsonify, request
import sqlite3
import yfinance as yf
import pandas as pd
import numpy as np  # Import NumPy for NaN handling
from flask_cors import CORS
import traceback  # ✅ Import traceback for debugging

DATABASE = "database.db"
PERIODS = ["1d", "7d", "30d", "1y", "10y"]
INTERVALS = ["1m", "5m", "15m", "1d", "1d"]
CSV_FILE = "nasdaq_stocks.csv"

def get_db():
    db = sqlite3.connect(DATABASE)
    print(f"📂 Connected to database: {DATABASE}")  # ✅ Print database location
    return db
    
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Allow all origins\

def init_db(symbol, period):
    """Ensure stock data table exists before inserting data."""
    table_name = f"stock_data_{symbol}_{period}"
    db = get_db()
    cursor = db.cursor()
    
    print(f"🛠️ Ensuring table exists: {table_name}")

    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS {table_name} (
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
    
    db.commit()
    db.close()
    print(f"✅ Table {table_name} is ready!")
    return table_name

def fetch_and_store_stock(symbol):
    """Fetch stock data from Yahoo Finance and store it in the database."""
    for period, interval in zip(PERIODS, INTERVALS):  # ✅ Match periods with intervals
        print(f"📡 Attempting to fetch {symbol} for period {period} and interval {interval}...")

        try:
            df = yf.download(symbol, period=period, interval=interval)

            if df.empty:
                print(f"❌ No data found for {symbol} ({period}, {interval}) - Skipping...")
                continue  

            print(f"✅ Successfully fetched data for {symbol} ({period}, {interval})!")

            # 🔥 Flatten MultiIndex Columns
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(1)  # Extract second level
                print(f"📉 Flattened MultiIndex columns: {df.columns}")

            # 🔥 Ensure correct column names
            expected_cols = ["open", "high", "low", "close", "volume"]
            df.columns = expected_cols[: len(df.columns)]  # ✅ Adjust based on available columns
            print(f"✅ Renamed columns: {df.columns}")

            # 🔥 Reset index and rename timestamp column dynamically
            df.reset_index(inplace=True)

            if "Datetime" in df.columns:
                df.rename(columns={"Datetime": "timestamp"}, inplace=True)
            elif "Date" in df.columns:
                df.rename(columns={"Date": "timestamp"}, inplace=True)
            else:
                raise KeyError("Timestamp column not found in fetched data!")

            # 🔥 Ensure timestamp column is properly formatted
            df["timestamp"] = pd.to_datetime(df["timestamp"]).dt.strftime("%Y-%m-%d %H:%M:%S")

            df.columns = df.columns.str.lower()  # Convert to lowercase
            df.replace({np.nan: None}, inplace=True)

            # ✅ Ensure proper table naming format (`stock_data_{symbol}_{period}`)
            table_name = f"stock_data_{symbol}_{period}".replace("-", "_")  
            print(f"🛠️ Creating table in database: {table_name}")

            db = get_db()
            cursor = db.cursor()

            cursor.execute(f'''
                CREATE TABLE IF NOT EXISTS {table_name} (
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
            db.commit()
            print(f"✅ Table {table_name} created successfully!")

            for _, row in df.iterrows():
                try:
                    cursor.execute(f'''
                        INSERT INTO {table_name} (symbol, timestamp, open, high, low, close, volume)
                        VALUES (?, ?, ?, ?, ?, ?, ?)''',
                        (symbol, row["timestamp"], row.get("open"), row.get("high"), row.get("low"), row.get("close"), row.get("volume")))
                except sqlite3.IntegrityError:
                    print(f"⚠️ Skipping duplicate entry for {symbol} at {row['timestamp']}")

            db.commit()
            db.close()
            print(f"✅ Successfully stored {symbol} data for {period} in database.")

        except Exception as e:
            print(f"🔥 ERROR while fetching {symbol} ({period}, {interval}): {e}")

# ✅ Ensure CORS is applied to all routes
@app.route('/')
def stock_symbol_data():
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("SELECT symbol, name FROM stock_symbols")
        data = cursor.fetchall()

        if not data:
            return jsonify([])  # ✅ Return empty list instead of 404

        stock_list = [{"symbol": row[0], "name": row[1]} for row in data]
        return jsonify(stock_list)

    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    finally:
        db.close()
        
@app.route('/stocks/<symbol>')
def get_stock(symbol):
    symbol = symbol.upper()
    period = request.args.get("period", "1d")  # Default to "1d"

    table_name = f'stock_data_{symbol}_{period}'.replace("-", "_")  # Ensure table name matches format
    db = get_db()
    cursor = db.cursor()

    try:
        print(f"📂 Checking if table exists: {table_name}")

        # Check if the table exists
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
        table_exists = cursor.fetchone()

        if not table_exists:
            print(f"⚠️ Table {table_name} does not exist. Fetching data...")
            fetch_and_store_stock(symbol)

        # Fetch stock data
        cursor.execute(f'SELECT timestamp, close, open, high, low, volume,symbol FROM {table_name} WHERE symbol = ?', (symbol,))
        data = cursor.fetchall()
        
        if not data:
            print(f"❌ {symbol} ({period}) still not found after fetching.")
            return jsonify({"error": "Stock data not found"}), 404
        
        return jsonify([
            {
                "timestamp": row[0],
                "close": row[1],
                "open": row[2],
                "high": row[3],
                "low": row[4],
                "volume": row[5],
                "symbol": row[6],
            }
            for row in data
        ])
    
    except sqlite3.Error as e:
        print(f"🔥 SQLite Error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    
    finally:
        db.close()


if __name__ == '__main__':
    print("🚀 Running Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)

