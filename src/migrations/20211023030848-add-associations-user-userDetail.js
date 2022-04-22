module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn(
    'userDetails',
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
  ),

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn(
    'userDetails',
    'userId',
  ),
};
