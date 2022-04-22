module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('gradeGroups', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      gradeGroupCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gradeGroupName: {
        type: Sequelize.STRING,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('gradeGroups');
  },
};
