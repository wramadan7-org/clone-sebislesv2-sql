module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'carts',
      'studentId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'cartItems',
      'teacherId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'cartItems',
      'cartId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'carts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'endTime',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'carts',
      'studentId',
    );

    await queryInterface.removeColumn(
      'cartItems',
      'teacherId',
    );

    await queryInterface.removeColumn(
      'cartItems',
      'cartId',
    );
  },
};
