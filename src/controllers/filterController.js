const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { paginator } = require('../utils/pagination');

const curriculumService = require('../services/curriculumService');
const filterService = require('../services/filterService');
const teacherSubjectService = require('../services/teacherSubjectService');
const availabilityHoursService = require('../services/availabilityHoursService');

const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { Price } = require('../models/Price');
const { Schedule } = require('../models/Schedule');
const { AvailabilityHours } = require('../models/AvailabilityHours');

const { DONE } = process.env;

const filterLes = catchAsync(async (req, res) => {
  const { curriculum } = req.body;

  await curriculumService.getCurriculumById(curriculum);

  const filter = await filterService.filterLes(curriculum);

  res.sendWrapped(filter, httpStatus.OK);
});

const recommendTutor = catchAsync(async (req, res) => {
  const { teacherSubjectId, teacherId, availabilityHoursId } = req.params;
  let { page, limit } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 5;
  }

  const teacherSubject = await teacherSubjectService.getTeacherSubjectById(teacherId, teacherSubjectId);

  if (!teacherSubject) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan jadwal');

  const recommended = await teacherSubjectService.getRecommendTutor(
    teacherId,
    teacherSubject.subjectId,
    teacherSubject.gradeId,
    {
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
            {
              model: AvailabilityHours,
            },
          ],
        },
      ],
    },
  );

  const defaultPrice = await Price.findOne(
    {
      where: {
        type: 'A',
      },
    },
  );

  const availabilityHourses = await availabilityHoursService.getTutorScheduleTimeById(availabilityHoursId, teacherId);

  if (!availabilityHourses) {
    return res.sendWrapped(
      {
        status: 200,
        totalData: 0,
        currentPage: 1,
        totalPages: 1,
        limitPage: 50,
        prevPage: null,
        nextPage: null,
        data: [],
      },
    );
  }

  const filterRecommended = recommended.filter((o) => (o.teacher && o.teacher.availabilityHours.some((s) => s.dayCode === availabilityHourses.dayCode && s.timeStart === availabilityHourses.timeStart)));

  let arrayRecommend = [];

  for (const loopRecommend of filterRecommended) {
    const sumSchedule = await Schedule.findAll(
      {
        where: {
          teacherId: loopRecommend.teacherId,
          statusSchedule: DONE,
        },
      },
    );

    let idAvailabilityHours = null;
    let day = null;
    let timeStart = null;

    loopRecommend.teacher.availabilityHours.filter((o) => {
      if (o.dayCode === availabilityHourses.dayCode && o.timeStart === availabilityHourses.timeStart) {
        idAvailabilityHours = o.id;
        day = o.dayCode;
        timeStart = o.timeStart;
      }

      return null;
    });

    const data = {
      teacherSubjectId: loopRecommend.id,
      subjectId: loopRecommend.subjectId,
      gradeId: loopRecommend.gradeId,
      teacherId: loopRecommend.teacherId,
      teacherDetailId: loopRecommend.teacher.userDetail.id ? loopRecommend.teacher.userDetail.id : null,
      availabilityHoursId: idAvailabilityHours,
      profile: loopRecommend.teacher.profile,
      name: `${loopRecommend.teacher.firstName} ${loopRecommend.teacher.lastName}`,
      price: loopRecommend.teacher.userDetail.price ? `${loopRecommend.teacher.userDetail.price.private}/${loopRecommend.teacher.userDetail.price.group}` : defaultPrice ? `${defaultPrice.private}/${defaultPrice.group}` : null,
      totalClass: sumSchedule ? sumSchedule.length : 0,
      day,
      timeStart,
    };

    arrayRecommend.push(data);
  }

  arrayRecommend = [...new Map(arrayRecommend.map((item) => [item.teacherId, item])).values()];

  const sorting = arrayRecommend.sort((a, b) => new Date(b.totalClass) - new Date(a.totalClass));

  const pagination = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, pagination);
});

module.exports = {
  filterLes,
  recommendTutor,
};
