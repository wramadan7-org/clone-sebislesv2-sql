const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const AttendanceTeacher = sequelize.define(
  'attendanceTeacher',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    teacherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attendanceTime: {
      type: DataTypes.DATE,
      defaultValue: moment().format('YYYY-MM-DD HH:mm:00'),
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
  AttendanceTeacher,
};
