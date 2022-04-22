module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'banks',
      'bankNumber',
      {
        type: Sequelize.BIGINT(20),
        allowNull: false,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'banks',
      'bankNumber',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    );
  },
};
