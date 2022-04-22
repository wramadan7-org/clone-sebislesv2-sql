const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'cartItems',
      'cartItemStatus',
      {
        type: Sequelize.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE),
        allowNull: false,
      },
    );

    await queryInterface.changeColumn(
      'schedules',
      'statusSchedule',
      {
        type: Sequelize.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE),
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

    await queryInterface.changeColumn(
      'schedules',
      'statusSchedule',
      {
        type: Sequelize.ENUM(ACCEPT, PENDING, REJECT, EXPIRE, PROCESS, DONE),
        allowNull: false,
      },
    );
  },
};
