const { cartItemStatuses } = require('../config/tokens');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cartItems', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      cartItemStatus: {
        type: Sequelize.ENUM(cartItemStatuses.ACCEPT, cartItemStatuses.PENDING),
        allowNull: false,
      },
      typeCourse: {
        type: Sequelize.ENUM('private', 'group'),
        allowNull: false,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endTime: {
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cartItems');
  },
};
