const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const AvailabilityHours = sequelize.define('availabilityHours', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  dayCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timeStart: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeEnd: {
    type: DataTypes.STRING,
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
  AvailabilityHours,
};
