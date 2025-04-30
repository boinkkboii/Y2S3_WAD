/* eslint-disable prettier/prettier */
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { downloadAndUnzipGTFS } from './routes';

export const getAgencyData = async () => {
  try {
    const unzipPath = await downloadAndUnzipGTFS();
    const agencyTxtPath = `${unzipPath}/agency.txt`;
    const fileContent = await RNFS.readFile(agencyTxtPath, 'utf8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    return JSON.stringify(parsed.data, null, 2);
  } catch (error) {
    console.error('Error getting agency.txt:', error);
    throw error;
  }
};
