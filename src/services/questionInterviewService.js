const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { InterviewQuestion } = require('../models/InterviewReport');

/**
 * Create interview report
 * @param { Object } interviewBody
 */
const createInterview = async (interviewBody) => {
  const interview = await InterviewQuestion.create(interviewBody);

  return interview;
};

/**
 * Get all data interview
 * @param { Object } opts
 * @returns { Promise<Array> }
 */
const getAllInterview = async (opts = {}) => {
  const interview = await InterviewQuestion.findAll({ ...opts });

  return interview;
};

/**
 * Get interview report by userId
 * @param { String } userId
 * @param { Object } opts
 * @returns { Promise<Object> }
 */
const getInterviewReportByUserId = async (userId, opts = {}) => InterviewQuestion.findOne({ where: { userId }, ...opts });

/**
 * Get interview report by id
 * @param { String } id
 * @param { Object } opts
 * @returns { Promise<Object> }
 */
const getInterviewReportById = async (id, opts = {}) => InterviewQuestion.findOne({ where: { id }, ...opts });

const updateInterviewReport = async (id, interviewBody) => {
  const interview = await getInterviewReportById(id);

  if (!interview) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan laporan.');

  Object.assign(interview, interviewBody);
  await interview.save();

  return interview;
};

module.exports = {
  createInterview,
  getAllInterview,
  getInterviewReportByUserId,
  getInterviewReportById,
  updateInterviewReport,
};
