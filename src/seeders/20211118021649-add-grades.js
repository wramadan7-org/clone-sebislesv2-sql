module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('grades', [
    {
      id: '91176f34-c6b2-407c-b397-39097e740952',
      gradeGroupId: '70d519b4-1ea3-4367-957e-68035f8a34aa',
      gradeCode: '1',
      gradeName: 'I',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '05717fc9-c5ae-40ba-b48b-fb2427d8d960',
      gradeGroupId: '70d519b4-1ea3-4367-957e-68035f8a34aa',
      gradeCode: '2',
      gradeName: 'II',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '26f46f2d-ab1e-4a4b-9241-bfabb90edf03',
      gradeGroupId: '70d519b4-1ea3-4367-957e-68035f8a34aa',
      gradeCode: '3',
      gradeName: 'III',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'a66c5195-91dd-41a7-b5a2-a1ab09ef7d1f',
      gradeGroupId: '70d519b4-1ea3-4367-957e-68035f8a34aa',
      gradeCode: '4',
      gradeName: 'IV',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'da5e15b0-9166-4015-9416-956ed71d5bf9',
      gradeGroupId: '70d519b4-1ea3-4367-957e-68035f8a34aa',
      gradeCode: '5',
      gradeName: 'V',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '8fe809b2-d8d2-4aed-8d6e-660aa2b72652',
      gradeGroupId: '70d519b4-1ea3-4367-957e-68035f8a34aa',
      gradeCode: '6',
      gradeName: 'VI',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'd61a538c-6155-465a-9cd3-77bd033f27b4',
      gradeGroupId: 'c3923c45-1055-4345-8ebe-6dc58f5c1e0d',
      gradeCode: '7',
      gradeName: 'VI',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5e467e2c-6ee6-41e3-9485-48deafbce376',
      gradeGroupId: 'c3923c45-1055-4345-8ebe-6dc58f5c1e0d',
      gradeCode: '8',
      gradeName: 'VII',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '29c39bad-edee-41db-b8f9-574f14566ac4',
      gradeGroupId: 'c3923c45-1055-4345-8ebe-6dc58f5c1e0d',
      gradeCode: '9',
      gradeName: 'IX',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2bebeee3-7d82-4fb4-938c-32c9e8288605',
      gradeGroupId: '8bf6e303-a81e-4587-9b7e-5d2b7983f455',
      gradeCode: '10',
      gradeName: 'X',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'c06e5ff9-9e04-496a-8d08-4944e31d6613',
      gradeGroupId: '8bf6e303-a81e-4587-9b7e-5d2b7983f455',
      gradeCode: '11',
      gradeName: 'XI',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5139d247-fb23-461f-bff0-9bf2e0cf80a8',
      gradeGroupId: '8bf6e303-a81e-4587-9b7e-5d2b7983f455',
      gradeCode: '12',
      gradeName: 'XII',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'a6b464bd-8dc8-4c32-831a-417c61caf839',
      gradeGroupId: '12a92681-436e-452f-af03-2c5e13d6c243',
      gradeCode: '10',
      gradeName: 'X',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5c543401-e9ec-4cd4-854a-abc7911f90b1',
      gradeGroupId: '12a92681-436e-452f-af03-2c5e13d6c243',
      gradeCode: '11',
      gradeName: 'XI',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5d25def1-c5d9-4696-b256-3e0608767bf7',
      gradeGroupId: '12a92681-436e-452f-af03-2c5e13d6c243',
      gradeCode: '12',
      gradeName: 'XII',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('grades', null),
};
