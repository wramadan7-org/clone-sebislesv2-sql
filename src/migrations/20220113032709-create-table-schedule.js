const {
  ACCEPT, PENDING, REJECT, EXPIRE, PROCESS, DONE,
} = process.env;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'schedules',
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        dateSchedule: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        typeClass: {
          type: Sequelize.ENUM('private', 'group'),
          allowNull: true,
        },
        statusSchedule: {
          type: Sequelize.ENUM(ACCEPT, PENDING, REJECT, EXPIRE, PROCESS, DONE),
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('schedules');
  },
};
