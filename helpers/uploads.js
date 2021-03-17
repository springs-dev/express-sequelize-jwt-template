const fs = require('fs');
const { UPLOAD_UI_PATH, UPLOAD_SERVER_PATH } = require('../config/constants');

const toUiPath = (serverPath) =>
  serverPath.replace(UPLOAD_SERVER_PATH, UPLOAD_UI_PATH);

const toServerPath = (uiPath) =>
  uiPath.replace(UPLOAD_UI_PATH, UPLOAD_SERVER_PATH);

const removeUploadIfExists = (uiPath) => {
  if (!uiPath) {
    return Promise.resolve();
  }

  return new Promise((resolve) =>
    fs.unlink(toServerPath(uiPath), (err, res) => {
      if (err) {
        console.error(err);
      }
      resolve(res);
    })
  );
};

module.exports = {
  toUiPath,
  toServerPath,
  removeUploadIfExists,
};
