module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'carts',
      'teacherId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'studentId',
        allowNull: false,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'carts',
      'teacherId',
    );
  },
};
