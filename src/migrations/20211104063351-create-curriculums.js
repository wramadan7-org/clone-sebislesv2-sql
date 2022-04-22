module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('curriculums', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      curriculumCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      curriculumName: {
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
    await queryInterface.dropTable('curriculums');
  },
};
