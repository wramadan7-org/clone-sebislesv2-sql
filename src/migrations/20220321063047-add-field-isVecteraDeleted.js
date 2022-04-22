module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'rooms',
      'isVecteraDeleted',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
        after: 'vecteraRoomId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'rooms',
      'isVecteraDeleted',
    );
  },
};
