module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'teachingExperiences',
      'show',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        after: 'teachingTo',
        default: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'teachingExperiences',
      'show',
    );
  },
};
