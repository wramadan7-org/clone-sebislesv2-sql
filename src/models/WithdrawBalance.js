const moment = require('moment');
const {
  SequelizeInstance,
  sequelize,
  DataTypes,
} = require('../config/database');

const WithdrawBalance = sequelize.define(
  'withdrawBalance',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: SequelizeInstance.UUIDV4,
      allowNull: false,
    },
    transferCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
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
  },
);

module.exports = {
  WithdrawBalance,
};
