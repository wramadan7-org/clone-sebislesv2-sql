const {
  PENDING, ACCEPT, REJECT,
} = process.env;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'teacherSubjects',
      'request',
      {
        type: Sequelize.ENUM(PENDING, ACCEPT, REJECT),
        allowNull: false,
        after: 'status',
        defaultValue: ACCEPT,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'teacherSubjects',
      'request',
    );
  },
};
