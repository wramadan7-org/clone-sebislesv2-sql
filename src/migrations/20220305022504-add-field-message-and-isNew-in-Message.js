module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'messages',
      'message',
      {
        type: Sequelize.TEXT,
        allowNull: true,
        after: 'senderId',
      },
    );

    await queryInterface.addColumn(
      'messages',
      'isNew',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        after: 'message',
        defaultValue: 1,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'messages',
      'message',
    );

    await queryInterface.removeColumn(
      'messages',
      'isNew',
    );
  },
};
