/* eslint-disable prettier/prettier */
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Papa from 'papaparse';

const ZIP_URL = 'https://api.data.gov.my/gtfs-static/mybas-johor';

export const downloadAndUnzipGTFS = async () => {
  try {
    const zipPath = `${RNFS.DocumentDirectoryPath}/gtfs.zip`;
    const unzipPath = `${RNFS.DocumentDirectoryPath}/gtfs`;

    // Download GTFS ZIP
    const download = await RNFS.downloadFile({
      fromUrl: ZIP_URL,
      toFile: zipPath,
    }).promise;

    if (download.statusCode !== 200) {
      throw new Error('GTFS download failed');
    }

    // Unzip the GTFS
    await unzip(zipPath, unzipPath);
    return unzipPath;
  } catch (error) {
    console.error('Error downloading/unzipping GTFS:', error);
    throw error;
  }
};

export const getRoutesData = async () => {
  const unzipPath = await downloadAndUnzipGTFS();
  const routesTxtPath = `${unzipPath}/routes.txt`;
  const fileContent = await RNFS.readFile(routesTxtPath, 'utf8');
  const parsed = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });
  return JSON.stringify(parsed.data, null, 2);
};
