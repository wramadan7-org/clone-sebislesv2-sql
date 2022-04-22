const moment = require('moment');
const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const EducationBackground = sequelize.define('educationBackground', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  educationMajor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  educationLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  universityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thesisTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  educationGpa: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  educationFrom: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  educationTo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  educationTranscript: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  educationCertificate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  temporaryIdentityId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teacherId: {
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
  EducationBackground,
};
