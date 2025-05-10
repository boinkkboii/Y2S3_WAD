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
    return results[0].rows.item(0);
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
export const getBookings = async (db: SQLiteDatabase): Promise<any[]> => {
  try {
    const bookings: any[] = [];
    const query = `SELECT * FROM booking ORDER BY booking_id`;
    const results = await db.executeSql(query);
    results.forEach(result => {
      result.rows.raw().forEach((item: any) => bookings.push(item));
    });
    return bookings;
  } catch (error) {
    console.error(error);
    throw Error('Failed to fetch bookings!');
  }
};


export const getBookingsForUser = async (
  db: SQLiteDatabase,
  userId: string
): Promise<any[]> => {
  try {
    const bookings: any[] = [];

    const query = `
      SELECT * FROM booking
      WHERE user_id = ?
      ORDER BY date, time;
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

export const getBookingDetailsById = async (db: SQLiteDatabase, bookingId: number) => {
  try {
    const results = await db.executeSql('SELECT * FROM booking WHERE booking_id = ?', [bookingId]);
    const item = results[0].rows.item(0);
    return item;
  } catch (error) {
    console.error(error);
    throw Error('Failed to fetch booking detail!');
  }
};

export const createBooking = async (
  db: SQLiteDatabase,
  userId: number,
  scheduleId: number,
  noOfPassenger: number
) => {
  try {
    const query = `
      INSERT INTO booking(user_id, schedule_id, no_of_passenger)
      VALUES (?, ?, ?)
    `;
    await db.executeSql(query, [userId, scheduleId, noOfPassenger]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to create booking!');
  }
};

export const updateBooking = async (
  db: SQLiteDatabase,
  bookingId: string,
  userId: number,
  scheduleId: number,
  noOfPassenger: number
) => {
  try {
    const query = `
      UPDATE booking 
      SET user_id = ?, schedule_id = ?, no_of_passenger = ?
      WHERE booking_id = ?
    `;
    await db.executeSql(query, [userId, scheduleId, noOfPassenger, bookingId]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update booking!');
  }
};

export const deleteBooking = async (db: SQLiteDatabase, bookingId: string) => {
  try {
    const query = `DELETE FROM booking WHERE booking_id = ?`;
    await db.executeSql(query, [bookingId]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to delete booking!');
  }
};