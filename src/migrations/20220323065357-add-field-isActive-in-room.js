module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'rooms',
      'isActive',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
        after: 'isVecteraDeleted',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'rooms',
      'isActive',
    );
  },
};
