const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const GradeGroup = sequelize.define('gradeGroup', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  gradeGroupCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gradeGroupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  temporaryGradeId: {
    type: DataTypes.STRING,
    allowNull: true,
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
  GradeGroup,
};
