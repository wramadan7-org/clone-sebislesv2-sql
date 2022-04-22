module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'prices',
      'type',
      {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'prices',
      'description',
      {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'group',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'prices',
      'type',
    );

    await queryInterface.removeColumn(
      'prices',
      'descrption',
    );
  },
};
