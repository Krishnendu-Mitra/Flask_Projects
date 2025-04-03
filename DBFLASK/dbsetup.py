import sqlite3

def create_DB(name):
    # Connect to DB
    conn = sqlite3.connect(name)
    cursor = conn.cursor()

    # Create Student table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Student (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        marks INTEGER,
        class INTEGER
    )
    ''')
    # Cleaner past history
    cursor.execute("DELETE FROM Student WHERE 1=1")
    # Insert sample data
    cursor.execute("INSERT INTO Student (name, marks, class) VALUES ('Krish', 85, 6)")
    cursor.execute("INSERT INTO Student (name, marks, class) VALUES ('Souvik', 92, 6)")
    cursor.execute("INSERT INTO Student (name, marks, class) VALUES ('Elon', 78, 5)")
    cursor.execute("INSERT INTO Student (name, marks, class) VALUES ('Sanchita', 47, 8)")
    cursor.execute("INSERT INTO Student (name, marks, class) VALUES ('Ayus', 80, 7)")

    conn.commit()
    conn.close()

    print(f"{name} Database setup complete!")
