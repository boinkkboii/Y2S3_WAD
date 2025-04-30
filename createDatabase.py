import sqlite3

# Use same DB as the API
db = sqlite3.connect('myprofile.sqlite')

# Drop table if exists
db.execute('DROP TABLE IF EXISTS user_profile')

# Create the user_profile table matching the Flask API
db.execute('''
    CREATE TABLE user_profile (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        dob TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        profile_image TEXT NOT NULL
    )
''')

# Insert John Doe's profile
cursor = db.cursor()

cursor.execute('''
    INSERT INTO user_profile(name, dob, phone, email, profile_image)
    VALUES (?, ?, ?, ?, ?)
''', (
    'John',
    '1990-01-01',
    '+1234567890',
    'johndoe@example.com',
    '/images/profile/johndoe.png'  # or any placeholder path
))

db.commit()
db.close()
