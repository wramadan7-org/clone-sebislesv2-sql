const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const TutoringTransactionDetail = sequelize.define('tutoringTransactionDetail', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
  },
  teacherName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lessonSchedule: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.BIGINT,
    allowNull: false,
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
  TutoringTransactionDetail,
};
