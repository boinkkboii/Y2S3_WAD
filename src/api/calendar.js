/* eslint-disable prettier/prettier */
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { downloadAndUnzipGTFS } from './routes';

export const getCalendarData = async () => {
  try {
    const unzipPath = await downloadAndUnzipGTFS();
    const calendarTxtPath = `${unzipPath}/calendar.txt`;
    const fileContent = await RNFS.readFile(calendarTxtPath, 'utf8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    return JSON.stringify(parsed.data, null, 2);
  } catch (error) {
    console.error('Error getting calendar.txt:', error);
    throw error;
  }
};
