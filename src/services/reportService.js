const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Report } = require('../models/Reports');

/**
 * Create report
 * @param {string} scheduleId
 * @param {array} bodyReport
 * @returns array
 */
const createReport = async (scheduleId, bodyReport) => {
  const arrayReport = [];

  for (const loopReport of bodyReport) {
    const data = {
      scheduleId,
      ...loopReport,
      isReported: true,
    };

    arrayReport.push(data);
  }

  const create = await Report.bulkCreate(arrayReport);

  return create;
};

/**
 * Get all data report
 * @param {object} opts
 * @returns array
 */
const getAllReport = async (opts = {}) => Report.findAll({ ...opts });

/**
 * Get detail report
 * @param {string} id
 * @param {object} opts
 * @returns object
 */
const getReportById = async (id, opts = {}) => {
  const report = await Report.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return report;
};

/**
 * Update report
 * @param {string} id
 * @param {object} reportBody
 * @returns object
 */
const updateReport = async (id, reportBody) => {
  const update = await Report.update(
    reportBody,
    {
      where:
    {
      id,
    },
    },
  );

  if (!update) throw new ApiError(httpStatus.CONFLICT, 'Gagal memperbarui data report.');

  return update;
};

module.exports = {
  createReport,
  getAllReport,
  getReportById,
  updateReport,
};
