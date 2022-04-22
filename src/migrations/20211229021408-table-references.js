module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'references',
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        nameReference: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        phoneReference: {
          type: Sequelize.STRING(13),
          allowNull: true,
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
    await queryInterface.dropTable('references');
  },
};
