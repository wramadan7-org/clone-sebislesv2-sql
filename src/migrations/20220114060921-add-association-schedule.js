module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'schedules',
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

    await queryInterface.addColumn(
      'schedules',
      'studentId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'teacherId',
      },
    );

    await queryInterface.addColumn(
      'schedules',
      'teacherSubjectId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'teacherSubjects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'teacherId',
      },
    );

    await queryInterface.addColumn(
      'schedules',
      'availabilityHoursId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'availabilityHours',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'teacherSubjectId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'schedules',
      'teacherId',
    );

    await queryInterface.removeColumn(
      'schedules',
      'studentId',
    );

    await queryInterface.removeColumn(
      'schedules',
      'teacherSubjectId',
    );

    await queryInterface.removeColumn(
      'schedules',
      'availabilityHoursId',
    );
  },
};
