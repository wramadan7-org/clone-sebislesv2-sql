module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'availabilityHours',
      'durationId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'durations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
        after: 'id',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'availabilityHours',
      'durationId',
    );
  },
};
