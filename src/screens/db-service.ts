import { SQLiteDatabase, enablePromise, openDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

const dbName = 'myprofile.sqlite';

const callBackSuccess = () => {
    console.log("DB opened successfully");
};

const callBackFail = (error: any) => {
    console.log("Failed to open DB", error);
};

export const getDBConnection = async () => {
    return openDatabase(
        { name: dbName, location: 'default', createFromLocation: `~${dbName}` },
        callBackSuccess,
        callBackFail
    );
};

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

export const getUserProfile = async (db: SQLiteDatabase) => {
    const query = 'SELECT * FROM user_profile LIMIT 1';
    const results = await db.executeSql(query);

    if (results[0].rows.length > 0) {
        return results[0].rows.item(0);
    }

    return null;
};

export const upsertUserProfile = async (
    db: SQLiteDatabase,
    name: string,
    dob: string,
    phone: string,
    email: string,
    profile_image: 'default',
) => {
    const existingProfile = await getUserProfile(db);

    if (existingProfile) {
        const id = existingProfile.id; // Assume only one profile exists
        const updateQuery = `
        UPDATE user_profile
        SET name = ?, dob = ?, phone = ?, email = ?, profile_image = ?
        WHERE id = ?;
    `;
        await db.executeSql(updateQuery, [name, dob, phone, email, profile_image, id]);
        console.log('User profile updated.');
    } else {
        const insertQuery = `
        INSERT INTO user_profile (name, dob, phone, email, profile_image)
        VALUES (?, ?, ?, ?, ?);
    `;
        await db.executeSql(insertQuery, [name, dob, phone, email, profile_image]);
        console.log('User profile inserted.');
    }
};

export const updateUserProfileImage = async (db, uri) => {
    const updateQuery = `
        UPDATE user_profile
        SET profile_image = ?
        WHERE id = 1;
    `;
    await db.executeSql(updateQuery, [uri]);
};





