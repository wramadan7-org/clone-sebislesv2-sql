const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { School } = require('../models/School');
const ApiError = require('../utils/ApiError');

const createNewSchool = async (schoolBody) => School.create(schoolBody);

const getSchoolById = async (schoolId, opts = {}) => {
  const school = School.findOne({
    where: {
      id: schoolId,
    },
    ...opts,
  });
  return school;
};

const getAllSchool = async (limit, offset) => {
  const school = await School.findAll({});
  return school;
};

const getSchoolByName = async (schoolName) => {
  const school = School.findAll({
    where: {
      schoolName: {
        [Op.like]: `%${schoolName}%`,
      },
    },
  });
  return school;
};

const getSchoolByAddress = async (schoolAddress) => {
  const school = School.findAll({
    where: {
      schoolAddress: {
        [Op.like]: `%${schoolAddress}%`,
      },
    },
  });
  return school;
};

const updateSchoolById = async (schoolId, schoolBody) => {
  const school = await getSchoolById(schoolId);
  if (!school) throw new ApiError(httpStatus.NOT_FOUND, 'School not found');
  Object.assign(school, schoolBody);
  school.save();
  return school;
};

const deleteSchoolById = async (schoolId) => {
  const school = await getSchoolById(schoolId);
  if (!school) throw new ApiError(httpStatus.NOT_FOUND, 'School not found');
  school.destroy();
  return school;
};
module.exports = {
  createNewSchool,
  getSchoolById,
  getSchoolByName,
  getSchoolByAddress,
  getAllSchool,
  updateSchoolById,
  deleteSchoolById,
};
