module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('gradeGroups', 'curriculumId', {
      type: Sequelize.STRING,
      references: {
        model: 'curriculums',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
      after: 'id',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('gradeGroups', 'curriculumId');
  },
};
