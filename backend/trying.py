import yfinance as yf
import pandas as pd

symbol = "GOOGL"

# Fetch stock data for the last 60 days with 5-minute intervals
df = yf.download(symbol, period="60d", interval="5m")

# Print the first few rows
print("\n🔍 DEBUG: Raw DataFrame from yfinance (first 5 rows):")
print(df.head())

# Print column names
print("\n🔍 DEBUG: DataFrame Columns:", df.columns)

# Print raw index values
print("\n🔍 DEBUG: Raw Index (first 10 rows):")
print(df.index[:10])
