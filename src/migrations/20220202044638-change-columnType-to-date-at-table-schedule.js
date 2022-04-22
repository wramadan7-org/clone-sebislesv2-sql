module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'schedules',
      'dateSchedule',
      {
        type: Sequelize.DATE,
        allowNull: false,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'schedules',
      'dateSchedule',
      {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    );
  },
};
