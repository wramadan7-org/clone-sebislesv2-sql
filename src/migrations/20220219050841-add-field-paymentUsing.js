module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'transactionCoins',
      'paymentUsing',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'paymentType',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'transactionCoins',
      'paymentUsing',
    );
  },
};
