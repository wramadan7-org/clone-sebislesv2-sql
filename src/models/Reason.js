const moment = require('moment');
const { SequelizeInstance, sequelize, DataTypes } = require('../config/database');

const Reason = sequelize.define('reasone', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Saya ingin mengganti jadwal',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
  },
}, {
  paranoid: true,
});

module.exports = {
  Reason,
};
