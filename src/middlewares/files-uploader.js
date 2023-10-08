import path from 'node:path';

import CreateError from 'http-errors';
import _ from 'lodash-es';
import multer from 'multer';

import { UPLOAD_SERVER_PATH } from '#src/configs/constants.js';
import { generateRandomString } from '#src/utils/common.js';

/**
 * Creates a file filter for validating MIME types.
 * @param {string[]} mimetypes - List of allowed MIME types.
 * @returns {function(*, *, *): void}
 */
const createFileFilter = (mimetypes) => (req, file, cb) => {
  if (mimetypes.length && !mimetypes.includes(file.mimetype)) {
    cb(
      new CreateError(400, 'File type is not allowed', {
        key: 'error.file-type-is-not-allowed',
      }),
      false,
    );
  } else {
    cb(null, true);
  }
};

/**
 * Creates a file uploader based on provided parameters.
 * @param {import('multer').StorageEngine} storage - Storage configuration for uploads.
 * @param {string[]} mimetypes - List of allowed MIME types.
 * @param {number|null} maxCount - Maximum number of files allowed for upload.
 * @returns {import('multer').Multer|multer.Instance} Returns an instance of Multer.
 */
const createFileUploader = (storage, mimetypes, maxCount) => {
  const fileFilter = createFileFilter(mimetypes);
  if (!_.isNil(maxCount) && !_.isNumber(maxCount)) {
    return multer({ storage, fileFilter }).array('files', maxCount);
  }
  return multer({ storage, fileFilter }).single('file');
};

/**
 * Creates multer upload middlewares that can be customized per route.
 * @param {string} destinationPath - The path where files will be saved.
 * @returns {object} Object containing middlewares for single and multiple file uploads.
 * @example
 * app.post('/upload', singleFileUploader(['image/jpeg']), (req, res) => {});
 * app.post('/multiple', multipleFilesUploader(['image/jpeg', 'video/mp4'], 5), (req, res) => {});
 */
const createUploader = (destinationPath) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      cb(null, `${generateRandomString(30)}${fileExtension}`);
    },
  });

  return {
    singleFileUploader: (mimetypes = []) => createFileUploader(storage, mimetypes),
    // eslint-disable-next-line default-param-last
    multipleFilesUploader: (mimetypes = [], maxCount = 10) =>
      createFileUploader(storage, mimetypes, maxCount),
  };
};

export const { singleFileUploader, multipleFilesUploader } = createUploader(UPLOAD_SERVER_PATH);
