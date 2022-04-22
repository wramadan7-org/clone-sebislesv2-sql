module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'teacherSubjects',
      'gradeId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'grades',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'teacherSubjects',
      'subjectId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'subjects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'gradeId',
      },
    );

    await queryInterface.addColumn(
      'teacherSubjects',
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
        after: 'gradeId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'teacherSubjects',
      'gradeId',
    );

    await queryInterface.removeColumn(
      'teacherSubjects',
      'subjectId',
    );

    await queryInterface.removeColumn(
      'teacherSubjects',
      'teacherId',
    );
  },
};
