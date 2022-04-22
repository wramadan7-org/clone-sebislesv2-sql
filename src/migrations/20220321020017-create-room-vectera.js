module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'rooms',
      {
        id: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        meetingId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        vecteraRoomId: {
          type: Sequelize.STRING,
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
    await queryInterface.dropTable('rooms');
  },
};