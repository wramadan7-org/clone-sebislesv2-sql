const moment = require('moment');
const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const {
  PENDING, ACCEPT, PROCESS, EXPIRE, REJECT, DONE, DELETE,
} = process.env;

const Schedule = sequelize.define('schedule', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  dateSchedule: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  typeClass: {
    type: DataTypes.ENUM('private', 'group'),
    allowNull: true,
  },
  statusSchedule: {
    type: DataTypes.ENUM(ACCEPT, PENDING, REJECT, EXPIRE, PROCESS, DONE, DELETE),
    allowNull: false,
  },
  requestMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  friend1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  friend2: {
    type: DataTypes.STRING,
    allowNull: true,
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
  Schedule,
};
