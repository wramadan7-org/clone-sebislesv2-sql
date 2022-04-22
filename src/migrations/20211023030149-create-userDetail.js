module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('userDetails', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    birthPlace: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    birthDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    religion: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    idCardType: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    idCardNumber: {
      type: Sequelize.STRING,
      // unique: true,
      allowNull: true,
    },
    mailingAddress: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    region: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    postalCode: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
      defaultValue: 'INDONESIA',
    },
    aboutMe: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('userDetails'),
};
