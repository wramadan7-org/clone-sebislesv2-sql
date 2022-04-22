module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'reasones',
      {
        id: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        category: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        reason: {
          type: Sequelize.TEXT,
          allowNull: false,
          default: 'Saya ingin mengganti jadwal',
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
    await queryInterface.dropTable('reasones');
  },
};
