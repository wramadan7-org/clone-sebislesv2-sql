const httpStatus = require('http-status');
const moment = require('moment');

const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const vecteraHelper = require('../utils/vectera');
const notif = require('../utils/notification');

const cartService = require('../services/cartService');
const scheduleService = require('../services/scheduleService');
const userService = require('../services/userService');
const roomService = require('../services/roomService');

const { Schedule } = require('../models/Schedule');
const { TutoringTransactionDetail } = require('../models/TutoringTransactionDetail');
const { CartItem } = require('../models/CartItem');

const {
  PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, PROCESS, DONE, DELETE,
} = process.env;

const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { model, status } = req.body;

  status = status.toLowerCase();
  model = model.toLowerCase();

  const validStatus = [PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, PROCESS, DONE, DELETE];

  if (validStatus.some((valid) => status.includes(valid))) {
    if (model == 'cart') {
      await cartService.getCartItemById(id);

      const updateCart = await CartItem.update(
        {
          cartItemStatus: status,
        },
        {
          where: {
            id,
          },
        },
      );

      if (!updateCart) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengganti status.');

      return res.sendWrapped(updateCart, httpStatus.OK);
    }

    if (model == 'schedule') {
      const schedule = await scheduleService.getScheduleById(id, { include: TutoringTransactionDetail });

      if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Jadwal les tidak ditemukan.');

      const student = await userService.getUserById(schedule.studentId);
      const teacher = await userService.getUserById(schedule.teacherId);

      if (!student) throw new ApiError(httpStatus.NOT_FOUND, 'Siswa tidak ditemukan');
      if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, 'Tutor tidak ditemukan');

      const validStatusUpdateReducePoint = [REJECT, CANCEL, EXPIRE, DELETE];
      const validStatusUpdateUnreducePoint = [PENDING, ACCEPT, PROCESS, DONE];

      if (validStatusUpdateReducePoint.some((o) => status.includes(o))) {
        const total = schedule.tutoringTransactionDetails[0].price + student.coin;

        const reduceCoin = await userService.updateUserById(student.id, { coin: total });

        if (!reduceCoin) throw new ApiError(httpStatus.CONFLICT, 'Gagal melakukan pengembalian koin Siswa');

        const updateSchedule = await Schedule.update(
          {
            statusSchedule: status,
          },
          {
            where: {
              id,
            },
          },
        );

        if (!updateSchedule) throw new ApiError(httpStatus.CONFLICT, 'Gagal merubah status jadwal les.');

        const data = {
          status,
          pengembalianKoin: schedule.tutoringTransactionDetails[0].price,
          koinSemula: student.coin,
          totalKoin: total,
        };

        return res.sendWrapped(data, httpStatus.OK);
      }

      if (validStatusUpdateUnreducePoint.some((o) => status.includes(o))) {
        const total = schedule.tutoringTransactionDetails[0].price + teacher.coin;

        let meetingId = null;
        let vecteraRoomId = null;

        if (status == ACCEPT) {
          const sumCoin = await userService.updateUserById(teacher.id, { coin: total });

          if (!sumCoin) throw new ApiError(httpStatus.CONFLICT, 'Gagal melakukan penambahan koin untuk Tutor');

          const vecteraEmail = teacher.email.replace(new RegExp('@.*$'), '@sebisles.com');
          const getVecteraUserId = await vecteraHelper.getOrCreateUser(vecteraEmail, teacher.firstName);

          if (!teacher.vecteraUserId) {
            teacher.vecteraUserId = getVecteraUserId;
            await teacher.save();
          }

          const createRoom = await vecteraHelper.createRoom(getVecteraUserId);
          if (createRoom) {
            meetingId = createRoom.key;
            vecteraRoomId = createRoom.id;

            const dataRoom = {
              meetingId,
              vecteraRoomId,
              scheduleId: id,
            };

            await roomService.createRoom(dataRoom);
          }
        }

        const updateStatusSchedule = await Schedule.update(
          {
            statusSchedule: status,
          },
          {
            where: {
              id,
            },
          },
        );

        if (!updateStatusSchedule) throw new ApiError(httpStatus.CONFLICT, 'Gagal merubah status jadwal les.');

        const data = {
          status,
          meetingId,
          vecteraRoomId,
          penambahanKoin: schedule.tutoringTransactionDetails[0].price,
          koinSemula: teacher.coin,
          totalKoin: total,
        };

        return res.sendWrapped(data, httpStatus.OK);
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Masukkan kategory antara cart dan schedule');
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Harap masukkan status dengan benar.');
  }
});

module.exports = {
  updateStatus,
};
