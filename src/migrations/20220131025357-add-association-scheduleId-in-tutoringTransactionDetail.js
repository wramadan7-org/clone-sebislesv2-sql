module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tutoringTransactionDetails',
      'scheduleId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'tutoringTransactionId',
        references: {
          model: 'schedules',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'tutoringTransactionDetails',
      'scheduleId',
    );
  },
};
