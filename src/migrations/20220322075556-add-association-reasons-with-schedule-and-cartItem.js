module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'reasones',
      'cartItemId',
      {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'cartItems',
          key: 'id',
        },
        after: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    );

    await queryInterface.addColumn(
      'reasones',
      'scheduleId',
      {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'schedules',
          key: 'id',
        },
        after: 'cartItemId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'reasones',
      'scheduleId',
    );

    await queryInterface.removeColumn(
      'reasones',
      'cartItemId',
    );
  },
};
