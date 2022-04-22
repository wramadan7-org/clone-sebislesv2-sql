module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('educationBackgrounds', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      educationMajor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      educationLevel: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      universityName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thesisTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      educationGpa: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      educationFrom: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      educationTo: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      educationTranscript: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('educationBackgrounds');
  },
};
