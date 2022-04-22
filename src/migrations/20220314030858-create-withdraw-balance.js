const { status } = require('../config/status');

const {
  ACCEPT, PENDING, PROCESS, SUCCESS, REJECT, FAILED,
} = status;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdrawBalances', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      transferCost: {
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(ACCEPT, PENDING, PROCESS, SUCCESS, REJECT, FAILED),
        allowNull: false,
      },
      bankId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'banks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      teacherId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('withdrawBalances');
  },
};
