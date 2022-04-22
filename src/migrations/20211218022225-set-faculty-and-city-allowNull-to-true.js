'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'educationBackgrounds',
      'faculty',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );

    await queryInterface.changeColumn(
      'educationBackgrounds',
      'city',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'educationBackgrounds',
      'faculty',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );

    await queryInterface.changeColumn(
      'educationBackgrounds',
      'city',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
  }
};
