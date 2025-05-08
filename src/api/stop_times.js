/* eslint-disable prettier/prettier */
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { downloadAndUnzipGTFS } from './zipDecompress';

export const getStopTimesData = async () => {
  try {
    const unzipPath = await downloadAndUnzipGTFS();
    const stopTimesTxtPath = `${unzipPath}/stop_times.txt`;
    const fileContent = await RNFS.readFile(stopTimesTxtPath, 'utf8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    return JSON.stringify(parsed.data, null, 2);
  } catch (error) {
    console.error('Error getting stop_times.txt:', error);
    throw error;
  }
};
