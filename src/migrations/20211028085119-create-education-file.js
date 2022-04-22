module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'educationBackgrounds',
      'educationFile',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'educationTo',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'educationBackgrounds',
      'educationFile',
    );
  },
};
