const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const { PENDING, ACCEPT, REJECT } = process.env;

const AssessmentTeacher = sequelize.define(
  'assessmentTeacher',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    teachingCertificate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teachingTool: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    educationBackground: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teachingExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    knowledge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    writtenTestScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(PENDING, ACCEPT, REJECT),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    totalPointScore: {
      type: DataTypes.INTEGER,
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
  },
);

module.exports = {
  AssessmentTeacher,
};
