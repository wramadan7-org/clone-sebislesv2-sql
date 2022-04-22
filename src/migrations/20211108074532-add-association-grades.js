module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'grades',
      'gradeGroupId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'gradeGroups',
          key: 'id',
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
      'grades',
      'gradeGroupId',
    );
  },
};
