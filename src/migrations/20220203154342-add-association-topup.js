module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'topupCoins',
      'userId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'topupCoins',
      'coin',
      {
        type: Sequelize.BIGINT,
        allowNull: false,
        after: 'userId',
      },
    );

    await queryInterface.addColumn(
      'topupCoins',
      'price',
      {
        type: Sequelize.BIGINT,
        allowNull: false,
        after: 'coin',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'topupCoins',
      'coin',
    );

    await queryInterface.removeColumn(
      'topupCoins',
      'userId',
    );

    await queryInterface.removeColumn(
      'topupCoins',
      'price',
    );
  },
};
