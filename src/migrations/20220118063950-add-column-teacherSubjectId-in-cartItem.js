module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'cartItems',
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'cartItems',
      'teacherSubjectId',
    );
  },
};
