module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'educationBackgrounds',
      'faculty',
      {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'educationMajor',
      },
    );

    await queryInterface.addColumn(
      'educationBackgrounds',
      'city',
      {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'faculty',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'educationBackgrounds',
      'faculty',
    );

    await queryInterface.removeColumn(
      'educationBackgrounds',
      'city',
    );
  },
};
