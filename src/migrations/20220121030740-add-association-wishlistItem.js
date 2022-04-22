module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'wishlistItems',
      'teacherSubjectId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'teacherSubjects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'teacherId',
      },
    );

    await queryInterface.addColumn(
      'wishlistItems',
      'availabilityHoursId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'availabilityHours',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'teacherSubjectId',
      },
    );

    await queryInterface.addColumn(
      'wishlistItems',
      'requestMaterial',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'dateTimeEnd',
      },
    );

    await queryInterface.addColumn(
      'wishlistItems',
      'imageMaterial',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'requestMaterial',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'wishlistItems',
      'teacherSubjcetId',
    );

    await queryInterface.removeColumn(
      'wishlistItems',
      'availabilityHoursId',
    );

    await queryInterface.removeColumn(
      'wishlistItems',
      'requestMaterial',
    );

    await queryInterface.removeColumn(
      'wishlistItems',
      'imageMaterial',
    );
  },
};
