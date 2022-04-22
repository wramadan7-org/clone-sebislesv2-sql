module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tutoringTransactionDetails',
      'tutoringTransactionId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'tutoringTransactions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'id',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'tutoringTransactionDetails',
      'tutoringTransactionId',
    );
  },
};
