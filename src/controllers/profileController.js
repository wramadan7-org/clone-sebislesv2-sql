const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const userDetailService = require('../services/userDetailService');
const ApiError = require('../utils/ApiError');

const currentProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  // const user = await userService.getUserById(userId, {
  //   opts: { include: ['school'] },
  // });

  const user = await userDetailService.getUserDetailByUserId(userId, {
    include: 'user',
  });
  res.sendWrapped(user, httpStatus.OK);
});

const createUserDetail = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const priceId = req.body;
  const userDetail = await userDetailService.createUserDetail(userId, priceId);

  if (!userDetail) throw new ApiError(httpStatus.CONFLICT, 'Gagal membuat detail profile');

  res.sendWrapped(userDetail, httpStatus.CREATED);
});

const updateUserDetail = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { body } = req;
  await userDetailService.updateUserDetailByUserId(id, body);
  const userDetail = await userDetailService.getUserDetailByUserId(id);
  res.sendWrapped(userDetail, httpStatus.OK);
});

// const deleteUserDetail = catchAsync(async (req, res) => {
//   const { id } = req.user;
//   await userDetailService.deleteUserDetailById();
// });

module.exports = {
  currentProfile,
  createUserDetail,
  updateUserDetail,
};
