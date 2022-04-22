module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
      id: 'bae4d026-cd7f-4b5d-8044-87ebb116116f',
      email: 'student@sebisedu.co.id',
      password:
          '$2b$10$WXit0D6QlUKJZkwwCT7.qu1u3g.u6ivDMp7Fs0qZ3tqYJh/dZXfZO', // 12345678
      gender: 'male',
      firstName: 'Ilham',
      lastName: 'Student',
      roleId: 'a0a76676-e446-49d2-ab7a-ae622783d7b8',
      phoneNumber: '082257022981',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('users', {
    roleId: 'a0a76676-e446-49d2-ab7a-ae622783d7b8',
  }),
};
