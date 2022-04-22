const httpStatus = require('http-status');
const { roleTypes } = require('../config/roles');
const {
  createReviewTutor,
  getReviewTutorByTutorId,
  deleteReviewTutorById,
  checkReview,
  getRatingTutorByTutorId,
  createRatingTutor,
  updateRating,
} = require('../services/reviewTutorService');
const { getRoleByName } = require('../services/roleService');
const { getScheduleById } = require('../services/scheduleService');
const { getUserByRole, getUserByIds } = require('../services/userService');
const ApiError = require('../utils/ApiError');

const createNewReviewTutor = async (req, res) => {
  const { body } = req;
  const { scheduleId } = body;
  const studentId = req.user.id;
  const schedule = await getScheduleById(scheduleId);
  let result;
  let code;
  if (!schedule) {
    result = 'Schedule not found';
    code = httpStatus.NOT_FOUND;
  } else {
    const check = await checkReview(scheduleId, studentId);
    if (check) {
      result = 'You have reviewed this class';
      code = httpStatus.BAD_REQUEST;
    } else {
      body.studentId = studentId;
      body.tutorId = schedule.teacherId;
      const reviewTutor = await createReviewTutor(body);
      result = reviewTutor;
      code = httpStatus.CREATED;

      const reviewed = await getReviewTutorByTutorId(body.tutorId);
      let rating = 0;
      let arrayLength = 0;
      reviewed.rows.forEach((e) => {
        rating += e.rating;
      });

      arrayLength = reviewed.rows.length;
      const averageRating = rating / arrayLength;

      const ratingTutor = await getRatingTutorByTutorId(body.tutorId);
      if (!ratingTutor) {
        const ratingTutorBody = {
          tutorId: body.tutorId,
          averageRating: parseFloat(averageRating.toFixed(1)),
        };
        await createRatingTutor(ratingTutorBody);
      } else {
        await updateRating(body.tutorId, parseFloat(averageRating.toFixed(1)));
      }
    }
  }

  res.sendWrapped(result, code);
};

const getReviewByTutor = async (req, res) => {
  const { tutorId } = req.query;

  const reviewtutor = await getReviewTutorByTutorId(tutorId);

  let rating = 0;
  let arrayLength = 0;
  reviewtutor.rows.forEach((e, i) => {
    rating += e.rating;
  });

  arrayLength = reviewtutor.rows.length;

  const averageRating = rating / arrayLength;

  const result = {
    reviewtutor,
    averageTutorRating: parseFloat(averageRating.toFixed(1)),
  };

  res.sendWrapped(result, httpStatus.OK);
};

const getRatingTutor = async (req, res) => {
  const { tutorId } = req.query;
  let tutor;
  let review;
  let result;

  if (tutorId) {
    tutor = await getUserByIds(tutorId);
    review = await getReviewTutorByTutorId(tutorId);
    result = {
      tutor,
      review,
    };
  } else {
    const role = await getRoleByName(roleTypes.TEACHER);
    tutor = await getUserByRole(role.id);
    result = tutor;
  }

  res.sendWrapped(result, httpStatus.OK);
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.query;
  const reviewTutor = await deleteReviewTutorById(reviewId);
  res.sendWrapped(reviewTutor, httpStatus.OK);
};

module.exports = {
  createNewReviewTutor,
  getReviewByTutor,
  deleteReview,
  getRatingTutor,
};
