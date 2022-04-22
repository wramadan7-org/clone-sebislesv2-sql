module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'wishlistItems',
      'teacherId',
      {
        type: Sequelize.STRING,
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
      'wishlistItems',
      'wishlistId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'wishlists',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'dateTimeEnd',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'wishlistItems',
      'teacherId',
    );

    await queryInterface.removeColumn(
      'wishlistItems',
      'wishlistId',
    );
  },
};
