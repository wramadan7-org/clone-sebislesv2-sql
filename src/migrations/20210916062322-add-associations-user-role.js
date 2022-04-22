module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'roleId',
    {
      type: Sequelize.STRING,
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
      after: 'lastName',
    },
  ),

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn(
    'users',
    'roleId',
  ),
};
