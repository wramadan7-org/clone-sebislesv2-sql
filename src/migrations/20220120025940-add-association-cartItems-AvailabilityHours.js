module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'cartItems',
      'availabilityHoursId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'availabilityHours',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'teacherSubjectId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'cartItems',
      'availabilityHoursId',
    );
  },
};
