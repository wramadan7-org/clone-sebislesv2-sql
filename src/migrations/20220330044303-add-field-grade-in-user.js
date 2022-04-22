module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'grade',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'url',
        default: null,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'grade',
    );
  },
};
