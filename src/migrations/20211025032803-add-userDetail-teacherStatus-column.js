const { teacherStatuses } = require('../config/users');

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn(
    'userDetails',
    'teacherStatus',
    {
      type: Sequelize.ENUM(Object.values(teacherStatuses)),
      defaultValue: teacherStatuses.PENDING,
    },
  ),

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn('userDetails', 'teacherStatus'),
};
