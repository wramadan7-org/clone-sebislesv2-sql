'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'educationBackgrounds',
      'temporaryIdentityId',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'teacherId',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'educationBackgrounds',
      'temporaryIdentityId'
    );
  }
};
