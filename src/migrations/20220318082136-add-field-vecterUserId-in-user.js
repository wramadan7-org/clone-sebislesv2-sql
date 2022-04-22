module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'vecteraUserId',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'id',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'vecteraUserId',
    );
  },
};
