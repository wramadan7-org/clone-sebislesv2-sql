module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'teachingExperienceDetails',
      'teachingExperienceId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'teachingExperiences',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'id',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'teachingExperienceDetails',
      'teachingExperienceId',
    );
  },
};
