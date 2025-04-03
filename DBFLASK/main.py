from flask import Flask, request, jsonify
from flask_cors import CORS
import dbsetup
import sqlite3

app = Flask(__name__)
CORS(app) 

@app.route('/')
def read_root():
    return "Welcome to DBFlask API, Please visit docs for more info..."

@app.route('/query', methods=['POST'])
def execute_query():
    try:
        data = request.json
        sql_query = data.get("sql")
        
        if not sql_query:
            return jsonify({"error": "No query provided"}), 400
        
        # create db
        dbsetup.create_DB("my_database.db")

        # Connect to the SQLite database
        conn = sqlite3.connect("my_database.db")
        cursor = conn.cursor()

        # Execute the SQL query
        cursor.execute(sql_query)
        result = cursor.fetchall()  # Fetch data

        # Get column names
        columns = [desc[0] for desc in cursor.description]

        # Convert result to list of dictionaries
        data = [dict(zip(columns, row)) for row in result]

        conn.close()  # Close connection
        return jsonify({"success": True, "data": data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['POST'])
def test():
    data = request.json
    sql_query = data.get("sql")
    print(data, sql_query)
    return {"mean": 0}

if __name__ == "__main__":
    app.run(debug=True, port=9000)
