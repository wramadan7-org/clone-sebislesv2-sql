const moment = require('moment');
const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const TeachingExperienceDetail = sequelize.define('teachingExperienceDetail', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  gradeCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
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
  TeachingExperienceDetail,
};
