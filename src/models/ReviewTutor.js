const moment = require('moment');
const {
  SequelizeInstance,
  sequelize,
  DataTypes,
} = require('../config/database');

const ReviewTutor = sequelize.define(
  'reviewTutor',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: SequelizeInstance.UUIDV4,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
  ReviewTutor,
};
