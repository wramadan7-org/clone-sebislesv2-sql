module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'topupCoins',
      'referralCode',
      {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'users',
          key: 'referralCode',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
        after: 'price',
      },
    );

    await queryInterface.addColumn(
      'topupCoins',
      'discount',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
        after: 'referralCode',
      },
    );

    await queryInterface.addColumn(
      'topupCoins',
      'subtotal',
      {
        type: Sequelize.BIGINT,
        allowNull: false,
        default: '0%',
        after: 'discount',
      },
    );

    await queryInterface.addColumn(
      'topupCoins',
      'total',
      {
        type: Sequelize.BIGINT,
        allowNull: false,
        default: 0,
        after: 'subtotal',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'topupCoins',
      'referralCode',
    );

    await queryInterface.removeColumn(
      'topupCoins',
      'discount',
    );

    await queryInterface.removeColumn(
      'topupCoins',
      'subtotal',
    );

    await queryInterface.removeColumn(
      'topupCoins',
      'total',
    );
  },
};
