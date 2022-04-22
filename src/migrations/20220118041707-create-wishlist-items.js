module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'wishlistItems',
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        typeCourse: {
          type: Sequelize.ENUM('private', 'group'),
          allowNull: false,
        },
        dateTimeStart: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        dateTimeEnd: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wishlistItems');
  },
};
