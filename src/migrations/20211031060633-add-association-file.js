module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'files',
      'userId',
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'files',
      'userId',
    );
  },
};
