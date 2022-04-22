module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'rooms',
      'scheduleId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'schedules',
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
      'rooms',
      'scheduleId',
    );
  },
};
