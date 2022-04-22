const httpStatus = require('http-status');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const wishlistService = require('../services/wishlistService');
const { User } = require('../models/User');
const { WishlistItem } = require('../models/WishlistItem');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { UserDetail } = require('../models/UserDetail');
const { Wishlist } = require('../models/Wishlist');
const { Price } = require('../models/Price');
const ApiError = require('../utils/ApiError');
const days = require('../utils/day');
const dates = require('../utils/date');
const pagination = require('../utils/pagination');

const { OFFSET_ORDER_HOURS } = process.env;

const addWishlist = catchAsync(async (req, res) => {
  const { id } = req.user;
  const wishlistBody = req.body;

  const wishlist = await wishlistService.findOrCreateWishlist(
    id,
    wishlistBody.teacherId,
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
        },
      ],
    },
  );

  const dataWishlistItem = {
    teacherId: wishlistBody.teacherId,
    teacherSubjectId: wishlistBody.teacherSubjectId,
    availabilityHoursId: wishlistBody.availabilityHoursId,
    typeCourse: wishlistBody.typeCourse,
    dateTimeStart: moment(wishlistBody.dateTimeStart).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
    dateTimeEnd: moment(wishlistBody.dateTimeEnd).format('YYYY-MM-DD HH:mm:ss'),
  };

  // Cek apakah jam sekarang berseilih lebih dari 2 jam dari jadwal les
  const offsetHours = parseInt(OFFSET_ORDER_HOURS);
  const checkBetweenHours = await wishlistService.checkBetweenHours(
    dataWishlistItem.dateTimeStart,
    offsetHours,
  );

  if (!checkBetweenHours) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Penambahan wishlist maksimal ${offsetHours} jam sebelum kelas dimulai`,
    );
  }

  // Cek untuk melihat apakah sudah ada wishlist yang sama
  const ownWishlist = await wishlistService.getWishlistByStudentId(id);
  const mapWishlistId = ownWishlist.map((o) => o.id);

  const wishlistChecker = await wishlistService.checkerWishlist(
    wishlistBody.teacherId,
    mapWishlistId,
    wishlistBody.teacherSubjectId,
    wishlistBody.availabilityHoursId,
  );

  if (wishlistChecker) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Anda sudah memiliki wishlist ini.',
    );
  }

  const createWishlistItem = await wishlistService.createWishlistItem(
    wishlist[0].id,
    dataWishlistItem,
  );

  if (!createWishlistItem) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan item wishlist.');

  res.sendWrapped({ wishlist, createWishlistItem }, httpStatus.CREATED);
});

const getWishlist = catchAsync(async (req, res) => {
  let { page, limit } = req.query;
  const studentId = req.user.id;

  if (page) {
    parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    parseInt(limit);
  } else {
    limit = 10;
  }

  const wishlist = await wishlistService.getWishlistByStudentId(studentId, {
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
        include: {
          model: UserDetail,
          include: {
            model: Price,
          },
        },
      },
      {
        model: WishlistItem,
        include: [
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
          {
            model: AvailabilityHours,
          },
        ],
      },
    ],
  });

  // Ambil data original
  const originalData = JSON.stringify(wishlist);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  let privatePrice = 0;
  let groupPrice = 0;

  if (
    convertData.teacher
    && convertData.teacher.userDetail
    && convertData.teacher.userDetail.price
  ) {
    privatePrice = convertData.teacher.userDetail.price.private;
    groupPrice = convertData.teacher.userDetail.price.group;
  } else {
    const defaultPrice = await Price.findOne({
      where: {
        type: 'A',
      },
    });

    privatePrice = defaultPrice.private;
    groupPrice = defaultPrice.group;
  }

  const mapingData = convertData.map((o) => {
    const arrayWishlistItem = [];

    if (o.wishlistItems && o.wishlistItems.length > 0) {
      o.wishlistItems.map((itm) => {
        const convertDay = itm.availabilityHour
          ? days(itm.availabilityHour.dayCode)
          : days(moment(itm.dateTimeStart).day());
        const convertDate = itm.dateTimeStart ? dates(itm.dateTimeStart) : null;

        const dataWishlistItem = {
          wishlistItemId: itm.id,
          teacherSubjectId: itm.teacherSubjectId,
          availabilityHoursId: itm.availabilityHoursId,
          teacherId: itm.teacherId,
          subjectId: itm.teacherSubject.subjectId,
          gradeId: itm.teacherSubject.gradeId,
          gradeGroupId: itm.teacherSubject.grade.gradeGroupId,
          curriculumId: itm.teacherSubject.grade.gradeGroup.curriculumId,
          typeCourse: itm.typeCourse,
          date: `${convertDay}, ${convertDate}`,
          time: `${moment(itm.dateTimeStart).format('HH:mm')} - ${moment(
            itm.dateTimeEnd,
          ).format('HH:mm')}`,
          subject: itm.teacherSubject.subject.subjectName,
          grade: itm.teacherSubject.grade.gradeCode,
          gradeGroup: itm.teacherSubject.grade.gradeGroup.gradeGroupName,
          curriculum: itm.teacherSubject.grade.gradeGroup.curriculum.curriculumName,
          price: itm.typeCourse == 'private' ? privatePrice : groupPrice,
          createdAt: itm.createdAt,
          updatedAt: itm.updatedAt,
        };

        return arrayWishlistItem.push(dataWishlistItem);
      });
    }

    // Sorting isi item
    const sortingItem = arrayWishlistItem.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    const data = {
      wishlistId: o.id,
      studentId: o.studentId,
      teacherId: o.teacherId,
      student: `${o.student.firstName} ${o.student.lastName}`,
      teacher: `${o.teacher.firstName} ${o.teacher.lastName}`,
      wishlistItems: sortingItem,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  // Filter untuk menampikan data yang memiliki item wishlist
  const filteringItem = mapingData.filter((o) => o.wishlistItems.length > 0);
  // Sorting parent
  const sorting = filteringItem.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const paginateData = pagination.paginator(sorting, page, limit);

  res.sendWrapped('', httpStatus.OK, paginateData);
});

const getWihslistItemById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  const wishlist = await wishlistService.getWishlistItemById(id, studentId, {
    include: [
      {
        model: User,
        as: 'teacher',
        include: [
          {
            model: UserDetail,
            include: {
              model: Price,
            },
          },
        ],
      },
      {
        model: TeacherSubject,
        include: [
          {
            model: Subject,
          },
          {
            model: Grade,
          },
        ],
      },
      {
        model: AvailabilityHours,
      },
      {
        model: Wishlist,
        include: {
          model: User,
          as: 'student',
        },
      },
    ],
  });

  let privatePrice = 0;
  let groupPrice = 0;

  if (
    wishlist.teacher
    && wishlist.teacher.userDetail
    && wishlist.teacher.userDetail.price
  ) {
    privatePrice = wishlist.teacher.userDetail.price.private;
    groupPrice = wishlist.teacher.userDetail.price.group;
  } else {
    const defaultPrice = await Price.findOne({
      where: {
        type: 'A',
      },
    });

    privatePrice = defaultPrice.private;
    groupPrice = defaultPrice.group;
  }

  const convertDay = wishlist.availabilityHour
    ? days(wishlist.availabilityHour.dayCode)
    : days(moment(wishlist.dateTimeStart).day());
  const convertDate = wishlist.dateTimeStart
    ? dates(wishlist.dateTimeStart)
    : null;

  const data = {
    wishlistItemId: wishlist.id,
    teacherSubjectId: wishlist.teacherSubjectId,
    availabilityHoursId: wishlist.availabilityHoursId,
    teacherId: wishlist.teacherId,
    studentId: wishlist.wishlist.student.id,
    teacher: `${wishlist.teacher.firstName} ${wishlist.teacher.lastName}`,
    student: `${wishlist.wishlist.student.firstName} ${wishlist.wishlist.student.lastName}`,
    typeCourse: wishlist.typeCourse,
    date: `${convertDay}, ${convertDate}`,
    time: `${moment(wishlist.dateTimeStart).format('HH:mm')} - ${moment(
      wishlist.dateTimeEnd,
    ).format('HH:mm')}`,
    subject: wishlist.teacherSubject.subject.subjectName,
    grade: wishlist.teacherSubject.gradeName,
    price: wishlist.typeCourse == 'private' ? privatePrice : groupPrice,
    createdAt: wishlist.createdAt,
    updatedAt: wishlist.updatedAt,
  };

  res.sendWrapped(data, httpStatus.OK);
});

const deleteWishlistItemById = catchAsync(async (req, res) => {
  const arrayWishlistItemBody = req.body;

  if (!arrayWishlistItemBody && arrayWishlistItemBody.length <= 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Masukkan item dengan benar. Periksa kembali item yang ingin anda hapus.');

  let arrayWishlistItemId = [];

  for (const loopWishlist of arrayWishlistItemBody) {
    const wishlist = await wishlistService.getWishlistItemById(loopWishlist);

    if (!wishlist) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Tidak dapat menemukan item wishlist.',
      );
    }

    arrayWishlistItemId.push(wishlist.id);
  }

  const deleteWishlist = await wishlistService.deleteWishlistItemById(arrayWishlistItemId);

  if (!deleteWishlist) throw new ApiError(httpStatus.CONFLICT, 'Gagal menghapus item wishlist.');

  res.sendWrapped(deleteWishlist, httpStatus.OK);
});

module.exports = {
  addWishlist,
  getWishlist,
  getWihslistItemById,
  deleteWishlistItemById,
};
