module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'devices',
      'userId',
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'devices',
      'userId',
    );
  },
};
