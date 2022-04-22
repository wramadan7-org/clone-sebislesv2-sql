module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'schedules',
      'requestMaterial',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'statusSchedule',
      },
    );

    await queryInterface.addColumn(
      'schedules',
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
      'schedules',
      'requestMaterial',
    );

    await queryInterface.removeColumn(
      'schedules',
      'imageMaterial',
    );
  },
};
