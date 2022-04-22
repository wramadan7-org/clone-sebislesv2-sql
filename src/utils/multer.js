const multer = require('multer');
const path = require('path');

const storage = (location, identity) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, location);
  },
  filename: (req, file, cb) => {
    const splitIdentity = identity.split('-');
    const lastIdentity = splitIdentity[splitIdentity.length - 1];
    const filename = `${
      file.fieldname
    }-${Date.now()}${lastIdentity}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const options = (location, identity) => multer({
  storage: storage(location, identity),
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: (req, file, callback) => {
    // const ext = path.extname(file.originalname)
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF)$/)) {
      return callback('Format tidak sesuai!', false);
    }
    callback(null, true);
  },
});

module.exports = {
  options,
};
