module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'reports',
      'userId',
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
      'reports',
      'scheduleId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'schedules',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'userId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'reports',
      'userId',
    );

    await queryInterface.removeColumn(
      'reports',
      'scheduleId',
    );
  },
};
