module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'references',
      'userRefer',
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
      'references',
      'userRefer',
    );
  },
};
