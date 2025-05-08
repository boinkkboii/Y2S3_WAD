/* eslint-disable prettier/prettier */
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { downloadAndUnzipGTFS } from './zipDecompress';

export const getStopsData = async () => {
  try {
    const unzipPath = await downloadAndUnzipGTFS();
    const stopsTxtPath = `${unzipPath}/stops.txt`;
    const fileContent = await RNFS.readFile(stopsTxtPath, 'utf8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    return JSON.stringify(parsed.data, null, 2);
  } catch (error) {
    console.error('Error getting stops.txt:', error);
    throw error;
  }
};
