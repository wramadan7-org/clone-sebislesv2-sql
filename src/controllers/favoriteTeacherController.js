const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pagination = require('../utils/pagination');

const favoriteTeacherService = require('../services/favoriteTeacherService');

const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');

const createFavorite = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { teacherId } = req.body;

  const checkFavorite = await favoriteTeacherService.getFavoriteByStudentAndTeacher(id, teacherId);

  if (checkFavorite) throw new ApiError(httpStatus.CONFLICT, 'Guru sudah ada di favorit Anda.');

  const favorite = await favoriteTeacherService.createFavorite(id, teacherId);

  if (!favorite) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan guru ke favorit.');

  res.sendWrapped(favorite, httpStatus.CREATED);
});

const getMyFavoriteTeacher = catchAsync(async (req, res) => {
  const { id } = req.user;
  let { page, limit, like } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  if (!like) {
    like = 1;
  } else if (like == 'true') {
    like = 1;
  } else if (like == 'false') {
    like = 0;
  }

  const favorite = await favoriteTeacherService.getMyFavoriteTeacher(
    id,
    like,
    {
      include: [
        {
          model: User,
          as: 'student',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'teacher',
          attributes: {
            exclude: ['password'],
          },
          include: [
            {
              model: UserDetail,
            },
            {
              model: TeacherSubject,
              include: [
                {
                  model: Subject,
                },
                {
                  model: Grade,
                  include: {
                    model: GradeGroup,
                    include: {
                      model: Curriculum,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  );

  // Sorting
  const sorting = favorite.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  // Pagination data
  const paginate = pagination.paginator(sorting, page, limit);

  res.sendWrapped('', httpStatus.OK, paginate);
});

const getAllFavoriteTeacher = catchAsync(async (req, res) => {
  let { page, limit, like } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  if (!like) {
    like = 1;
  } else if (like == 'true') {
    like = 1;
  } else if (like == 'false') {
    like = 0;
  }

  const favorite = await favoriteTeacherService.getAllFavoriteTeacher(
    like,
    {
      include: [
        {
          model: User,
          as: 'student',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'teacher',
          attributes: {
            exclude: ['password'],
          },
          include: [
            {
              model: UserDetail,
            },
            {
              model: TeacherSubject,
              include: [
                {
                  model: Subject,
                },
                {
                  model: Grade,
                  include: {
                    model: GradeGroup,
                    include: {
                      model: Curriculum,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  );

  // Sorting
  const sorting = favorite.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  // Pagination data
  const paginate = pagination.paginator(sorting, page, limit);

  res.sendWrapped('', httpStatus.OK, paginate);
});

const updateOrCreateFavoriteTeacher = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const favoriteBody = req.body;

  const checkFavorite = await favoriteTeacherService.getFavoriteByStudentAndTeacher(userId, favoriteBody.teacherId);

  if (!checkFavorite) {
    const create = await favoriteTeacherService.createFavorite(userId, favoriteBody.teacherId);

    return res.sendWrapped(create, httpStatus.CREATED);
  }

  const update = await favoriteTeacherService.updateFavoriteTeacher(checkFavorite.id, favoriteBody);

  res.sendWrapped(update, httpStatus.OK);
});

module.exports = {
  createFavorite,
  getMyFavoriteTeacher,
  getAllFavoriteTeacher,
  updateOrCreateFavoriteTeacher,
};
