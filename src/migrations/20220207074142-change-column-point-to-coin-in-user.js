module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'users',
      'point',
      'coin',
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'users',
      'coin',
      'point',
    );
  },
};
