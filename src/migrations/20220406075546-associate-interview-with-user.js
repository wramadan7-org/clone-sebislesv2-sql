module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'interviewQuestions',
      'userId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        after: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'interviewQuestions',
      'userId',
    );
  },
};
