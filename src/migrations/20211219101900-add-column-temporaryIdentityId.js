module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'banks',
      'temporaryIdentityId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'userId',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'banks',
      'temporaryIdentityId',
    );
  },
};
