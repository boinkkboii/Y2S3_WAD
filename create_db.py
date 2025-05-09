# create_db.py

import sqlite3

# Create a new SQLite database (or connect if it already exists)
conn = sqlite3.connect("busApp.sqlite")
cursor = conn.cursor()

# Drop table if exists
cursor.execute('DROP TABLE IF EXISTS users')
cursor.execute('DROP TABLE IF EXISTS booking')
cursor.execute('DROP TABLE IF EXISTS busStops')

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

# Create booking table
cursor.execute('''
CREATE TABLE IF NOT EXISTS booking (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    departure TEXT,
    destination TEXT,
    date TEXT,
    time INTEGER,
    no_of_passenger INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
''')

# Create bus stops table
cursor.execute('''
CREATE TABLE IF NOT EXISTS busStops (
    stop_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
''')

# Insert test data
cursor.execute("INSERT INTO users (name, email, password, dob, gender, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)", 
               ("test", "test@gmail.com", "test", "1990-01-01", "Female", "123456789", "../img/profile.png"))
cursor.execute("INSERT INTO users (name, email, password, dob, gender, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)", 
               ("pp", "pp@gmail.com", "pp", "1985-05-20", "Male", "987654321", "../img/profile.png"))

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

cursor.execute('''
INSERT INTO booking (user_id, departure, destination, date, time, no_of_passenger)
VALUES (?, ?, ?, ?, ?, ?)
''', (1, 'JB Sentral', 'Grand Paragon Hotel', '2025-05-15', 900, 2))
cursor.execute('''
INSERT INTO booking (user_id, departure, destination, date, time, no_of_passenger)
VALUES (?, ?, ?, ?, ?, ?)
''', (2, 'Terminal Kulai', 'KSL City', '2025-05-18', 1100, 1))
cursor.execute('''
INSERT INTO booking (user_id, departure, destination, date, time, no_of_passenger)
VALUES (?, ?, ?, ?, ?, ?)
''', (1, 'Regency Specialist Hospital', 'Opp Wisma Persekutuan', '2025-05-20', 1430, 3))
cursor.execute('''
INSERT INTO booking (user_id, departure, destination, date, time, no_of_passenger)
VALUES (?, ?, ?, ?, ?, ?)
''', (2, 'Pusat Latihan JPJ', 'Taman Kota Kulai', '2025-05-22', 830, 4))
cursor.execute('''
INSERT INTO booking (user_id, departure, destination, date, time, no_of_passenger)
VALUES (?, ?, ?, ?, ?, ?)
''', (1, 'Opp Holiday Plaza', 'Maybank Bandar Seri Alam', '2025-05-25', 1015, 1))

# Commit and close
conn.commit()
conn.close()

print("Database created successfully.")
