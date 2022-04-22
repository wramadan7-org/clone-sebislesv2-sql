const moment = require('moment');
const {
  SequelizeInstance,
  sequelize,
  DataTypes,
} = require('../config/database');

const Question = sequelize.define(
  'question',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
);

module.exports = {
  Question,
};
