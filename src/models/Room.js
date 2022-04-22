const moment = require('moment');
const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const Room = sequelize.define('room', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  meetingId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vecteraRoomId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVecteraDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  Room,
};
