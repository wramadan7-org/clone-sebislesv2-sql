'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'temporaryIdentityId',
      {
        type: Sequelize.STRING,
        // unique: true,
        after: 'id',
      }
    );

    await queryInterface.addColumn(
      'users',
      'temporaryPeopleId',
      {
        type: Sequelize.STRING,
        // unique: true,
        after: 'temporaryIdentityId',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'temporaryIdentityId'
    );

    await queryInterface.removeColumn(
      'users',
      'temporaryPeopleId'
    );
  }
};
