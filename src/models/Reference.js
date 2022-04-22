const moment = require('moment');
const { SequelizeInstance, sequelize, DataTypes } = require('../config/database');

const Reference = sequelize.define('reference', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  nameReference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneReference: {
    type: DataTypes.STRING(13),
    allowNull: true,
  },
  userRefer: {
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
}, {
  paranoid: true,
});

module.exports = {
  Reference,
};
