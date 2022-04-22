const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

const TutoringTransaction = sequelize.define('tutoringTransaction', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  statusTransaction: {
    type: DataTypes.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE),
    allowNull: false,
  },
  discount: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  subtotal: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  paid: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
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
  TutoringTransaction,
};
