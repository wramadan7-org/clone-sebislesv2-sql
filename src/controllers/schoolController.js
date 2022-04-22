const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  createNewSchool,
  getSchoolByName,
  getAllSchool,
  getSchoolByAddress,
  updateSchoolById,
  deleteSchoolById,
} = require('../services/schoolService');

const createSchool = catchAsync(async (req, res) => {
  const schoolBody = req.body;
  const school = await createNewSchool(schoolBody);
  res.sendWrapped(school, httpStatus.CREATED);
});

const getSchool = catchAsync(async (req, res) => {
  const { schoolName, schoolAddress } = req.query;
  let school;

  if (schoolName) {
    school = await getSchoolByName(schoolName);
  } else if (schoolAddress) {
    school = await getSchoolByAddress(schoolAddress);
  } else {
    school = await getAllSchool();
  }

  res.sendWrapped(school, httpStatus.OK);
});

const updateSchool = catchAsync(async (req, res) => {
  const { id } = req.query;
  const { body } = req;
  const school = await updateSchoolById(id, body);
  console.log(body);
  res.sendWrapped(school, httpStatus.OK);
});

const deleteSchool = catchAsync(async (req, res) => {
  const { id } = req.query;
  await deleteSchoolById(id);
  res.sendWrapped('Sekolah berhasil di delete', httpStatus.OK);
});

module.exports = {
  createSchool,
  getSchool,
  updateSchool,
  deleteSchool,
};
