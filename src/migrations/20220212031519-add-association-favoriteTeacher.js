module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'favoriteTeachers',
      'studentId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'favoriteTeachers',
      'teacherId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'studentId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'favoriteTeachers',
      'studentId',
    );

    await queryInterface.removeColumn(
      'favoriteTeachers',
      'teacherId',
    );
  },
};
