module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('roles', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    roleName: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
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

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('roles'),
};
