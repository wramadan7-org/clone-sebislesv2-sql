const httpStatus = require('http-status');

const { AssessmentTeacher } = require('../models/AssessmentTeacher');
const ApiError = require('../utils/ApiError');

/**
 * Create data assessment
 * @param { String } userId
 * @param { Object } body
 * @returns { Promise<Object | null> }
 */
const createAssessment = async (userId, body) => {
  const data = {
    userId,
    ...body,
  };

  const assessment = await AssessmentTeacher.create(data);

  return assessment;
};

/**
 * Get all data assessment
 * @param { Object } opts
 * @returns { Promise<Array> }
 */
const getAllAssessment = async (opts = {}) => AssessmentTeacher.findAll({ ...opts });

/**
 * Get assessment by userId
 * @param { String } userId
 * @param { Object } opts
 * @returns { Promise<Object | null> }
 */
const getAssessmentByUserId = async (userId, opts = {}) => {
  const assessment = await AssessmentTeacher.findOne(
    {
      where: {
        userId,
      },
    },
  );

  return assessment;
};

/**
 * Get assessment by id
 * @param { String } id
 * @param { String } opts
 * @returns { Promise<Object | null >}
 */
const getAssessmentById = async (id, opts = {}) => {
  const assessment = await AssessmentTeacher.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return assessment;
};

/**
 * Update assessment
 * @param { String } id
 * @param { Object } body
 * @returns { Promise<Object | null > }
 */
const updateAssessment = async (id, body) => {
  const assessment = await getAssessmentById(id);

  if (!assessment) throw new ApiError(httpStatus.NOT_FOUND, 'Data tidak dapat ditemukan.');

  Object.assign(assessment, body);
  await assessment.save();
  return assessment;
};

module.exports = {
  createAssessment,
  getAllAssessment,
  getAssessmentByUserId,
  getAssessmentById,
  updateAssessment,
};
