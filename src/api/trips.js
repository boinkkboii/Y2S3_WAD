/* eslint-disable prettier/prettier */
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { downloadAndUnzipGTFS } from './zipDecompress';

export const getTripsData = async () => {
  try {
    const unzipPath = await downloadAndUnzipGTFS();
    const tripsTxtPath = `${unzipPath}/trips.txt`;
    const fileContent = await RNFS.readFile(tripsTxtPath, 'utf8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    return JSON.stringify(parsed.data, null, 2);
  } catch (error) {
    console.error('Error getting trips.txt:', error);
    throw error;
  }
};
