module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'messages',
      'isRead',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        after: 'isNew',
        defaultValue: 0,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'messages',
      'isRead',
    );
  },
};
