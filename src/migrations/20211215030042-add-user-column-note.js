'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'note',
      {
        type: Sequelize.STRING,
        // unique: true,
        after: 'referredBy',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'note'
    );
  }
};
