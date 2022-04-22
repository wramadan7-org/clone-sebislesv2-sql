module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('subjects', [
    {
      id: '9a6fc986-8cd0-40d1-bfa9-7bff440571c4',
      subjectCode: 'matematika',
      subjectName: 'MATEMATIKA',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '66a880c3-3f3a-4491-b911-0469a0e75584',
      subjectCode: 'ipa',
      subjectName: 'ILMU PENGETAHUAN ALAM',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '85de0513-b97b-4e4b-9f88-8bb31e21d3ad',
      subjectCode: 'ips',
      subjectName: 'ILMU PENGETAHUAN SOSIAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2fe2d2ee-6911-4dab-965c-f3bcc8c81cdd',
      subjectCode: 'agama',
      subjectName: 'AGAMA',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'd4c84e86-a5b0-47b3-946e-b16034a2cc97',
      subjectCode: 'pkn',
      subjectName: 'PENDIDIKAN KEWARGA NEGARAAN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('subjects', null),
};
