const httpStatus = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const { UserDetail } = require('../models/UserDetail');
const { Price } = require('../models/Price');
const { Grade } = require('../models/Grade');
const { Duration } = require('../models/Duration');

const publicService = require('../services/publicService');
const subjectService = require('../services/subjectService');
const gradeGroupService = require('../services/gradeGroupService');
const curriculumService = require('../services/curriculumService');

const { paginator } = require('../utils/pagination');

const {
  PENDING, ACCEPT, REJECT,
} = process.env;

const publicHome = catchAsync(async (req, res) => {
  let {
    page, limit, type, qgrade, qcurriculum, qsubject, qsearch,
  } = req.query;

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  let subject = await subjectService.getSubjectAll();
  let listGradeBahasa = ['pemula', 'menengah', 'lanjut'];
  let gradeGroup = await gradeGroupService.getAllGradeGroup();
  let curriculum = await curriculumService.getCurriculumQuery();

  if (qsubject) {
    subject = await subjectService.getSubjectAll(
      {
        id: qsubject,
      },
    );
  }

  if (qgrade) {
    gradeGroup = await gradeGroupService.getAllGradeGroup(
      {
        id: qgrade,
      },
    );

    if (gradeGroup.length <= 0) {
      gradeGroup = await Grade.findAll(
        {
          where: {
            id: qgrade,
          },
        },
      );
    }
  }

  if (qcurriculum) {
    curriculum = await curriculumService.getCurriculumQuery(
      {
        id: qcurriculum,
      },
    );
  }

  let mapSubjectId = subject.map((o) => o.id);
  let mapGradeGroupId = gradeGroup.map((o) => o.id);
  let mapCurriculumId = curriculum.map((o) => o.id);

  const home = await publicService.homePublic(qsearch);

  // Ambil data original
  const originalData = JSON.stringify(home);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  if (!convertData || convertData.length <= 0) return res.sendWrapped(null, httpStatus.OK, paginator([], page, limit));

  // kelas bahasa
  if (type == 'bahasa') {
    if (qsubject) {
      subject = await subjectService.getSubjectAll(
        {
          id: qsubject,
        },
      );
    } else {
      subject = await subjectService.getSubjectAll(
        {
          subjectCode: {
            [Op.and]: [
              {
                [Op.like]: '%bahasa%',
              },
              {
                [Op.notLike]: '%bahasa indonesia%',
              },
            ],
          },
        },
      );
    }

    if (qgrade) {
      gradeGroup = await gradeGroupService.getAllGradeGroup(
        {
          id: qgrade,
        },
      );

      if (gradeGroup.length <= 0) {
        gradeGroup = await Grade.findAll(
          {
            where: {
              id: qgrade,
            },
          },
        );
      }
    } else {
      gradeGroup = await gradeGroupService.getAllGradeGroup(
        {
          gradeGroupCode: {
            [Op.in]: listGradeBahasa,
          },
        },
      );
    }

    mapSubjectId = subject.map((o) => o.id);
    mapGradeGroupId = gradeGroup.map((o) => o.id);

    const filterBahasa = convertData.map((o) => {
      const filteringSubject = o.teacherSubjects.filter((v) => (v.status === true && v.request === ACCEPT && mapSubjectId.some((s) => v.subjectId.includes(s)) && (mapGradeGroupId.some((g) => v.gradeId.includes(g)) || mapGradeGroupId.some((g) => v.grade.gradeGroupId.includes(g))) && mapCurriculumId.some((c) => v.grade.gradeGroup.curriculumId.includes(c))));

      if (filteringSubject.length) {
        const data = {
          id: o.id,
          email: o.email,
          phoneNumber: o.phoneNumber,
          gender: o.gender,
          firstName: o.firstName,
          lastName: o.lastName,
          referralCode: o.referralCode,
          profile: o.profile,
          referredBy: o.referredBy,
          temporaryPeopleId: o.temporaryPeopleId,
          temporaryIdentityId: o.temporaryIdentityId,
          note: o.note,
          isVerified: o.isVerified,
          coin: o.coin,
          url: o.url,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          deletedAt: o.deletedAt,
          roleId: o.roleId,
          schoolId: o.schoolId,
          userDetail: o.userDetail,
          teacherSubjects: filteringSubject ? filteringSubject : [],
        };
        return data;
      }

      return null;
    }).filter((notNull) => notNull);

    const resultBahasa = filterBahasa.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    const paginatingBahasa = paginator(resultBahasa, page, limit);

    return res.sendWrapped('', httpStatus.OK, paginatingBahasa);
  }

  const defaultData = convertData.map((o) => {
    const filteringSubject = o.teacherSubjects.filter((v) => (v.status === true && v.request === ACCEPT && mapSubjectId.some((s) => v.subjectId.includes(s)) && (mapGradeGroupId.some((g) => v.gradeId.includes(g)) || mapGradeGroupId.some((g) => v.grade.gradeGroupId.includes(g))) && mapCurriculumId.some((c) => v.grade.gradeGroup.curriculumId.includes(c))));

    if (filteringSubject.length) {
      const data = {
        id: o.id,
        email: o.email,
        phoneNumber: o.phoneNumber,
        gender: o.gender,
        firstName: o.firstName,
        lastName: o.lastName,
        referralCode: o.referralCode,
        profile: o.profile,
        referredBy: o.referredBy,
        temporaryPeopleId: o.temporaryPeopleId,
        temporaryIdentityId: o.temporaryIdentityId,
        note: o.note,
        isVerified: o.isVerified,
        coin: o.coin,
        url: o.url,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        deletedAt: o.deletedAt,
        roleId: o.roleId,
        schoolId: o.schoolId,
        userDetail: o.userDetail,
        teacherSubjects: filteringSubject ? filteringSubject : [],
      };
      return data;
    }

    return null;
  }).filter((notNull) => notNull);

  const results = defaultData.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const paginating = paginator(results, page, limit);

  if (!paginating || paginating.data.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'List tutor masih kosong.');

  res.sendWrapped(null, httpStatus.OK, paginating);
});

const availabilityHours = catchAsync(async (req, res) => {
  const { teacherId } = req.params;
  let {
    month, page, limit, duration, day,
  } = req.query;

  let theMonth;

  if (!month) {
    theMonth = moment().format('M');
  } else {
    theMonth = parseInt(month);
  }

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

  if (!duration) {
    const getDuration = await Duration.findAll();
    duration = getDuration.map((o) => o.duration.toString());
  } else {
    duration = [duration];
  }

  if (!day) {
    day = ['0', '1', '2', '3', '4', '5', '6'];
  } else {
    day = [day];
  }

  const year = moment().format('YYYY');

  const availabilityHoursTutor = await publicService.timeAvailabilityPublic(
    teacherId,
    theMonth,
    year,
    duration,
    day,
    page,
    limit,
    {
      include: [
        {
          model: UserDetail,
          include: Price,
        },
      ],
    },
  );

  if (!availabilityHoursTutor) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Tutor belum memiliki jadwal.',
    );
  }

  res.sendWrapped(null, httpStatus.OK, availabilityHoursTutor);
});

module.exports = {
  publicHome,
  availabilityHours,
};
