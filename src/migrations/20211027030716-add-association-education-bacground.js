module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'educationBackgrounds',
      'teacherId',
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'educationBackgrounds',
      'teacherId',
    );
  },
};
