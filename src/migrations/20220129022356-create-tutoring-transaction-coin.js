const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'tutoringTransactions',
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        statusTransaction: {
          type: Sequelize.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE),
          allowNull: false,
        },
        discount: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        subtotal: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        total: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        paid: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
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
    await queryInterface.dropTable('tutoringTransactions');
  },
};
