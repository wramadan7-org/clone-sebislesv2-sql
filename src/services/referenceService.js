const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Reference } = require('../models/Reference');

/**
 * Get all references
 * @returns array of object
 */
const getAllReference = async (opts = {}) => {
  const references = await Reference.findAll(
    {
      ...opts,
    },
  );

  return references;
};

/**
 * Get reference by Id
 * @param {uuidv4} id
 * @returns object
 */
const getReferenceById = async (id, opts = {}) => {
  const references = await Reference.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return references;
};

/**
 * Get reference by userRefer
 * @param {uuidv4} userRefer
 * @returns array of object
 */
const getReferenceByUserRefer = async (userRefer, opts = {}) => {
  const references = await Reference.findAll(
    {
      where: {
        userRefer,
      },
      ...opts,
    },
  );

  return references;
};

/**
 * Create references
 * @param {uuidv4} userRefer
 * @param {object || array of object} referenceBody
 * @returns object || array of object
 */
const createReference = async (userRefer, referenceBody) => {
  const checkReference = await getReferenceByUserRefer(userRefer);
  console.log(userRefer);
  if (checkReference && checkReference.length > 0) throw new ApiError(httpStatus.CONFLICT, 'You already have reference people.');

  let arrayResults = [];

  for (const loopReferenceBody of referenceBody) {
    const data = {
      ...loopReferenceBody,
      userRefer,
    };

    arrayResults.push(data);
  }

  const reference = await Reference.bulkCreate(arrayResults);

  return reference;
};

/**
 * Update reference
 * @param {uuidv4} id
 * @param {uuidv4} userRefer
 * @param {object} referenceBody
 * @returns object
 */
const updateReference = async (id, userRefer, referenceBody) => {
  const reference = await getReferenceById(id);

  if (!reference) throw new ApiError(httpStatus.NOT_FOUND, 'Reference not found');

  Object.assign(reference, referenceBody);
  reference.save();

  return reference;
};

/**
 * Delete reference
 * @param {uuidv4} id
 * @returns object
 */
const deleteReference = async (id) => {
  const reference = await getReferenceById(id);

  if (!reference) throw new ApiError(httpStatus.NOT_FOUND, 'Reference not found.');

  reference.destroy();

  return reference;
};

module.exports = {
  getAllReference,
  getReferenceById,
  getReferenceByUserRefer,
  createReference,
  updateReference,
  deleteReference,
};
