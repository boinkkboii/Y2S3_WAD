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
    date TEXT,
    time INTEGER,
    price INTEGER,
    duration INTEGER
)
''')

# Insert test data
#Sample users
cursor.execute("INSERT INTO users (name, email, password, dob, gender, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)", 
               ("test", "test@gmail.com", "test", "1990-01-01", "Female", "123456789", "../img/profile.png"))
cursor.execute("INSERT INTO users (name, email, password, dob, gender, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)", 
               ("pp", "pp@gmail.com", "pp", "1985-05-20", "Male", "987654321", "../img/profile.png"))

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
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("JNT Taman Masai Utama",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Shell Kulai",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("SK Seri Alam 2",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Danga City Mall",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Stadium Kulai",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Wisma Persekutuan",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Opp Johor Tourist Information Center",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Opp Sekolah Kebangsaan IJ Convent",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Pangsapuri Sri Ilham",))
cursor.execute("INSERT INTO busStops (name) VALUES (?)", ("Terminal Kulai",))

# Sample routes
cursor.execute("INSERT INTO routes (departure, destination, date, time, price, duration) VALUES (?, ?, ?, ?, ?, ?)", ("Grand Paragon Hotel", "JB Sentral", "2025-05-10", 830, 3, 30))
cursor.execute("INSERT INTO routes (departure, destination, date, time, price, duration) VALUES (?, ?, ?, ?, ?, ?)", ("Opp Menara TH", "Terminal Kulai", "2025-05-11", 900, 4, 45))
cursor.execute("INSERT INTO routes (departure, destination, date, time, price, duration) VALUES (?, ?, ?, ?, ?, ?)", ("Wisma Peladang", "Opp Vista Seri Alam", "2025-05-12", 1030, 2, 25))
cursor.execute("INSERT INTO routes (departure, destination, date, time, price, duration) VALUES (?, ?, ?, ?, ?, ?)", ("Danga City Mall", "Kampung Baru Masai", "2025-05-13", 745, 3, 35))
cursor.execute("INSERT INTO routes (departure, destination, date, time, price, duration) VALUES (?, ?, ?, ?, ?, ?)", ("Shell Kulai", "Opp Sekolah Kebangsaan IJ Convent", "2025-05-14", 1630, 5, 50))


# Sample bookings
cursor.execute("INSERT INTO bookings (user_id, route_id, no_of_passenger) VALUES (?, ?, ?)", (1, 1, 2))
cursor.execute("INSERT INTO bookings (user_id, route_id, no_of_passenger) VALUES (?, ?, ?)", (2, 2, 1))
cursor.execute("INSERT INTO bookings (user_id, route_id, no_of_passenger) VALUES (?, ?, ?)", (1, 3, 3))
cursor.execute("INSERT INTO bookings (user_id, route_id, no_of_passenger) VALUES (?, ?, ?)", (2, 4, 2))
cursor.execute("INSERT INTO bookings (user_id, route_id, no_of_passenger) VALUES (?, ?, ?)", (1, 5, 1))

# Commit and close
conn.commit()
conn.close()

print("Database created successfully.")
