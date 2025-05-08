# create_db.py

import sqlite3

# Create a new SQLite database (or connect if it already exists)
conn = sqlite3.connect("busApp.sqlite")
cursor = conn.cursor()

# Create users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    phone TEXT
)
''')

# Create bus table
cursor.execute('''
CREATE TABLE IF NOT EXISTS bus (
    car_plate TEXT PRIMARY KEY,
    driver_name TEXT NOT NULL,
    star_rating REAL,
    rating_num INTEGER,
    no_of_seat INTEGER,
    bus_type TEXT
)
''')

# Create bus_schedule table
cursor.execute('''
CREATE TABLE IF NOT EXISTS bus_schedule (
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_plate TEXT NOT NULL,
    from_location TEXT,
    to_location TEXT,
    date TEXT,
    time TEXT,
    FOREIGN KEY (car_plate) REFERENCES bus(car_plate)
)
''')

# Create booking table
cursor.execute('''
CREATE TABLE IF NOT EXISTS booking (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    schedule_id INTEGER,
    no_of_passenger INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (schedule_id) REFERENCES bus_schedule(schedule_id)
)
''')

# Insert test data
cursor.execute("INSERT INTO users (name, email, password, dob, gender, phone) VALUES (?, ?, ?, ?, ?, ?)", 
               ("test", "test@example.com", "test", "1990-01-01", "Female", "123456789"))
cursor.execute("INSERT INTO users (name, email, password, dob, gender, phone) VALUES (?, ?, ?, ?, ?, ?)", 
               ("pp", "pp@example.com", "pp", "1985-05-20", "Male", "987654321"))

cursor.execute("INSERT INTO bus (car_plate, driver_name, star_rating, rating_num, no_of_seat, bus_type) VALUES (?, ?, ?, ?, ?, ?)",
               ("JKB1234", "John Driver", 4.5, 30, 40, "Express"))
cursor.execute("INSERT INTO bus (car_plate, driver_name, star_rating, rating_num, no_of_seat, bus_type) VALUES (?, ?, ?, ?, ?, ?)",
               ("KKK5678", "Sarah Wheels", 4.8, 50, 30, "Luxury"))

cursor.execute("INSERT INTO bus_schedule (car_plate, from_location, to_location, date, time) VALUES (?, ?, ?, ?, ?)",
               ("JKB1234", "Pellon Sta", "KKKL", "2025-06-01", "08:00"))
cursor.execute("INSERT INTO bus_schedule (car_plate, from_location, to_location, date, time) VALUES (?, ?, ?, ?, ?)",
               ("KKK5678", "KKKL", "Pellon Sta", "2025-06-02", "15:00"))
cursor.execute("INSERT INTO bus_schedule (car_plate, from_location, to_location, date, time) VALUES (?, ?, ?, ?, ?)",
               ("JKB1234", "a", "KKKL", "2025-06-01", "08:00"))
cursor.execute("INSERT INTO bus_schedule (car_plate, from_location, to_location, date, time) VALUES (?, ?, ?, ?, ?)",
               ("KKK5678", "b", "Pellon Sta", "2025-06-02", "15:00"))
cursor.execute("INSERT INTO bus_schedule (car_plate, from_location, to_location, date, time) VALUES (?, ?, ?, ?, ?)",
               ("JKB1234", "c", "KKKL", "2025-06-01", "08:00"))
cursor.execute("INSERT INTO bus_schedule (car_plate, from_location, to_location, date, time) VALUES (?, ?, ?, ?, ?)",
               ("KKK5678", "d", "Pellon Sta", "2025-06-02", "15:00"))

cursor.execute("INSERT INTO booking (user_id, schedule_id, no_of_passenger) VALUES (?, ?, ?)",
               (1, 1, 2))
cursor.execute("INSERT INTO booking (user_id, schedule_id, no_of_passenger) VALUES (?, ?, ?)",
               (2, 2, 1))

# Commit and close
conn.commit()
conn.close()

print("Database created successfully.")
