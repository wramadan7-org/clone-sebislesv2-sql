const bcrypt = require('bcrypt');
const moment = require('moment');
const {
  sequelize,
  SequelizeInstance,
  DataTypes,
} = require('../config/database');
const { generateReferralCode } = require('../utils/random');
const { genders } = require('../config/users');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: SequelizeInstance.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      // type: DataTypes.ENUM(Object.values(genders)),
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referralCode: {
      type: DataTypes.STRING,
      defaultValue: generateReferralCode(),
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referredBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temporaryPeopleId: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: true,
    },
    temporaryIdentityId: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    coin: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    pin: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    vecteraUserId: {
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
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        }

        if (user.pin) {
          const salt = await bcrypt.genSaltSync(10);
          user.pin = bcrypt.hashSync(user.pin, salt);
        }
      },
    },
  },
);

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = {
  User,
};
