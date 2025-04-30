import { SQLiteDatabase, enablePromise, openDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

const dbName = 'profile.sqlite';

// Open the database from assets
export const openProfileDB = async (): Promise<SQLiteDatabase> => {
  try {
    console.log('Opening database...');
    const db = await openDatabase({
      name: dbName,
      createFromLocation: `~${dbName}`, // Load pre-populated DB
    });
    console.log('Database opened');
    return db;
  } catch (error) {
    console.error('Error opening profile.sqlite:', error);
    throw error;
  }
};

export const getUserProfile = async (db: SQLiteDatabase) => {
  try {
    console.log('Executing SQL to fetch user...');
    const results = await db.executeSql('SELECT * FROM users LIMIT 1');
    console.log('SQL executed:', results);

    if (results[0].rows.length > 0) {
      const user = results[0].rows.item(0);
      console.log('User found:', user);
      return user;
    } else {
      console.log('No user found');
      return null;
    }
  } catch (error) {
    console.error('Error querying user table:', error);
    throw error;
  }
};
