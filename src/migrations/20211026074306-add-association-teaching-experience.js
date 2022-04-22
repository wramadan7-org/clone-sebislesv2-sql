module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'teachingExperiences',
      'teacherId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
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
      'teachingExperiences',
      'teacherId',
    );
  },
};
