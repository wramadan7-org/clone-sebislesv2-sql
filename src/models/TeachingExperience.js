const moment = require('moment');
const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const TeachingExperience = sequelize.define('teachingExperience', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  temporaryTeachingExperienceId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  universityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  universityCity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teachingStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teachingFrom: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  teachingTo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  show: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  hooks: {
    afterDestroy: async (instance) => {
      // referensi hook delete
      // instance = model dia sendiri
      // instance.getTeachingExperienceDetails().then((teachingExperienceDetails) => {
      //   teachingExperienceDetails.forEach((data) => {
      //     data.destroy();
      //   });
      // // });

      sequelize.models.teachingExperienceDetail.destroy({
        where: {
          teachingExperienceId: instance.id,
        },
      });
    },
  },
});

module.exports = {
  TeachingExperience,
};
