const moment = require('moment');
const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const Report = sequelize.define('report', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
  },
  presence: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
    allowNull: false,
    defaultValue: '0',
  },
  connection: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
    allowNull: false,
    defaultValue: '0',
  },
  understand: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
    allowNull: false,
    defaultValue: '0',
  },
  master: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
    allowNull: false,
    defaultValue: '0',
  },
  complete: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
    allowNull: false,
    defaultValue: '0',
  },
  conclude: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
    allowNull: false,
    defaultValue: '0',
  },
  conclusion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  internetAppProblem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mediaAndLearningResources: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  etc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isReported: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:00'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:00'),
  },
}, {
  paranoid: true,
});

module.exports = {
  Report,
};
