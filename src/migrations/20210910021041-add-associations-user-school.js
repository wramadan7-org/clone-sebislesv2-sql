module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'schoolId',
    {
      type: Sequelize.STRING,
      references: {
        model: 'schools',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'lastName',
    },
  ),

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn(
    'users',
    'schoolId',
  ),
};
