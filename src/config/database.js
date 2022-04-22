const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./logger');
const { database } = require('./config');

const {
  dialect, username, password, host, port, database: dbName,
} = database;

const sequelize = new Sequelize(`${dialect}://${username}:${password}@${host}:${port}/${dbName}`);
const SequelizeInstance = sequelize.Sequelize;

const connectDb = sequelize.authenticate().then(() => {
  logger.info('Connection has been established successfully.');
  return Promise.resolve(true);
}).catch((error) => {
  logger.error(`Unable to connect to the database: ${error}`);
  return Promise.reject(error);
});

module.exports = {
  connectDb,
  sequelize,
  SequelizeInstance,
  DataTypes,
};
