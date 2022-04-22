module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'cartItems',
      'requestMaterial',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'endTime',
      },
    );

    await queryInterface.addColumn(
      'cartItems',
      'imageMaterial',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'requestMaterial',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'cartItems',
      'requestMaterial',
    );

    await queryInterface.removeColumn(
      'cartItems',
      'imageMaterial',
    );
  },
};
