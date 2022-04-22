const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const referenceService = require('../services/referenceService');

const { User } = require('../models/User');
const { Reference } = require('../models/Reference');

const getAllReference = catchAsync(async (req, res) => {
  const references = await referenceService.getAllReference(
    {
      include: [
        {
          model: User,
        },
      ],
    },
  );

  if (!references && references.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Reference empty.');

  res.sendWrapped(references, httpStatus.OK);
});

const getReferenceById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const reference = await referenceService.getReferenceById(
    id,
    {
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    },
  );

  if (!reference) throw new ApiError(httpStatus.NOT_FOUND, 'Reference not found.');

  res.sendWrapped(reference, httpStatus.OK);
});

const getReferenceByUserRefer = catchAsync(async (req, res) => {
  const userRefer = req.user.id;

  const references = await referenceService.getReferenceByUserRefer(
    userRefer,
    {
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    },
  );

  if (!references && references.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Reference not found.');

  res.sendWrapped(references, httpStatus.OK);
});

const createReference = catchAsync(async (req, res) => {
  const userRefer = req.user.id;
  const referenceBody = req.body;

  const reference = await referenceService.createReference(userRefer, referenceBody);

  res.sendWrapped(reference, httpStatus.CREATED);
});

const updateReference = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userRefer = req.user.id;
  const referenceBody = req.body;

  const updated = await referenceService.updateReference(id, userRefer, referenceBody);

  res.sendWrapped(updated, httpStatus.OK);
});

const deleteReference = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deleted = await referenceService.deleteReference(id);

  res.sendWrapped(deleted, httpStatus.OK);
});

module.exports = {
  getAllReference,
  getReferenceById,
  getReferenceByUserRefer,
  createReference,
  updateReference,
  deleteReference,
};
