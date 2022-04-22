const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const WishlistItem = sequelize.define('wishlistItems', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  typeCourse: {
    type: DataTypes.ENUM('private', 'group'),
    allowNull: false,
  },
  dateTimeStart: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dateTimeEnd: {
    type: DataTypes.DATE,
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
},
{
  paranoid: true,
});

module.exports = {
  WishlistItem,
};
