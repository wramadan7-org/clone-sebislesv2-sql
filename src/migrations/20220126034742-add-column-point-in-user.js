module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'point',
      {
        type: Sequelize.BIGINT,
        allowNull: true,
        after: 'note',
        defaultValue: 0,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'point',
    );
  },
};
