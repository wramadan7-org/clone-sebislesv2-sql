const httpStatus = require('http-status');
const { ReviewTutor } = require('../models/ReviewTutor');
const { RatingTutor } = require('../models/RatingTutor');
const ApiError = require('../utils/ApiError');

const getReviewTutorById = async (reviewTutorId, opts) => {
  const reviewTutor = ReviewTutor.findOne({
    where: {
      id: reviewTutorId,
    },
    ...opts,
  });
  return reviewTutor;
};

const checkReview = async (scheduleId, studentId) => {
  const reviewTutor = ReviewTutor.findOne({
    where: {
      scheduleId,
      studentId,
    },
  });

  return reviewTutor;
};

const getReviewTutorByTutorId = async (tutorId) => {
  const reviewTutor = ReviewTutor.findAndCountAll({
    where: {
      tutorId,
    },
  });

  if (!reviewTutor) throw new ApiError(httpStatus.NOT_FOUND, 'Tutor belum di review');
  return reviewTutor;
};
const getReviewTutorBy = async (tutorId) => {
  const reviewTutor = ReviewTutor.findAll({
    where: {
      tutorId,
    },
  });
  return reviewTutor;
};

const createReviewTutor = async (reviewBody) => {
  const reviewTutor = await ReviewTutor.create(reviewBody);
  return reviewTutor;
};

const getRatingTutorByTutorId = async (tutorId) => {
  const ratingTutor = await RatingTutor.findOne({
    where: {
      tutorId,
    },
  });
  return ratingTutor;
};
const createRatingTutor = async (ratingBody) => {
  const ratingTutor = await RatingTutor.create(ratingBody);
  return ratingTutor;
};

const updateRating = async (tutorId, rating) => {
  const ratingTutor = await RatingTutor.update(
    {
      averageRating: rating,
    },
    { where: { tutorId } },
  );
  return ratingTutor;
};

const deleteReviewTutorById = async (reviewId) => {
  const reviewTutor = await getReviewTutorById(reviewId);
  if (!reviewTutor) throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  reviewTutor.destroy();
  return reviewTutor;
};

module.exports = {
  createReviewTutor,
  getReviewTutorById,
  deleteReviewTutorById,
  getReviewTutorByTutorId,
  checkReview,
  getReviewTutorBy,
  createRatingTutor,
  updateRating,
  getRatingTutorByTutorId,
};
