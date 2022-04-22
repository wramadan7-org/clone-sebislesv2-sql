module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'cartItems',
      'friend1',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'imageMaterial',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'cartItems',
      'friend2',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'friend1',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'schedules',
      'friend1',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'imageMaterial',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.addColumn(
      'schedules',
      'friend2',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'friend1',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'cartItems',
      'friend1',
    );

    await queryInterface.removeColumn(
      'cartItems',
      'friend2',
    );

    await queryInterface.removeColumn(
      'schedules',
      'friend1',
    );

    await queryInterface.removeColumn(
      'schedules',
      'friend2',
    );
  },
};
