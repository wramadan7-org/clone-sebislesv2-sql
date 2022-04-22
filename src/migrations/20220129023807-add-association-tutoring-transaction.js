module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tutoringTransactions',
      'studentId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
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
      'tutoringTransactions',
      'studentId',
    );
  },
};
