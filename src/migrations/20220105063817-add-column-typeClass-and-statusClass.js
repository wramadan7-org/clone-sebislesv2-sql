module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'teacherSubjects',
      'type',
      {
        type: Sequelize.ENUM('private', 'group'),
        allowNull: false,
        after: 'subjectId',
      },
    );

    await queryInterface.addColumn(
      'teacherSubjects',
      'status',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        after: 'type',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'teacherSubjects',
      'type',
    );

    await queryInterface.removeColumn(
      'teacherSubjects',
      'status',
    );
  },
};
