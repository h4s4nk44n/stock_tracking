from flask import Flask, jsonify, request
import sqlite3
import yfinance as yf
import pandas as pd
import numpy as np  # Import NumPy for NaN handling
from flask_cors import CORS

DATABASE = "database.db"
CSV_FILE = "nasdaq_stocks.csv"

def get_db():
    db = sqlite3.connect(DATABASE)
    return db
    
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Allow all origins\

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
    interval = request.args.get("interval", "1d")  # Default to "1d" if not provided

    db = get_db()
    cursor = db.cursor()

    # ✅ Choose table based on the selected interval
    if interval == "1d":
        table_name = f'stock_data_{symbol}_{interval}'  # Today's data
    elif interval == "1w":
        table_name = f'stock_data_{symbol}_7d'
    elif interval == "1m":
        table_name = f'stock_data_{symbol}_30d'   
    elif interval == "1y":
        table_name = f'stock_data_{symbol}_{interval}'
    elif interval == "10y":
        table_name = f'stock_data_{symbol}_{interval}'  # 10 years data
    else:
        return jsonify({"error": "Invalid interval"}), 400  # Return an error if interval is not recognized

    try:
        cursor.execute(f'SELECT timestamp, close,symbol,open,high,low,volume FROM {table_name} WHERE symbol = ?', (symbol,))
        data = cursor.fetchall()

        if not data:
            return jsonify({"error": "Stock not found"}), 404

        # ✅ Extract data
        dates = [row[0] for row in data]  # Extract only YYYY-MM-DD
        close_prices = [row[1] for row in data]  # Extract close prices
        symbol = [row[2] for row in data]
        open_prices = [row[3] for row in data]
        high_prices = [row[4] for row in data]
        low_prices = [row[5] for row in data]
        volume = [row[6] for row in data]

        return jsonify({"dates": dates, 
        "close_prices": close_prices,
        "open_prices": open_prices,
        "symbol": symbol,
        "high_prices": high_prices,
        "low_prices": low_prices,
        "volume":volume,
        })

    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    finally:
        db.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
