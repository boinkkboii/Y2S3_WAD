import sqlite3

# Connect to or create the SQLite database file
db = sqlite3.connect('profile.sqlite')

# Drop the table if it already exists
db.execute('DROP TABLE IF EXISTS users')

# Create the users table
db.execute('''
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        dob TEXT NOT NULL,
        email TEXT NOT NULL,
        phone_number TEXT NOT NULL
    )
''')

# Insert sample data into the users table
cursor = db.cursor()

cursor.execute('''
    INSERT INTO users(name,dob,email,phone_number)
    VALUES('Chia Kim Hooi', '1995-04-21', 'chiakh@duckmail.com', '012-3456789')
''')

cursor.execute('''
    INSERT INTO users(name,dob,email,phone_number)
    VALUES('Foo Yoke Wai', '1994-09-11', 'fooyw@roostermail.com', '013-9876543')
''')

cursor.execute('''
    INSERT INTO users(name,dob,email,phone_number)
    VALUES('Ng Pei Li', '1996-01-30', 'ngpl@catmail.com', '016-4567890')
''')

cursor.execute('''
    INSERT INTO users(name,dob,email,phone_number)
    VALUES('Lim Li Li', '1993-12-15', 'limll@koalamail.com', '011-1122334')
''')

cursor.execute('''
    INSERT INTO users(name,dob,email,phone_number)
    VALUES('Mok Sook Chen', '1992-06-09', 'moksc@dogmail.com', '017-9988776')
''')

# Commit changes to the database
db.commit()

# Close the database connection
db.close()

print("Database 'profile.sqlite' created and populated successfully.")
