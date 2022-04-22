module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'transactionCoins',
      'order_id',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'topupCoins',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'paymentAt',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'transactionCoins',
      'order_id',
    );
  },
};
