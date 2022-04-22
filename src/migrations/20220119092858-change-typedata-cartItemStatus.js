const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE,
} = process.env;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'cartItems',
      'cartItemStatus',
      {
        type: Sequelize.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE),
        allowNull: false,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'cartItems',
      'cartItemStatus',
      {
        type: Sequelize.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE),
        allowNull: false,
      },
    );
  },
};
