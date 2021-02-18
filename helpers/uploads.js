const { UPLOAD_UI_PATH, UPLOAD_SERVER_PATH } = require('../config/constants');

const toUiPath = (serverPath) =>
  serverPath.replace(UPLOAD_SERVER_PATH, UPLOAD_UI_PATH);

const toServerPath = (uiPath) =>
  uiPath.replace(UPLOAD_UI_PATH, UPLOAD_SERVER_PATH);

module.exports = {
  toUiPath,
  toServerPath,
};
