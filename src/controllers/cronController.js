const httpStatus = require('http-status');
const moment = require('moment');
const { Op, Transaction } = require('sequelize');
const { schedule } = require('node-cron');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const { Schedule } = require('../models/Schedule');
const { TutoringTransaction } = require('../models/TutoringTransaction');
const { TutoringTransactionDetail } = require('../models/TutoringTransactionDetail');
const { Room } = require('../models/Room');
const { AvailabilityHours } = require('../models/AvailabilityHours');

const scheduleService = require('../services/scheduleService');
const userService = require('../services/userService');
const roomService = require('../services/roomService');

const vecteraHelper = require('../utils/vectera');

const {
  PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, PROCESS, DONE,
} = process.env;

const cronJobCartPendingTwoHoursBeforeLes = async () => {
  const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');
  const twoHoursBeforeLes = moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:00');
  const aDayBeforeNow = moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:00');

  const cartItem = await CartItem.findAll(
    {
      where: {
        [Op.or]: [
          {
            cartItemStatus: ACCEPT,
            startTime: twoHoursBeforeLes,
          },
          {
            cartItemStatus: ACCEPT,
            createdAt: aDayBeforeNow,
          },
          {
            cartItemStatus: ACCEPT,
            startTime: {
              [Op.lte]: dateNow,
            },
          },
        ],
      },
    },
  );

  if (cartItem || cartItem.length > 0) {
    const itemId = cartItem.map((o) => o.id);

    await CartItem.update(
      {
        cartItemStatus: EXPIRE,
      },
      {
        where: {
          id: {
            [Op.in]: itemId,
          },
        },
      },
    );
  }
};

const cronJobExpireScheduleLes = async (req, res) => {
  const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');
  const twoHoursBeforeLes = moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:00');
  const aDayBeforeNow = moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:00');

  const schedulePending = await Schedule.findAll(
    {
      where: {
        [Op.or]: [
          {
            dateSchedule: twoHoursBeforeLes,
            statusSchedule: PENDING,
          },
          {
            createdAt: aDayBeforeNow,
            statusSchedule: PENDING,
          },
          {
            dateSchedule: {
              [Op.lte]: dateNow,
            },
            statusSchedule: PENDING,
          },
        ],
      },
      include: [
        {
          model: TutoringTransactionDetail,
        },
      ],
    },
  );

  let arrayData = [];
  let valuesStudent = [];
  // let valuesTeacher = [];

  if (schedulePending || schedulePending.length > 0) {
    // update saldo murid
    for (const loopSchedule of schedulePending) {
      const data = {
        userId: loopSchedule.studentId,
        teacherId: loopSchedule.teacherId,
        price: loopSchedule.tutoringTransactionDetails.length ? loopSchedule.tutoringTransactionDetails[0].price : 0,
      };
      arrayData.push(data);
    }

    // get price by student
    const mapStudent = new Map(arrayData.map(({ userId, price }) => [userId, { userId, price: [] }]));
    for (let { userId, price } of arrayData) mapStudent.get(userId).price.push(...[price].flat());
    const resultStudent = [...mapStudent.values()];
    valuesStudent.push(...resultStudent);
    // console.log('value student', valuesStudent);

    // // get price by teacher
    // const mapTeacher = new Map(arrayData.map(({ teacherId, price }) => [teacherId, { teacherId, price: [] }]));
    // for (let { teacherId, price } of arrayData) mapTeacher.get(teacherId).price.push(...[price].flat());
    // const resultTeacher = [...mapTeacher.values()];
    // valuesTeacher.push(...resultTeacher);
    // // console.log('value teacher', valuesTeacher);

    for (const loopValues of valuesStudent) {
      const checkStudentCoin = await userService.getUserById(loopValues.userId);
      const sum = loopValues.price.reduce((paritalSum, a) => paritalSum + a, 0);
      const data = {
        userId: loopValues.userId,
        total: sum + checkStudentCoin.coin,
      };
      // console.log('data student', data);
      await userService.updateUserById(loopValues.userId, { coin: data.total });
    }

    // for (const loopValues of valuesTeacher) {
    //   const checkTeacherCoin = await userService.getUserById(loopValues.teacherId);
    //   const sum = loopValues.price.reduce((paritalSum, a) => paritalSum + a, 0);
    //   const data = {
    //     userId: loopValues.teacherId,
    //     total: checkTeacherCoin.coin - sum,
    //   };
    //   // console.log('teacher coin', checkTeacherCoin.coin);
    //   // console.log('price', loopValues.price);
    //   // console.log('coin', data.total.toString().startsWith('-') ? 0 : data.total);
    //   // console.log('data teacher', data);
    //   await userService.updateUserById(loopValues.teacherId, { coin: data.total.toString().startsWith('-') ? 0 : data.total });
    // }

    const mapScheduleId = schedulePending.map((o) => o.id);
    await Schedule.update(
      {
        statusSchedule: EXPIRE,
      },
      {
        where: {
          id: {
            [Op.in]: mapScheduleId,
          },
        },
      },
    );
  }
};

const cronJobDeleteVectera = async (req, res) => {
  const rooms = await roomService.getVecteraNotDelete(
    {
      include: [
        {
          model: Schedule,
          include: AvailabilityHours,
        },
      ],
    },
  );

  if (rooms && rooms.length > 0) {
    const filteringDate = rooms.filter((o) => {
      const dateSchedule = moment(o.schedule.dateSchedule).set('hours', o.schedule.availabilityHour.timeEnd.split(':')[0]).set('minutes', o.schedule.availabilityHour.timeEnd.split(':')[1]).format('YYYY-MM-DD HH:mm:ss');
      const now = moment().add(-5, 'minutes').format('YYYY-MM-DD HH:mm:ss');

      return dateSchedule < now;
    });

    for (const timing of filteringDate) {
      const execNow = async () => {
        const { id, meetingId, vecteraRoomId } = timing;

        let roomRemoved;
        if (vecteraRoomId) {
          roomRemoved = await vecteraHelper.removeRoomById(vecteraRoomId);
        } else {
          roomRemoved = await vecteraHelper.removeRoom(meetingId);
        }

        if (roomRemoved) {
          await roomService.updateStatusVecteraRoom(id);
        }
        await Room.update(
          {
            isActive: false,
          },
          {
            where: {
              id: timing.id,
            },
          },
        );

        await Schedule.update(
          {
            statusSchedule: DONE,
          },
          {
            where: {
              id: timing.scheduleId,
            },
          },
        );
      };
      execNow();
    }
  }
};

const cronJobReminderLess = async (req, res) => {
  const fiveMinutesBeforeLes = moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:00');

  const schedules = await Schedule.findAll(
    {
      where: {
        statusSchedule: ACCEPT,
      },
      include: Room,
    },
  );

  if (schedules.length > 0) {
    const filterRoom = schedules.filter((o) => moment(o.dateSchedule).format('YYYY-MM-DD HH:mm:ss') == fiveMinutesBeforeLes && o.room);

    const mapRoom = filterRoom.map((o) => o.id);

    await Room.update(
      {
        isActive: true,
      },
      {
        where: {
          id: mapRoom,
        },
      },
    );
  }
};

module.exports = {
  cronJobCartPendingTwoHoursBeforeLes,
  cronJobExpireScheduleLes,
  cronJobDeleteVectera,
  cronJobReminderLess,
};
