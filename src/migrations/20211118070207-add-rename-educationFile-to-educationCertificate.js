module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'educationBackgrounds',
      'educationFile',
      'educationCertificate',
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'educationBackgrounds',
      'educationCertificate',
      'educationFile',
    );
  },
};
