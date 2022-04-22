module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'reports',
      {
        id: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        presence: {
          type: Sequelize.ENUM('0', '1', '2', '3'),
          allowNull: false,
          defaultValue: '0',
        },
        connection: {
          type: Sequelize.ENUM('0', '1', '2', '3'),
          allowNull: false,
          defaultValue: '0',
        },
        understand: {
          type: Sequelize.ENUM('0', '1', '2', '3'),
          allowNull: false,
          defaultValue: '0',
        },
        master: {
          type: Sequelize.ENUM('0', '1', '2', '3'),
          allowNull: false,
          defaultValue: '0',
        },
        complete: {
          type: Sequelize.ENUM('0', '1', '2', '3'),
          allowNull: false,
          defaultValue: '0',
        },
        conclude: {
          type: Sequelize.ENUM('0', '1', '2', '3'),
          allowNull: false,
          defaultValue: '0',
        },
        conclusion: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        internetAppProblem: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        mediaAndLearningResources: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        etc: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        isReported: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
    await queryInterface.dropTable('reports');
  },
};
