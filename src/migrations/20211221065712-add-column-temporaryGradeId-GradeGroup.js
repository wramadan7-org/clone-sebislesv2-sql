module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'gradeGroups',
      'temporaryGradeId',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'id',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'gradeGroups',
      'temporaryGradeId',
    );
  },
};
