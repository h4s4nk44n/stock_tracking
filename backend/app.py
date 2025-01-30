from flask import Flask, jsonify
import sqlite3
import yfinance as yf
import pandas as pd
import numpy as np  # Import NumPy for NaN handling

app = Flask(__name__)

@app.route('/')
def home():
    """Fetch stock data, store it, and return the latest records"""
    fetch_result = fetch_and_store_stock(SYMBOL)  # Fetch and store data
    latest_data = get_stock_data(SYMBOL)  # Retrieve stored data

    return jsonify({
        "fetch_status": fetch_result,
        "latest_data": latest_data
    })

if __name__ == '__main__':
    # Initialize DB before running the Flask app
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
