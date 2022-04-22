module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'prices',
      'temporaryId',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'description',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'prices',
      'temporaryId',
    );
  },
};
