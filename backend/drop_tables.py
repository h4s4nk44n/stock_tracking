import sqlite3

DATABASE = "database.db"

def drop_stock_data_tables():
    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()

    # Find all tables starting with 'stock_data_'
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'stock_data_%';")
    tables = cursor.fetchall()

    if not tables:
        print("✅ No stock_data tables found.")
        return

    # Drop each table
    for table in tables:
        table_name = table[0]
        print(f"🗑 Dropping table: {table_name}...")
        cursor.execute(f"DROP TABLE IF EXISTS {table_name}")

    db.commit()
    db.close()
    print("✅ All `stock_data_` tables deleted successfully.")

# Run the function
drop_stock_data_tables()
