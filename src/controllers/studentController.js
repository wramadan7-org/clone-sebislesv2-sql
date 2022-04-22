const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
// const cartService = require('../services/cartService');
const {
  getUserById,
  updateUserById,
  getUserByIds,
  updateProfile,
} = require('../services/userService');
const { updateUserDetailByUserId } = require('../services/userDetailService');
const { createNewSchool, updateSchoolById } = require('../services/schoolService');
const multering = require('../utils/multer');
const resizing = require('../utils/resizeImage');

const topupCoinService = require('../services/topupCoinService');

const { School } = require('../models/School');

const getCurrentStudentProfile = catchAsync(async (req, res) => {
  const { id } = req.user;

  const student = await getUserByIds(id);

  const parse = JSON.parse(JSON.stringify(student));

  const topup = await topupCoinService.ownTopupCoin(id);

  const invalidReferral = topup.some((o) => o.referralCode);

  Object.assign(parse, { validReferral: invalidReferral ? false : true });

  res.sendWrapped(parse, httpStatus.OK);
});

const updateCurrentStudentProfie = catchAsync(async (req, res) => {
  const { id, email } = req.user;
  let { body } = req;

  body.email = email;

  const dataBody = {
    ...body,
    userDetail: {
      city: body.city,
    },
    school: {
      schoolName: body.schoolName ? body.schoolName : null,
    },
  };
  await updateUserById(id, dataBody);
  await updateUserDetailByUserId(id, dataBody.userDetail);
  const student = await getUserByIds(id);
  res.sendWrapped(student, httpStatus.OK);
});

const createdFilesProfile = catchAsync(async (req, res) => {
  const studentId = req.user.id;
  const destination = 'images/profile';

  multering.options('./', studentId).single('fileProfile')(
    req,
    res,
    async (err) => {
      if (err) {
        return res.sendWrapped(err);
      }

      if (!req.file || !req.file.filename) {
        return res.sendWrapped(
          'Please insert file/photo!',
          httpStatus.BAD_REQUEST,
        );
      }

      const profile = await updateProfile(
        studentId,
        `static/${destination}/${req.file.filename}`,
      );

      await resizing(
        req.file.path,
        200,
        200,
        90,
        `./public/${destination}/${req.file.filename}`,
      );

      res.sendWrapped(profile, httpStatus.OK);
    },
  );
});

module.exports = {
  //   viewCart,
  getCurrentStudentProfile,
  updateCurrentStudentProfie,
  createdFilesProfile,
};
