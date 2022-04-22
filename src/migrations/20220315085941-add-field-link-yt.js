module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'url',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'coin',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'url',
    );
  },
};
