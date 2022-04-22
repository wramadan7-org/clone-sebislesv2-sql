module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('gradeGroups', [
    {
      id: '70d519b4-1ea3-4367-957e-68035f8a34aa',
      curriculumId: '18ef7865-3292-4635-a813-044b6f17b310',
      gradeGroupCode: 'sd',
      gradeGroupName: 'SEKOLAH DASAR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'c3923c45-1055-4345-8ebe-6dc58f5c1e0d',
      curriculumId: '18ef7865-3292-4635-a813-044b6f17b310',
      gradeGroupCode: 'smp',
      gradeGroupName: 'SEKOLAH MENENGAH PERTAMA',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '8bf6e303-a81e-4587-9b7e-5d2b7983f455',
      curriculumId: '18ef7865-3292-4635-a813-044b6f17b310',
      gradeGroupCode: 'sma',
      gradeGroupName: 'SEKOLAH MENENGAH ATAS',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '12a92681-436e-452f-af03-2c5e13d6c243',
      curriculumId: '18ef7865-3292-4635-a813-044b6f17b310',
      gradeGroupCode: 'smk',
      gradeGroupName: 'SEKOLAH MENENGAH KEJURUAN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('gradeGroups', null),
};
