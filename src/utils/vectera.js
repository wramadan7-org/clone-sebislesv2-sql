const axios = require('axios');
const randomstring = require('randomstring');

const {
  VECTERA_BASE_URL,
  VECTERA_TOKEN,
  VECTERA_ORGANIZATION_ID,
} = process.env;

// vectera http client instance
const vecteraHttpClient = axios.create(
  {
    baseURL: VECTERA_BASE_URL,
    headers: {
      Authorization: `Token ${VECTERA_TOKEN}`,
    },
  },
);

/**
 * Check exiting user
 * @param { String } email
 * @returns { Promise<Array> }
 */
const checkUser = async (email) => {
  const getUser = await vecteraHttpClient.get(`users/?search=${email}`);

  return getUser.data;
};

/**
 * Create new vectera's user
 * @param email
 * @param firstName
 * @returns { Promise<String | null> }
 */
const createUser = async (email, firstName) => {
  const createNewUser = await vecteraHttpClient.post('users',
    {
      email,
      firstName,
      organizationId: VECTERA_ORGANIZATION_ID,
      isAdmin: false,
      isManaged: false,
    });

  return createNewUser.status === 201 ? createNewUser.data.id : null;
};

/**
 * Get or create user
 * @param { String } email
 * @param { String } firstName
 * @returns { Promise<String | null> }
 */
const getOrCreateUser = async (email, firstName) => {
  const userData = await checkUser(email);

  if (userData.length > 0) {
    return userData[0].id;
  }
  const creatingUser = await createUser(email, firstName);

  return creatingUser;

  // return userData.length > 0 ? userData[0].id : await createUser(email, firstName);
};

/**
 * Create new room
 * @param { String } ownerId
 * @returns { Promise<Object | null> }
 */
const createRoom = async (ownerId) => {
  const randomString = randomstring.generate(
    {
      length: 10,
      charset: 'alphanumeric',
    },
  );

  const createNewRoom = await vecteraHttpClient.post(
    'meetings',
    {
      key: randomString,
      publicAccessLevel: 'should_knock',
      owner_id: ownerId,
    },
  );

  return createNewRoom.status === 201 ? createNewRoom.data : null;
};

/**
 * Get room ID room Key
 * @param { String } roomKey
 * @returns { Promise<String | null> }
 */
const getRoomIdByRoomKey = async (roomKey) => {
  const rooms = await vecteraHttpClient.get(`meetings/?search=${roomKey}`);

  return rooms.data.length > 0 ? rooms.data[0].id : null;
};

/**
 * Remove room by room key
 * @param { String } roomKey
 * @returns { Promise<boolean> }
 */
const removeRoom = async (roomKey) => {
  const roomId = await getRoomIdByRoomKey(roomKey);

  try {
    if (roomId) {
      const deleteRoom = await vecteraHttpClient.delete(`meetings/${roomId}`);
      return deleteRoom.status === 204;
    }

    return false;
  } catch (_) {
    return false;
  }
};

/**
 * Remove room by ID
 * @param { String } roomId
 * @returns { Promise<boolean> }
 */
const removeRoomById = async (roomId) => {
  try {
    const deleteRoom = await vecteraHttpClient.delete(`meetings/${roomId}`);

    return deleteRoom.status === 204;
  } catch (_) {
    return false;
  }
};

/**
 * Generate vectera user's login token
 * @param { String } vecteraUserId
 * @returns { Promise<String | null> }
 */
const createLoginToken = async (vecteraUserId) => {
  const getLoginToken = await vecteraHttpClient.post(`users/${vecteraUserId}/loginTokens`);

  return getLoginToken.status === 201 ? getLoginToken.data.url : null;
};

module.exports = {
  getOrCreateUser,
  createRoom,
  removeRoom,
  removeRoomById,
  createLoginToken,
};
