module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('curriculums', [
    {
      id: '18ef7865-3292-4635-a813-044b6f17b310',
      curriculumName: 'KURIKULUM 13',
      curriculumCode: 'k13',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('curriculums', null),
};
