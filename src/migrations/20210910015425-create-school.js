module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('schools', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    schoolName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    schoolAddress: {
      type: Sequelize.STRING,
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
  down: async (queryInterface, Sequelize) => queryInterface.dropTable('schools'),
};
