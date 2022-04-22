module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('teachingExperiences', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      universityName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      universityCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      teachingStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      teachingFrom: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      teachingTo: {
        type: Sequelize.DATEONLY,
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
    await queryInterface.dropTable('teachingExperiences');
  },
};
