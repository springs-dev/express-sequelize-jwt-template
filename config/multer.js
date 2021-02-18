const multer = require('multer');
const cryptoRandomString = require('crypto-random-string');

const { UPLOAD_SERVER_PATH } = require('./constants');

// USAGE:
// post('/some', imageStorage.single('fieldName'), (req) => {
//   console.log(req.file);
//   return Some.create({ someImagePath: toUiPath(req.file.path) })
//     .catch(next);
// });

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_SERVER_PATH}/images/`);
  },

  fileFilter: (req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) {
      cb(new Error('Wrong file type'));
      return;
    }

    cb(null, true);
  },

  filename: (req, file, cb) => {
    const extension = /\.([a-z0-9]+)$/i.exec(file.originalname)[1];
    const fileName = `${cryptoRandomString({ length: 30 })}.${extension}`;

    cb(null, fileName);
  },
});

module.exports = {
  imageStorage,
};
