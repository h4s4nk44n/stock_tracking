from flask import Flask, jsonify, request
import sqlite3
import yfinance as yf
import pandas as pd
import numpy as np  # Import NumPy for NaN handling
from flask_cors import CORS

DATABASE = "database.db"

def get_db():
    db = sqlite3.connect(DATABASE)
    return db
    
app = Flask(__name__)
CORS(app)

@app.route('/stocks/<symbol>')
def get_stock(symbol):
    symbol = symbol.upper()
    interval = request.args.get("interval", "1d")  # Default to "1d" if not provided

    db = get_db()
    cursor = db.cursor()

    # ✅ Choose table based on the selected interval
    if interval == "1d":
        table_name = "stock_data_daily"  # Today's data
    elif interval == "1w":
        table_name = "stock_data_weekly"
    elif interval == "1m":
        table_name = "stock_data_monthly"    
    elif interval == "1y":
        table_name = "stock_data_year" 
    elif interval == "10y":
        table_name = "stock_data_10years"  # 10 years data
    else:
        return jsonify({"error": "Invalid interval"}), 400  # Return an error if interval is not recognized

    try:
        cursor.execute(f'SELECT timestamp, close FROM {table_name} WHERE symbol = ?', (symbol,))
        data = cursor.fetchall()

        if not data:
            return jsonify({"error": "Stock not found"}), 404

        # ✅ Extract data
        dates = [row[0].split()[0] for row in data]  # Extract only YYYY-MM-DD
        close_prices = [row[1] for row in data]  # Extract close prices

        return jsonify({"dates": dates, "close_prices": close_prices})

    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    finally:
        db.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
