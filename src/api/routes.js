/* eslint-disable prettier/prettier */
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { downloadAndUnzipGTFS } from './zipDecompress';

export const getRoutesData = async () => {
  try{ 
    const unzipPath = await downloadAndUnzipGTFS();
    const routesTxtPath = `${unzipPath}/routes.txt`;
    const fileContent = await RNFS.readFile(routesTxtPath, 'utf8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    return JSON.stringify(parsed.data, null, 2);
  } catch (error) {
    console.error('Error getting routes.txt:', error);
    throw error;
  }
};