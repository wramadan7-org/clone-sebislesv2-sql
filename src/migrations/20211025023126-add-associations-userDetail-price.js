module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn(
    'userDetails',
    'priceId',
    {
      type: Sequelize.STRING,
      references: {
        model: 'prices',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'aboutMe',
    },
  ),

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn(
    'userDetails',
    'priceId',
  ),
};
