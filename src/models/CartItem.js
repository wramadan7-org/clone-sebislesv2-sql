const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  cartItemStatus: {
    type: DataTypes.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE),
    allowNull: false,
  },
  typeCourse: {
    type: DataTypes.ENUM('private', 'group'),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
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
},
{
  paranoid: true,
});

module.exports = {
  CartItem,
};
