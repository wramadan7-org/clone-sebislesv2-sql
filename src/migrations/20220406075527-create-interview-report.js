module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'interviewQuestions',
      {
        id: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        questioner: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('interviewQuestions');
  },
};
