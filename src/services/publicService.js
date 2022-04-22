/* eslint-disable prefer-spread */
const httpStatus = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { Role } = require('../models/Role');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const { TeacherSubject } = require('../models/TeacherSubject');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Price } = require('../models/Price');
const { Duration } = require('../models/Duration');

const availabilityHoursService = require('./availabilityHoursService');

const nameDay = require('../utils/day');
const { paginator } = require('../utils/pagination');

const homePublic = async (search) => {
  let users;
  const teacherRole = await Role.findOne({
    where: {
      roleName: 'teacher',
    },
  });

  if (search) {
    users = await User.findAll({
      where: {
        roleId: teacherRole.id,
        [Op.or]: [
          {
            firstName: {
              [Op.like]: search,
            },
          },
          {
            lastName: {
              [Op.like]: search,
            },
          },
        ],
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: UserDetail,
          include: {
            model: Price,
          },
        },
        {
          model: TeacherSubject,
          include: [
            {
              model: Grade,
              include: {
                model: GradeGroup,
                include: {
                  model: Curriculum,
                },
              },
            },
            {
              model: Subject,
            },
          ],
        },
      ],
    });
  } else {
    users = await User.findAll({
      where: {
        roleId: teacherRole.id,
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: UserDetail,
          include: {
            model: Price,
          },
        },
        {
          model: TeacherSubject,
          include: [
            {
              model: Grade,
              include: {
                model: GradeGroup,
                include: {
                  model: Curriculum,
                },
              },
            },
            {
              model: Subject,
            },
          ],
        },
      ],
    });
  }

  return users;
};

const timeAvailabilityPublic = async (
  teacherId,
  month,
  year,
  duration,
  qday,
  page,
  limit,
  opts = {},
) => {
  const user = await User.findOne({
    where: {
      id: teacherId,
    },
    attributes: {
      exclude: 'password',
    },
    ...opts,
  });

  let privatePrice = 0;
  let groupPrice = 0;

  if (user.userDetail && user.userDetail.price) {
    privatePrice = user.userDetail.price.private;
    groupPrice = user.userDetail.price.group;
  } else {
    const defaultPrice = await Price.findOne({
      where: {
        type: 'A',
      },
    });

    privatePrice = defaultPrice.private;
    groupPrice = defaultPrice.group;
  }

  let arrayAvailabilityHours = [];

  let dayInMonth = moment(`${year}-${month}`).daysInMonth();

  while (dayInMonth) {
    const date = moment(`${year}-${month}-${dayInMonth}`).date(dayInMonth).format('YYYY-MM-DD');
    const day = moment(`${year}-${month}-${dayInMonth}`).date(dayInMonth).days();
    const namingDay = nameDay(day);

    const findDay = await AvailabilityHours.findAll({
      where: {
        dayCode: day,
        teacherId,
      },
      include: [
        {
          model: Duration,
        },
      ],
    });

    const originalDate = dayInMonth;

    if (findDay && findDay.length > 0) {
      const mapFindDay = findDay.map((o) => {
        const data = {
          date: `${namingDay}, ${date}`,
          ...o.dataValues,
          private: privatePrice,
          group: groupPrice,
          dateSort: date,
          originalDate,
        };

        return data;
      });

      const filteringDuration = mapFindDay.filter((o) => duration.some((s) => s.includes(o.duration.duration)));

      const filterDateFromNow = filteringDuration.filter((o) => (month == moment().format('M') ? o.originalDate >= moment().date() : o));

      const filterDay = filterDateFromNow.filter((o) => qday.some((s) => s.includes(o.dayCode)));

      arrayAvailabilityHours.push(filterDay);
    }

    dayInMonth--;
  }

  if (month <= moment().month()) arrayAvailabilityHours = [];

  const results = [].concat(...arrayAvailabilityHours);

  results.sort((a, b) => new Date(a.dateSort) - new Date(b.dateSort));

  const paginating = paginator(results, page, limit);

  return { user, ...paginating };
};

module.exports = {
  homePublic,
  timeAvailabilityPublic,
};
