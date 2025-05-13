/* eslint-disable prettier/prettier */
import { SQLiteDatabase, enablePromise, openDatabase } from 'react-native-sqlite-storage';

const databaseName = 'busApp.sqlite';

enablePromise(true);

//import database and creates connection
export const getDBConnection = async () => {
  return openDatabase(
    { name: `${databaseName}`, createFromLocation: `~${databaseName}` },
    openCallback,
    errorCallback,
  );
};

const openCallback = () => {
  console.log('Database opened successfully');
};

const errorCallback = (err: any) => {
  console.log('Error opening the database: ' + err);
};

//User CRUD fucntions
export const getUsers = async (db: SQLiteDatabase): Promise<any[]> => {
  try {
    const users: any[] = [];
    const query = `SELECT * FROM users ORDER BY name`;
    const results = await db.executeSql(query);
    results.forEach(result => {
      result.rows.raw().forEach((item: any) => users.push(item));
    });
    return users;
  } catch (error) {
    console.error(error);
    throw Error('Failed to fetch users!');
  }
};

export const getUserById = async (db: SQLiteDatabase, userId: string): Promise<any> => {
  try {
    const query = `SELECT * FROM users WHERE id = ?`;
    const results = await db.executeSql(query, [userId]);
    const rows = results[0].rows;
    if (rows.length === 0) return null;
    return rows.item(0);
  } catch (error) {
    console.error(error);
    throw Error('Failed to fetch user!');
  }
};

export const createUser = async (
  db: SQLiteDatabase,
  name: string,
  email: string,
  password: string,
  dob: string,
  gender: string,
  phone: string,
) => {
  try {
    const query = `
      INSERT INTO users(name, email, password, dob, gender, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [name, email, password, dob, gender, phone];
    await db.executeSql(query, params);
  } catch (error) {
    console.error(error);
    throw Error('Failed to create user!');
  }
};

export const updateUser = async (
  db: SQLiteDatabase,
  userId: string,
  name: string,
  email: string,
  password: string,
  dob: string,
  gender: string,
  phone: string,
) => {
  try {
    const query = `
      UPDATE users 
      SET name = ?, email = ?, password = ?, dob = ?, gender = ?, phone = ?
      WHERE id = ?
    `;
    const params = [name, email, password, dob, gender, phone, userId];
    await db.executeSql(query, params);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update user!');
  }
};

export const deleteUser = async (db: SQLiteDatabase, userId: string) => {
  try {
    const query = `DELETE FROM users WHERE id = ?`;
    await db.executeSql(query, [userId]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to delete user!');
  }
};

export const updateUserProfileImage = async (db: SQLiteDatabase, userId: string, uri: string) => {
  const updateQuery = `
      UPDATE users
      SET profile_image = ?
      WHERE id = ?;
  `;
  await db.executeSql(updateQuery, [uri, userId]);
};

//Booking CRUD functions
export const getBookingsForUser = async (
  db: SQLiteDatabase,
  userId: string
): Promise<any[]> => {
  try {
    const bookings: any[] = [];

    const query = `
      SELECT b.booking_id, b.user_id, b.route_id, b.no_of_passenger, b.date,
             r.departure, r.destination, r.time, r.price, r.duration
      FROM bookings b
      JOIN routes r ON b.route_id = r.route_id
      WHERE b.user_id = ?
      ORDER BY b.date, r.time;
    `;

    const results = await db.executeSql(query, [userId]);

    results.forEach(result => {
      const rows = result.rows.raw(); // Gets all rows as an array
      bookings.push(...rows);
    });

    return bookings;
  } catch (error) {
    console.error('Error fetching bookings for user:', error);
    throw Error('Failed to fetch bookings for user!');
  }
};

export const getBookingDetailsById = async (db: SQLiteDatabase, bookingId: number): Promise<any> => {
  try {
    const query = `
      SELECT 
        b.*,  
        r.time, 
        r.departure, 
        r.destination,
        r.price,
        r.duration
      FROM bookings b
      JOIN routes r ON b.route_id = r.route_id
      WHERE b.booking_id = ?
    `;
    const results = await db.executeSql(query, [bookingId]);

    if (results[0].rows.length === 0) return null;

    return results[0].rows.item(0);
  } catch (error) {
    console.error(error);
    throw Error('Failed to fetch booking detail with route!');
  }
};


export const createBooking = async (
  db: SQLiteDatabase,
  user_id: number,
  route_id: number,
  no_of_passenger: number,
  date: string
) => {
  try {
    const query = `
      INSERT INTO bookings (user_id, route_id, no_of_passenger, date)
      VALUES (?, ?, ?, ?)
    `;
    await db.executeSql(query, [user_id, route_id, no_of_passenger, date]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to create booking!');
  }
};

export const updateBooking = async (
  db: SQLiteDatabase,
  booking_id: string,
  date: string,
  no_of_passenger: number
) => {
  try {
    const query = `
      UPDATE bookings 
      SET no_of_passenger = ?, date = ?
      WHERE booking_id = ?
    `;
    await db.executeSql(query, [no_of_passenger, date, booking_id]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update booking!');
  }
};

export const deleteBooking = async (db: SQLiteDatabase, bookingId: string) => {
  try {
    const query = `DELETE FROM bookings WHERE booking_id = ?`;
    await db.executeSql(query, [bookingId]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to delete booking!');
  }
};

//Bus Stops function
export const getBusStops = async (db: SQLiteDatabase): Promise<any[]> => {
  try {
    const query = `SELECT * FROM busStops ORDER BY name`;
    const results = await db.executeSql(query);
    return results.flatMap(result => result.rows.raw());
  } catch (error) {
    console.error(error);
    throw Error ('Failed to get bus stops!')
  }
};

//Routes function
export const getRoutes = async (db: SQLiteDatabase): Promise<any[]> => {
  try {
    const query = `SELECT * FROM routes ORDER BY time`;
    const results = await db.executeSql(query);
    return results.flatMap(result => result.rows.raw());
  } catch (error) {
    console.error(error);
    throw Error ('Failed to get routes!')
  }
};