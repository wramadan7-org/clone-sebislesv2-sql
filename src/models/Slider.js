const moment = require('moment');
const {
  sequelize,
  SequelizeInstance,
  DataTypes,
} = require('../config/database');

const Slider = sequelize.define(
  'slider',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: SequelizeInstance.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    subtitle: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
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
  Slider,
};
