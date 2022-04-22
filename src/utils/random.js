/**
 * Generate random string
 * @param {Number} length
 * @return {String}
 */
const generateRandomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Generate referral code
 * @return {String}
 */
const generateReferralCode = () => generateRandomString(8);

module.exports = {
  generateRandomString,
  generateReferralCode,
};
