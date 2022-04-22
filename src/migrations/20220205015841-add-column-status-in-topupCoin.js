const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'topupCoins',
      'statusCoin',
      {
        type: Sequelize.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE),
        allowNull: false,
        after: 'price',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'topupCoins',
      'statusCoin',
    );
  },
};
