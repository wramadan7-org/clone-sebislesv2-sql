const moment = require('moment');
const {
  SequelizeInstance,
  sequelize,
  DataTypes,
} = require('../config/database');

const InterviewQuestion = sequelize.define(
  'interviewQuestion',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: SequelizeInstance.UUIDV4,
    },
    questioner: {
      type: DataTypes.TEXT,
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
  InterviewQuestion,
};
