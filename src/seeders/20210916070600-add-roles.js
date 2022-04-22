module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('roles', [
    {
      id: 'a0a76676-e446-49d2-ab7a-ae622783d7b8',
      roleName: 'student',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '437e0221-eb3d-477f-a3b3-799256fbcab6',
      roleName: 'teacher',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '584c4a79-9dc5-4fae-9aa0-f49dc6b790f5',
      roleName: 'pteacher',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'd39b1062-dcf0-4cb1-b8df-2790af008c46',
      roleName: 'rteacher',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '1034f7bb-5ec6-447a-80b5-44a0bad040a1',
      roleName: 'public',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '07348839-b192-450c-b9a2-8416389eacaa',
      roleName: 'verifikator',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'c5168f64-b5fa-4ebb-94b5-337d7540fedc',
      roleName: 'finance',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'd33f5a01-7128-4fe0-9af5-af2359a204a2',
      roleName: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '07487e28-d781-42e7-9e50-a990565e2560',
      roleName: 'administrator',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('roles', null),
};
