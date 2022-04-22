module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'referralHistories',
      'userId',
      {
        type: Sequelize.STRING,
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
      'referralHistories',
      'referredBy',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'userId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'referralHistories',
      'userId',
    );

    await queryInterface.removeColumn(
      'referralHistories',
      'referredBy',
    );
  },
};
