const httpStatus = require('http-status');
const { File } = require('../models/Files');
const ApiError = require('../utils/ApiError');

const getFile = async (userId, fileType) => {
  const file = await File.findOne(
    {
      where: {
        userId,
        fileType,
      },
    },
  );

  return file;
};

const addFile = async (userId, fileBody) => {
  const file = await getFile(userId, fileBody.fileType);

  if (!file) {
    const data = {
      userId,
      ...fileBody,
    };

    const cretaeFile = await File.create(data);
    return cretaeFile;
  }
  Object.assign(file, fileBody);
  file.save();
  return file;
};

module.exports = {
  getFile,
  addFile,
};
