# create_db.py

import sqlite3

# Create a new SQLite database (or connect if it already exists)
conn = sqlite3.connect("busApp.sqlite")
cursor = conn.cursor()

# Drop table if exists
cursor.execute('DROP TABLE IF EXISTS users')
cursor.execute('DROP TABLE IF EXISTS bookings')
cursor.execute('DROP TABLE IF EXISTS busStops')
cursor.execute('DROP TABLE IF EXISTS routes')

# Create users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    phone TEXT,
    profile_image TEXT
)
''')

# Create bookings table
cursor.execute('''
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    route_id INTEGER,
    date TEXT,
    no_of_passenger INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id)
)
''')

# Create bus stops table
cursor.execute('''
CREATE TABLE IF NOT EXISTS busStops (
    stop_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
''')

# Create routes table
cursor.execute('''
CREATE TABLE IF NOT EXISTS routes (
    route_id INTEGER PRIMARY KEY AUTOINCREMENT,
    departure TEXT NOT NULL,
    destination TEXT NOT NULL,
    time INTEGER,
    price INTEGER,
    duration INTEGER
)
''')

# Insert test data
#Sample users
cursor.execute("INSERT INTO users (name, email, password, dob, gender, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)", 
               ("test", "test@gmail.com", "test", "1990-01-01", "Female", "123456789", ""))
cursor.execute("INSERT INTO users (name, email, password, dob, gender, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)", 
               ("pp", "pp@gmail.com", "pp", "1985-05-20", "Male", "987654321", ""))

#Sample bus stops
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Grand Paragon Hotel",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Opp Menara TH",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("SMK Munshi Abdullah Kulai",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Kampung Baru Masai",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("JB Sentral",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Opp Vista Seri Alam",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Maybank Bandar Seri Alam",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Wisma Peladang",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Opp Taman Putri Persiaran Sri Putri 3(1)",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Terminal Bas Masai",))

# Sample routes
# 2 for each route to have different times
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Grand Paragon Hotel", "Opp Menara TH", 800, 30, 25))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Opp Menara TH", "SMK Munshi Abdullah Kulai", 825, 40, 35))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("SMK Munshi Abdullah Kulai", "Kampung Baru Masai", 900, 30, 25))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Kampung Baru Masai", "JB Sentral", 925, 50, 45))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("JB Sentral", "Opp Vista Seri Alam", 1010, 30, 25))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Opp Vista Seri Alam", "Maybank Bandar Seri Alam", 1035, 30, 25))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Maybank Bandar Seri Alam", "Wisma Peladang", 1100, 40, 35))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Wisma Peladang", "Opp Taman Putri Persiaran Sri Putri 3(1)", 1135, 50, 45))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Opp Taman Putri Persiaran Sri Putri 3(1)", "Terminal Bas Masai", 1220, 60, 55))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Grand Paragon Hotel", "Opp Menara TH", 1000, 30, 25))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Opp Menara TH", "SMK Munshi Abdullah Kulai", 1025, 40, 35))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("SMK Munshi Abdullah Kulai", "Kampung Baru Masai", 1100, 30, 25))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Kampung Baru Masai", "JB Sentral", 1125, 50, 45))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("JB Sentral", "Opp Vista Seri Alam", 1210, 30, 25))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Opp Vista Seri Alam", "Maybank Bandar Seri Alam", 1235, 30, 25))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Maybank Bandar Seri Alam", "Wisma Peladang", 1300, 40, 35))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Wisma Peladang", "Opp Taman Putri Persiaran Sri Putri 3(1)", 1335, 50, 45))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Opp Taman Putri Persiaran Sri Putri 3(1)", "Terminal Bas Masai", 1420, 60, 55))
# Return trips
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("JB Sentral", "Kampung Baru Masai", 1500, 50, 45))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Wisma Peladang", "Maybank Bandar Seri Alam", 1530, 40, 35))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Terminal Bas Masai", "Opp Taman Putri Persiaran Sri Putri 3(1)", 1600, 60, 55))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("SMK Munshi Abdullah Kulai", "Opp Menara TH", 1630, 40, 35))
cursor.execute("INSERT INTO routes (departure, destination, time, price, duration) VALUES (?, ?, ?, ?, ?)", ("Maybank Bandar Seri Alam", "Opp Vista Seri Alam", 1700, 30, 25))


# Sample bookings
cursor.execute("INSERT INTO bookings (user_id, route_id, date, no_of_passenger) VALUES (?, ?, ?, ?)", (1, 1, "2025-03-23", 2))
cursor.execute("INSERT INTO bookings (user_id, route_id, date, no_of_passenger) VALUES (?, ?, ?, ?)", (2, 2, "2025-05-17", 1))
cursor.execute("INSERT INTO bookings (user_id, route_id, date, no_of_passenger) VALUES (?, ?, ?, ?)", (1, 3, "2025-11-04", 3))
cursor.execute("INSERT INTO bookings (user_id, route_id, date, no_of_passenger) VALUES (?, ?, ?, ?)", (2, 4, "2025-08-31", 2))
cursor.execute("INSERT INTO bookings (user_id, route_id, date, no_of_passenger) VALUES (?, ?, ?, ?)", (1, 5, "2025-06-09", 1))

# Commit and close
conn.commit()
conn.close()

print("Database created successfully.")
