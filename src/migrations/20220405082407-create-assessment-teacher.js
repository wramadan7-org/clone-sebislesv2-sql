const { PENDING, ACCEPT, REJECT } = process.env;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'assessmentTeachers',
      {
        id: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        teachingCertificate: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        teachingTool: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        educationBackground: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        teachingExperience: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        knowledge: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        writtenTestScore: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM(PENDING, ACCEPT, REJECT),
          allowNull: false,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        totalPointScore: {
          type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('assessmentTeachers');
  },
};
