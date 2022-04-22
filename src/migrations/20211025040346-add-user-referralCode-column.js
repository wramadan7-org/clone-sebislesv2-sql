const { generateReferralCode } = require('../utils/random');

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'referralCode',
    {
      type: Sequelize.STRING,
      after: 'lastName',
    },
  ),

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'referralCode'),
};
