module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'curriculums',
      'curriculumCode',
      {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'id',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'curriculums',
      'curriculumCode',
    );
  },
};
