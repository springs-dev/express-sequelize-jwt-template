import fs from 'node:fs';

import { UPLOAD_UI_PATH, UPLOAD_SERVER_PATH, BACKEND_BASE_URL } from '#src/configs/constants.js';

/**
 * @param {string} uiPath - The UI path to convert.
 * @returns {string} - The converted server path.
 */
export const convertUiPathToServerPath = (uiPath) =>
  uiPath.replace(UPLOAD_UI_PATH, UPLOAD_SERVER_PATH);

/**
 * @param {string} serverPath - The server path to convert.
 * @returns {string} - The converted UI path.
 */
export const convertServerPathToUiPath = (serverPath) =>
  serverPath.replace(UPLOAD_SERVER_PATH, UPLOAD_UI_PATH);

/**
 *
 * @param {string} filePath
 * @return {string|null}
 */
export const convertServerPathToWebUrl = (filePath) =>
  filePath ? `${BACKEND_BASE_URL}${convertServerPathToUiPath(filePath)}` : null;

/**
 * @param {string} uiPath - The UI path of the file to remove.
 * @returns {Promise<void>} - A promise that resolves when the file has been removed, or if there was no file to remove.
 */
export const removeUploadIfExists = async (uiPath) => {
  if (!uiPath) return;

  try {
    const serverPath = convertUiPathToServerPath(uiPath);
    await fs.promises.access(serverPath, fs.constants.F_OK);
    await fs.promises.unlink(serverPath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
};
