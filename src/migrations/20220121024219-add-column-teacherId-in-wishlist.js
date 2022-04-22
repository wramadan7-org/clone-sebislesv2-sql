module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'wishlists',
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
      'wishlists',
      'teacherId',
    );
  },
};
