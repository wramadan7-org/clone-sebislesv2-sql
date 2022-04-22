const httpStatus = require('http-status');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const ApiError = require('../utils/ApiError');

/**
 * get grade group by id
 * @param {String} gradeGroupId
 * @param {Object} opts
 * @returns {Promise<Grade Group | ApiError>}
 */
const getGradeGroupById = async (gradeGroupId, opts = {}) => {
  const gradeGroup = await GradeGroup.findOne({
    where: {
      id: gradeGroupId,
    },
    ...opts,
  });
  if (!gradeGroup) throw new ApiError(httpStatus.NOT_FOUND, 'Grade group not found');
  return gradeGroup;
};

/**
 *
 * @param {String} gradeGroupCode
 * @param {object} opts
 * @returns {Promise<Grade Group | ApiError>}
 */
const getGradeGroupByCode = async (gradeGroupCode, opts = {}) => {
  const gradeGroup = await GradeGroup.findOne({
    where: {
      gradeGroupCode,
    },
    ...opts,
  });
  if (!gradeGroup) throw new ApiError(httpStatus.CONFLICT, 'Grade Group Not Found');
  return GradeGroup;
};

/**
 * get all grade group
 * @param {String} query
 * @param {Object} opts
 * @returns {Promise<Get All Group>}
 */
const getAllGradeGroup = async (query) => {
  const gradeGroup = await GradeGroup.findAll({
    where: query,
    include: [{ model: Curriculum }],
  });
  if (!gradeGroup) throw new ApiError(httpStatus.NOT_FOUND, 'Grade Group Not found');
  return gradeGroup;
};

/**
 * create grade group
 * @param {String} curriculumId
 * @param {String} gradeGroupBody
 * @returns {Promise<GradeGroup | void >}
 */
const createGradeGroup = async (gradeGroupBody) => {
  const checkGradeGroup = await GradeGroup.findOne({
    where: {
      gradeGroupCode: gradeGroupBody.gradeGroupCode,
    },
  });
  if (checkGradeGroup) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Grade Group with code ${gradeGroupBody.gradeGroupCode} already created`,
    );
  }
  const gradeGroup = await GradeGroup.create(gradeGroupBody);
  return gradeGroup;
};

/**
 * update grade group by id
 * @param {String} gradeGroupId
 * @param {String} gradeGroupBody
 * @returns {Promise<GradeGroup | ApiError>}
 */
const updateGradeGroupById = async (gradeGroupId, gradeGroupBody) => {
  const gradeGroup = await getGradeGroupById(gradeGroupId);

  Object.assign(gradeGroup, gradeGroupBody);
  await gradeGroup.save();

  return gradeGroup;
};

/**
 * delete grade group by id
 * @param {String} gradeGroupId
 * @returns {Promise<GradeGroup | ApiError>}
 */
const deleteGradeGroupByid = async (gradeGroupId) => {
  const gradeGroup = await getGradeGroupById(gradeGroupId);

  await gradeGroup.destroy();

  return gradeGroup;
};
module.exports = {
  getGradeGroupById,
  getAllGradeGroup,
  createGradeGroup,
  updateGradeGroupById,
  deleteGradeGroupByid,
  getGradeGroupByCode,
};
