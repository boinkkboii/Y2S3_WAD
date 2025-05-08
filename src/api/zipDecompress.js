/* eslint-disable prettier/prettier */
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';

const ZIP_URL = 'https://api.data.gov.my/gtfs-static/mybas-johor';
const ZIP_PATH = `${RNFS.DocumentDirectoryPath}/gtfs.zip`;
const UNZIP_PATH = `${RNFS.DocumentDirectoryPath}/gtfs`;

export const downloadAndUnzipGTFS = async () => {
  try {
    // Skip downloading if already unzipped
    const alreadyExists = await RNFS.exists(`${UNZIP_PATH}/agency.txt`);
    if (alreadyExists) {
      return UNZIP_PATH;
    }

    // Download the GTFS ZIP file
    const download = await RNFS.downloadFile({
      fromUrl: ZIP_URL,
      toFile: ZIP_PATH,
    }).promise;

    if (download.statusCode !== 200) {
      throw new Error(`GTFS download failed with status ${download.statusCode}`);
    }

    // Ensure the target unzip directory is clean
    const dirExists = await RNFS.exists(UNZIP_PATH);
    if (dirExists) {
      await RNFS.unlink(UNZIP_PATH); // clean up old
    }

    // Unzip the downloaded GTFS ZIP file
    await unzip(ZIP_PATH, UNZIP_PATH);

    return UNZIP_PATH;
  } catch (error) {
    console.error('Error downloading/unzipping GTFS:', error);
    throw error;
  }
};
