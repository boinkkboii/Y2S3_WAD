import { SQLiteDatabase, enablePromise, openDatabase } from "react-native-sqlite-storage";

enablePromise(true);

const dbName = 'myprofile.sqlite';

const callBackSuccess = () => {
    console.log("DB opened successfully");
};

const callBackFail = (error: any) => {
    console.log("Failed to open DB", error);
};

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
    return openDatabase({ name: dbName, location: 'default' }, callBackSuccess, callBackFail);
};

// Create the user_profile table
export const createUserTable = async (db: SQLiteDatabase) => {
    const query = `
    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      dob TEXT,
      phone TEXT,
      email TEXT,
      profile_image TEXT
    );
  `;
    await db.executeSql(query);
};

// Get user profile (assume only one profile stored)
export const getUserProfile = async (db: SQLiteDatabase) => {
    const results = await db.executeSql('SELECT * FROM user_profile LIMIT 1');
    if (results[0].rows.length > 0) {
        return results[0].rows.item(0);
    }
    return null;
};

// Insert profile
export const insertUserProfile = async (
    db: SQLiteDatabase,
    name: string,
    dob: string,
    phone: string,
    email: string,
    profile_image: string
) => {
    const insertQuery = `
    INSERT INTO user_profile (name, dob, phone, email, profile_image)
    VALUES (?, ?, ?, ?, ?);
  `;
    await db.executeSql(insertQuery, [name, dob, phone, email, profile_image]);
};

// Update profile
export const updateUserProfile = async (
    db: SQLiteDatabase,
    id: number,
    name: string,
    dob: string,
    phone: string,
    email: string,
    profile_image: string
) => {
    const updateQuery = `
    UPDATE user_profile 
    SET name = ?, dob = ?, phone = ?, email = ?, profile_image = ?
    WHERE id = ?;
  `;
    await db.executeSql(updateQuery, [name, dob, phone, email, profile_image, id]);
};

// Delete profile
export const deleteUserProfile = async (db: SQLiteDatabase, id: number) => {
    const deleteQuery = `DELETE FROM user_profile WHERE id = ?`;
    await db.executeSql(deleteQuery, [id]);
};
