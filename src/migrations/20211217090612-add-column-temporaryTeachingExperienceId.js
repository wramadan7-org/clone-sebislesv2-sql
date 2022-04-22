'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'teachingExperiences',
      'temporaryTeachingExperienceId',
      {
        type: Sequelize.STRING,
        // unique: true,
        after: 'id',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'teachingExperiences',
      'temporaryTeachingExperienceId'
    );
  }
};
