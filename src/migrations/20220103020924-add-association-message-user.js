module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'messages',
      'senderId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
          as: 'sender',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        after: 'id',
      },
    );

    await queryInterface.addColumn(
      'messages',
      'recipientId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
          as: 'recipient',
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
      'messages',
      'senderId',
    );

    await queryInterface.removeColumn(
      'messages',
      'recipientId',
    );
  },
};
