const { OAuth2Client } = require('google-auth-library');
const { getUserByEmail, createUser } = require('../services/userService');
const { generateRandomString } = require('./random');

const { GOOGLE_CLIENT_ID } = process.env;
const googleAuth = async (idToken, role) => {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const tiket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = tiket.getPayload();
  let { email, given_name, family_name } = payload;

  const checkUser = await getUserByEmail(email, {
    include: 'role',
  });
  try {
    if (!checkUser) {
      const user = await createUser({
        email,
        firstName: given_name,
        lastName: family_name,
        phoneNumber: generateRandomString(8),
        roleId: role,
        isVerified: true,
      });
      const createdUser = await getUserByEmail(user.email, {
        include: 'role',
      });
      return createdUser;
    }
  } catch (err) {
    console.log(err);
  }

  return checkUser;
};

module.exports = {
  googleAuth,
};
