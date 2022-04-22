const httpStatus = require('http-status');
const moment = require('moment');
const Joi = require('joi');
const { Op } = require('sequelize');
const { condition } = require('sequelize');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const scheduleService = require('../services/scheduleService');
const cartService = require('../services/cartService');
const userService = require('../services/userService');
const userDetailService = require('../services/userDetailService');
const priceService = require('../services/priceService');
const tutoringTransactionService = require('../services/tutoringTransactionService');
const roomService = require('../services/roomService');
const reasonService = require('../services/reasonService');
const ApiError = require('../utils/ApiError');
const multering = require('../utils/multer');
const resizing = require('../utils/resizeImage');
const statusScheduleForTutor = require('../utils/statusForTutor');

const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Price } = require('../models/Price');
const { TutoringTransactionDetail } = require('../models/TutoringTransactionDetail');
const { Schedule } = require('../models/Schedule');
const { Room } = require('../models/Room');

const pagination = require('../utils/pagination');
const dates = require('../utils/date');
const days = require('../utils/day');
const statusLes = require('../utils/statusSchedule');
const statusForTutor = require('../utils/statusForTutor');
const vecteraHelper = require('../utils/vectera');

const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

const createSchedule = catchAsync(async (req, res) => {
  const { id } = req.user;
  const scheduleBody = req.body;

  if (scheduleBody.length <= 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Masukkan data dengan benar.');

  const user = await userService.getUserById(id);

  const arrayDataBody = [];
  let discount = 0;
  let subtotal = 0;
  let total = 0;

  const conditionStatus = [
    PENDING,
    REJECT,
    CANCEL,
    PROCESS,
    EXPIRE,
    DONE,
    DELETE,
  ];

  for (const loopBody of scheduleBody) {
    const checkCart = await cartService.getCartItemById(loopBody, {
      include: [
        {
          model: Cart,
          include: [
            {
              model: User,
              as: 'student',
            },
            {
              model: User,
              as: 'teacher',
              include: {
                model: UserDetail,
                include: {
                  model: Price,
                },
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
      ],
    });

    if (conditionStatus.some((value) => checkCart.cartItemStatus.includes(value))) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Hanya bisa menambah item yang sudah di setujui oleh guru.',
      );
    }

    let pricePrivate = 0;
    let priceGroup = 0;

    // Cek harga
    if (checkCart.cart.teacher.userDetail && checkCart.cart.teacher.userDetail.price) {
      pricePrivate = checkCart.cart.teacher.userDetail.price.private;
      priceGroup = checkCart.cart.teacher.userDetail.price.group;
    } else {
      const pricing = await Price.findOne({
        where: {
          type: 'A',
        },
      });

      pricePrivate = pricing.private;
      priceGroup = pricing.group;
    }

    const dataBody = {
      dateSchedule: moment(checkCart.startTime).format('YYYY-MM-DD HH:mm:ss'),
      typeClass: checkCart.typeCourse,
      statusSchedule: PENDING,
      teacherSubjectId: checkCart.teacherSubjectId,
      availabilityHoursId: checkCart.availabilityHoursId,
      teacherId: checkCart.teacherId,
      studentId: checkCart.cart.studentId,
      requestMaterial: checkCart.requestMaterial
        ? checkCart.requestMaterial
        : null,
      imageMaterial: checkCart.imageMaterial ? checkCart.imageMaterial : null,
      price: checkCart.typeCourse == 'private' ? pricePrivate : priceGroup,
      // data untuk transaksi detail
      teacherName: `${checkCart.cart.teacher.firstName} ${checkCart.cart.teacher.lastName}`,
      lessonSchedule: checkCart.startTime,
      subject: checkCart.teacherSubject.subject.subjectName,
      grade: checkCart.teacherSubject.grade.gradeName,
      discount,
      friend1: checkCart.friend1 ? checkCart.friend1 : null,
      friend2: checkCart.friend2 ? checkCart.friend2 : null,
    };

    subtotal += Math.abs((discount / 100) * dataBody.price - dataBody.price);
    total += dataBody.price;
    arrayDataBody.push(dataBody);
  }

  const dataTransaction = {
    statusTransaction: DONE,
    discount,
    subtotal,
    total,
    paid: user.coin,
  };

  if (user.coin < total) throw new ApiError(httpStatus.CONFLICT, 'Ups... Sebis Koin-mu tidak mencukupi untuk Beli kelas ini. Yuk... beli Sebis Koin dulu.');

  const schedule = await scheduleService.createSchedule(arrayDataBody);

  if (!schedule) throw new ApiError(httpStatus.CONFLICT, 'Gagal membuat jadwal les. Harap hubungi administrator kita.');

  const transaction = await tutoringTransactionService.createTransactionLes(
    id,
    dataTransaction,
  );

  if (!transaction) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal membuat transaksi');

  const arrayDataTransactionDetail = [];

  for (const loopForTransactionDetail of schedule) {
    const dataTransactionDetail = {
      tutoringTransactionId: transaction.dataValues.id,
      scheduleId: loopForTransactionDetail.schedule.dataValues.id,
      teacherId: loopForTransactionDetail.schedule.teacherId,
      teacherName: loopForTransactionDetail.body.teacherName,
      lessonSchedule: loopForTransactionDetail.body.lessonSchedule,
      subject: loopForTransactionDetail.body.subject,
      grade: loopForTransactionDetail.body.grade,
      discount: loopForTransactionDetail.body.discount,
      price: loopForTransactionDetail.body.price,
    };

    arrayDataTransactionDetail.push(dataTransactionDetail);
  }

  const transactionDetail = await tutoringTransactionService.createTransactionDetailLes(
    arrayDataTransactionDetail,
  );

  if (!transactionDetail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Gagal membuat transaksi detail.',
    );
  }

  const paying = user.coin - total;

  const updatePoint = await userService.updateUserById(id, {
    coin: paying,
  });

  if (!updatePoint) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengupdate saldo.');

  await CartItem.update(
    {
      cartItemStatus: DONE,
    },
    {
      where: {
        id: {
          [Op.in]: scheduleBody,
        },
      },
    },
  );

  res.sendWrapped(arrayDataTransactionDetail, httpStatus.CREATED);

  /* Proccess after success payment

  if (arrayDataTransactionDetail.length > 0) {
    for (const loopData of arrayDataTransactionDetail) {
      const execNow = async () => {
        const teacher = await userService.getUserById(loopData.teacherId);

        const teacherCoin = teacher.coin + loopData.price;

        await userService.updateUserById(
          loopData.teacherId,
          {
            coin: teacherCoin,
          },
        );

        const vecteraEmail = teacher.email.replace(new RegExp('@.*$'), '@sebisles.com');
        const getVecteraUserId = await vecteraHelper.getOrCreateUser(vecteraEmail, teacher.firstName);

        if (!teacher.vecteraUserId) {
          teacher.vecteraUserId = getVecteraUserId;
          await teacher.save();
        }

        let meetingId = null;
        let vecteraRoomId = null;

        const createRoom = await vecteraHelper.createRoom(getVecteraUserId);

        if (createRoom) {
          meetingId = createRoom.key;
          vecteraRoomId = createRoom.id;

          const dataRoom = {
            meetingId,
            vecteraRoomId,
            scheduleId: loopData.scheduleId,
            isActive: false,
            isVecteraDeleted: false,
          };

          await roomService.createRoom(dataRoom);
        }
      };
      execNow();
    }
  }
  */

  /* Old logic
    const user = await userService.getUserById(id);
    const teacherPrice = await userDetailService.getUserDetailByUserId(
      scheduleBody.teacherId,
      {
        include: Price,
      },
    );

      {
        "dateSchedule": "2022-01-30",
        "typeClass": "group",
        "statusSchedule": "pending",
        "teacherSubjectId": "55b29349-ddde-4340-88ed-432ef36022b5",
        "availabilityHoursId": "44cd1374-1811-44ab-a018-5642ca5d181d",
        "teacherId": "14c8ca1d-3405-4535-bf6a-7d117a092926",
        "studentId": "a9ef338f-9003-4685-86cb-6fa80856ffe0"
    }

    if (!teacherPrice) throw new ApiError(httpStatus.NOT_FOUND, 'Tutor belum melengkapi profilnya.');

    const { coin } = user;
    const { price } = teacherPrice;

    const schedule = await scheduleService.createSchedule(scheduleBody);
  */
});

const getSchedule = catchAsync(async (req, res) => {
  let { page, limit, filter } = req.query;

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

  const schedule = await scheduleService.getSchedule({
    include: [
      {
        model: User,
        as: 'teacher',
        attributes: {
          exclude: ['password'],
        },
      },
      {
        model: User,
        as: 'student',
        attributes: {
          exclude: ['password'],
        },
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
      {
        model: AvailabilityHours,
      },
      {
        model: User,
        as: 'firstFriend',
        attributes: {
          exclude: ['password'],
        },
      },
      {
        model: User,
        as: 'secondFriend',
        attributes: {
          exclude: ['password'],
        },
      },
      {
        model: Room,
      },
    ],
  });

  if (!schedule && schedule.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, "Don't have data schedule.");

  // Ambil data original
  const originalData = JSON.stringify(schedule);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  let arrayResults = [];
  const serverHost = `https://${req.get('host')}`;

  for (const loopSchedule of convertData) {
    const convertDay = days(loopSchedule.availabilityHour.dayCode);
    const convertDate = loopSchedule.dateSchedule
      ? dates(loopSchedule.dateSchedule)
      : null;
    const lesStatus = statusLes(loopSchedule.statusSchedule);

    const dataSchedule = {
      scheduleId: loopSchedule.id,
      teacherId: loopSchedule.teacherId,
      studentId: loopSchedule.studentId,
      teacherSubjectId: loopSchedule.teacherSubjectId,
      availabilityHoursId: loopSchedule.availabilityHoursId,
      gradeId: loopSchedule.teacherSubject.gradeId,
      gradeGroupId: loopSchedule.teacherSubject.grade.gradeGroupId,
      curriculumId: loopSchedule.teacherSubject.grade.gradeGroup.curriculumId,
      subjectId: loopSchedule.teacherSubject.subjectId,
      roomId: loopSchedule.room ? loopSchedule.room.id : null,
      roomMeetingId: loopSchedule.room ? loopSchedule.room.meetingId : null,
      roomVecteraRoomId: loopSchedule.room ? loopSchedule.room.vecteraRoomId : null,
      type: loopSchedule.typeClass,
      status: loopSchedule.statusSchedule,
      convertStatus: lesStatus,
      subject: loopSchedule.teacherSubject.subject.subjectName,
      grade: loopSchedule.teacherSubject.grade.gradeName,
      gradeCode: loopSchedule.teacherSubject.grade.gradeCode,
      gradeGroup: loopSchedule.teacherSubject.grade.gradeGroup.gradeGroupName,
      curriculum: loopSchedule.teacherSubject.grade.gradeGroup.curriculum.curriculumName,
      date: `${convertDay}, ${convertDate}`,
      time: `${loopSchedule.availabilityHour.timeStart} - ${loopSchedule.availabilityHour.timeEnd}`,
      requestMaterial: loopSchedule.requestMaterial ? loopSchedule.requestMaterial : null,
      imageMaterial: loopSchedule.imageMaterial ? loopSchedule.imageMaterial : null,
      friend1: loopSchedule.firstFriend ? loopSchedule.firstFriend : null,
      friend2: loopSchedule.secondFriend ? loopSchedule.secondFriend : null,
      roomIsActive: loopSchedule.room ? loopSchedule.room.isActive : false,
      roomIsDeleted: loopSchedule.room ? loopSchedule.room.isVecteraDeleted : false,
      roomLink: loopSchedule.room ? `${serverHost}/room/${loopSchedule.room.meetingId}` : null,
      createdAt: loopSchedule.createdAt,
      updatedAt: loopSchedule.updatedAt,
      dateSortingSchedule: loopSchedule.dateSchedule,
    };

    arrayResults.push(dataSchedule);
  }

  const conditionStatus = [PENDING, ACCEPT, PROCESS];

  if (filter == 'process') {
    const queryFilter = arrayResults.filter((a) => {
      // const scheduleDateStart = moment(a.dateSortingSchedule).format('YYYY-MM-DD HH:mm:ss');
      const scheduleDateEnd = moment(a.dateSortingSchedule).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');

      return (scheduleDateEnd >= moment().format('YYYY-MM-DD HH:mm:ss') && conditionStatus.some((o) => a.status.includes(o)));
    });
    arrayResults = queryFilter;
  }

  // Sorting schedule
  const sortingSchedule = arrayResults.sort((a, b) => new Date(a.dateSortingSchedule) - new Date(b.dateSortingSchedule));
  // Pagination data
  const paginateData = pagination.paginator(sortingSchedule, page, limit);

  res.sendWrapped('', httpStatus.OK, paginateData);
});

const getMySchedule = catchAsync(async (req, res) => {
  const { id, role } = req.user;
  let { page, limit, filter } = req.query;

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

  const schedule = await scheduleService.getOwnSchedule(
    id,
    {
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'student',
          attributes: {
            exclude: ['password'],
          },
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
        {
          model: AvailabilityHours,
        },
        {
          model: User,
          as: 'firstFriend',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'secondFriend',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: Room,
        },
      ],
    },
  );

  if (!schedule && schedule.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Don\'t have data schedule.');

  // Ambil data original
  const originalData = JSON.stringify(schedule);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  let arrayResults = [];
  const serverHost = `https://${req.get('host')}`;

  for (const loopSchedule of convertData) {
    const convertDay = days(loopSchedule.availabilityHour.dayCode);
    const convertDate = loopSchedule.dateSchedule ? dates(loopSchedule.dateSchedule) : null;
    const lesStatus = statusLes(loopSchedule.statusSchedule);

    const dataSchedule = {
      scheduleId: loopSchedule.id,
      teacherId: loopSchedule.teacherId,
      studentId: loopSchedule.studentId,
      teacherSubjectId: loopSchedule.teacherSubjectId,
      availabilityHoursId: loopSchedule.availabilityHoursId,
      gradeId: loopSchedule.teacherSubject.gradeId,
      gradeGroupId: loopSchedule.teacherSubject.grade.gradeGroupId,
      curriculumId: loopSchedule.teacherSubject.grade.gradeGroup.curriculumId,
      subjectId: loopSchedule.teacherSubject.subjectId,
      roomId: loopSchedule.room ? loopSchedule.room.id : null,
      roomMeetingId: loopSchedule.room ? loopSchedule.room.meetingId : null,
      roomVecteraRoomId: loopSchedule.room ? loopSchedule.room.vecteraRoomId : null,
      teacher: `${loopSchedule.teacher.firstName} ${loopSchedule.teacher.lastName}`,
      type: loopSchedule.typeClass,
      status: loopSchedule.statusSchedule,
      convertStatus: lesStatus,
      subject: loopSchedule.teacherSubject.subject.subjectName,
      grade: loopSchedule.teacherSubject.grade.gradeName,
      gradeCode: loopSchedule.teacherSubject.grade.gradeCode,
      gradeGroup: loopSchedule.teacherSubject.grade.gradeGroup.gradeGroupName,
      curriculum: loopSchedule.teacherSubject.grade.gradeGroup.curriculum.curriculumName,
      date: `${convertDay}, ${convertDate}`,
      time: `${loopSchedule.availabilityHour.timeStart} - ${loopSchedule.availabilityHour.timeEnd}`,
      requestMaterial: loopSchedule.requestMaterial ? loopSchedule.requestMaterial : null,
      imageMaterial: loopSchedule.imageMaterial ? loopSchedule.imageMaterial : null,
      firiend1: loopSchedule.firstFriend ? loopSchedule.firstFriend : null,
      friend2: loopSchedule.secondFriend ? loopSchedule.secondFriend : null,
      roomIsActive: loopSchedule.room ? loopSchedule.room.isActive : false,
      roomIsDeleted: loopSchedule.room ? loopSchedule.room.isVecteraDeleted : false,
      roomLink: loopSchedule.room ? `${serverHost}/room/${loopSchedule.room.meetingId}` : null,
      createdAt: loopSchedule.createdAt,
      updatedAt: loopSchedule.updatedAt,
      dateSortingSchedule: loopSchedule.dateSchedule,
    };

    arrayResults.push(dataSchedule);
  }

  const conditionStatus = [PENDING, ACCEPT, PROCESS];

  if (filter == 'process') {
    const queryFilter = arrayResults.filter((a) => {
      // const scheduleDateStart = moment(a.dateSortingSchedule).format('YYYY-MM-DD HH:mm:ss');
      const scheduleDateEnd = moment(a.dateSortingSchedule).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');

      return (scheduleDateEnd >= moment().format('YYYY-MM-DD HH:mm:ss') && conditionStatus.some((o) => a.status.includes(o)));
    });
    arrayResults = queryFilter;
  }

  // Sorting schedule
  const sortingSchedule = arrayResults.sort(
    (a, b) => new Date(a.dateSortingSchedule) - new Date(b.dateSortingSchedule),
  );
  // Pagination data
  const paginateData = pagination.paginator(sortingSchedule, page, limit);

  res.sendWrapped('', httpStatus.OK, paginateData);
});

const getScheduleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;
  const userId = req.user.id;

  const schedule = await scheduleService.getScheduleById(id, {
    include: [
      {
        model: User,
        as: 'teacher',
        attributes: {
          exclude: ['password'],
        },
      },
      {
        model: User,
        as: 'student',
        attributes: {
          exclude: ['password'],
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
      {
        model: AvailabilityHours,
      },
      {
        model: Room,
      },
    ],
  });

  if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Jadwal les tidak ditemukan.');

  // Ambil data original
  const originalData = JSON.stringify(schedule);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  const convertDay = days(convertData.availabilityHour.dayCode);
  const convertDate = convertData.dateSchedule
    ? dates(convertData.dateSchedule)
    : null;

  const lesStatus = statusLes(convertData.statusSchedule);

  const serverHost = `https://${req.get('host')}`;

  let roomLink;

  if (role == 'student') {
    roomLink = convertData.room ? `${serverHost}/room/${convertData.room.meetingId}` : null;
  } else if (role == 'teacher') {
    roomLink = convertData.room ? `${serverHost}/v1/schedule/enter-less/tutor/${userId}/${convertData.room.meetingId}` : null;
  }

  const dataSchedule = {
    scheduleId: convertData.id,
    teacherId: convertData.teacherId,
    studentId: convertData.studentId,
    teacherSubjectId: convertData.teacherSubjectId,
    availabilityHoursId: convertData.availabilityHoursId,
    gradeId: convertData.teacherSubject.gradeId,
    gradeGroupId: convertData.teacherSubject.grade.gradeCodeId,
    curriculumId: convertData.teacherSubject.grade.gradeGroup.curriculumId,
    subjectId: convertData.teacherSubject.subjectId,
    roomId: convertData.room ? convertData.room.id : null,
    roomMeetingId: convertData.room ? convertData.room.meetingId : null,
    roomVecteraRoomId: convertData.room ? convertData.room.vecteraRoomId : null,
    type: convertData.typeClass,
    status: convertData.statusSchedule,
    convertStatus: lesStatus,
    subject: convertData.teacherSubject.subject.subjectName,
    grade: convertData.teacherSubject.grade.gradeName,
    gradeCode: convertData.teacherSubject.grade.gradeCode,
    gradeGroup: convertData.teacherSubject.grade.gradeGroup.gradeGroupName,
    curriculum: convertData.teacherSubject.grade.gradeGroup.curriculum.curriculumName,
    date: `${convertDay}, ${convertDate}`,
    time: `${convertData.availabilityHour.timeStart} - ${convertData.availabilityHour.timeEnd}`,
    requestMaterial: convertData.requestMaterial
      ? convertData.requestMaterial
      : null,
    imageMaterial: convertData.imageMaterial ? convertData.imageMaterial : null,
    roomIsActive: convertData.room ? convertData.room.isActive : false,
    roomIsDeleted: convertData.room ? convertData.room.isVecteraDeleted : false,
    roomLink: convertData.room ? roomLink : null,
    createdAt: convertData.createdAt,
    updatedAt: convertData.updatedAt,
    dateSortingSchedule: convertData.dateSchedule,
  };

  res.sendWrapped(dataSchedule, httpStatus.OK);
});

const updateSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const scheduleBody = req.body;

  const schedule = await scheduleService.updateScheduleById(id, scheduleBody);

  if (!schedule) throw new ApiError(httpStatus.NOT_MODIFIED, 'Fail to update');

  res.sendWrapped(schedule, httpStatus.OK);
});

const deleteSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const schedule = await scheduleService.deleteSchedule(id);

  if (!schedule) throw new ApiError(httpStatus.CONFLICT, 'Fail to delete schedule');

  res.sendWrapped(schedule, httpStatus.OK);
});

const historySchedule = catchAsync(async (req, res) => {
  const { id, role } = req.user;
  let { page, limit } = req.query;

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

  const historiesSchedule = await scheduleService.historySchedule(
    id,
    role,
    {
      include: [
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
          model: Room,
        },
      ],
    },
  );

  const historiesCart = await cartService.historyCart(
    id,
    role,
    {
      include: [
        {
          model: CartItem,
          include: [
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
          ],
        },
      ],
    },
  );

  if (!historiesSchedule) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengambil data riwayat jadwal untuk les.');
  if (!historiesCart) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengambil data riwayat keranjang untuk les.');

  const mapHistoriesSchedule = historiesSchedule.map((o) => {
    let lesStatus = null;

    if (role == 'teacher') {
      lesStatus = statusForTutor(o.statusSchedule);
    } else if (role == 'student') {
      lesStatus = statusLes(o.statusSchedule);
    }

    const data = {
      cartId: null,
      cartItemId: null,
      scheduleId: o.id,
      tutorId: o.teacherId,
      studentId: o.studentId,
      teacherSubjectId: o.teacherSubjectId,
      subjectId: o.teacherSubject.subject.id,
      gradeId: o.teacherSubject.grade.id,
      availabilityHoursId: o.availabilityHoursId,
      name: `Les ${o.teacherSubject.subject.subjectName}`,
      lesStatus,
      realStatus: o.statusSchedule,
      grade: o.teacherSubject.grade.gradeName,
      isVecteraDeleted: o.room ? o.room.isVecteraDeleted : false,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  }).filter((filtering) => filtering.isVecteraDeleted);

  const mapHistoriesCart = historiesCart.map((o) => {
    let arrayResults = [];
    if (o.cartItems && o.cartItems.length > 0) {
      const mapCartItems = o.cartItems.map((item) => {
        if (item.cartItemStatus == PENDING || item.cartItemStatus == DELETE) return null;

        let lesStatus = null;

        if (role == 'teacher') {
          lesStatus = statusForTutor(`c${item.cartItemStatus}`);
        } else if (role == 'student') {
          lesStatus = statusLes(item.cartItemStatus);
        }

        const dataCartItem = {
          cartId: o.id,
          cartItemId: item.id,
          scheduleId: null,
          tutorId: o.teacherId,
          studentId: o.studentId,
          teacherSubjectId: item.teacherSubjectId,
          subjectId: item.teacherSubject.subject.id,
          gradeId: item.teacherSubject.grade.id,
          availabilityHoursId: item.availabilityHoursId,
          name: `Les ${item.teacherSubject.subject.subjectName}`,
          lesStatus,
          realStatus: item.cartItemStatus,
          grade: item.teacherSubject.grade.gradeName,
          isVecteraDeleted: item.room ? item.room.isVecteraDeleted : false,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
        return dataCartItem;
      }).filter((filtering) => filtering);
      arrayResults = mapCartItems;
    }

    return arrayResults;
  });

  const concatingCart = [].concat(...mapHistoriesCart);
  const concatingResults = concatingCart.concat(mapHistoriesSchedule);

  // // Sorting schedule
  const sorting = concatingResults.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  // // Pagination data
  const paginate = pagination.paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

const historyScheduleDetail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  const historyDetailSchedule = await scheduleService.historyScheduleDetail(
    id,
    {
      include: [
        {
          model: User,
          as: 'teacher',
        },
        {
          model: User,
          as: 'student',
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
        {
          model: AvailabilityHours,
        },
        {
          model: TutoringTransactionDetail,
        },
      ],
    },
  );

  // If ID in table schedule not found, try to get in cartItem
  if (!historyDetailSchedule) {
    const historyDetailCartItem = await cartService.getCartItemById(
      id,
      {
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
          {
            model: Cart,
            include: [
              {
                model: User,
                as: 'teacher',
              },
              {
                model: User,
                as: 'student',
              },
            ],
          },
        ],
      },
    );

    const reason = await reasonService.getReasonByCategoryAndId(id, 'cart');

    if (!historyDetailCartItem) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan item.');

    let lesStatus = null;
    const convertDay = days(historyDetailCartItem.availabilityHour.dayCode);
    const convertDate = dates(historyDetailCartItem.startTime);

    if (role == 'teacher') {
      lesStatus = statusForTutor(`c${historyDetailCartItem.cartItemStatus}`);
    } else if (role == 'student') {
      lesStatus = statusLes(historyDetailCartItem.cartItemStatus);
    }

    const dataStudent = {
      profile: historyDetailCartItem.cart.student.profile,
      name: `${historyDetailCartItem.cart.student.firstName} ${historyDetailCartItem.cart.student.lastName}`,
    };

    const dataTutor = {
      profile: historyDetailCartItem.cart.teacher.profile,
      name: `${historyDetailCartItem.cart.teacher.firstName} ${historyDetailCartItem.cart.teacher.lastName}`,
      aboutTeacher: `${historyDetailCartItem.teacherSubject.subject.subjectName} - ${historyDetailCartItem.teacherSubject.grade.gradeGroup.curriculum.curriculumName} - ${historyDetailCartItem.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${historyDetailCartItem.teacherSubject.grade.gradeCode}`,
    };

    const dataLes = {
      date: `${convertDay}, ${convertDate} | ${historyDetailCartItem.availabilityHour.timeStart} - ${historyDetailCartItem.availabilityHour.timeEnd}`,
      subject: `${historyDetailCartItem.teacherSubject.subject.subjectName} - ${historyDetailCartItem.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${historyDetailCartItem.teacherSubject.grade.gradeCode}`,
      typeClass: historyDetailCartItem.typeCourse,
      material: historyDetailCartItem.requestMaterial,
      materialImage: historyDetailCartItem.imageMaterial,
    };

    const dataTransaction = {
      transactionId: null,
      transactionDetailId: null,
      createdAt: null,
    };

    const dataReason = {
      reason: reason ? reason.reason : null,
    };

    const dataResult = {
      cartId: historyDetailCartItem.cartId,
      cartItemId: historyDetailCartItem.id,
      scheduleId: null,
      teacherId: historyDetailCartItem.teacherId,
      studentId: historyDetailCartItem.cart.studentId,
      availabilityHoursId: historyDetailCartItem.availabilityHoursId,
      teacherSubjectId: historyDetailCartItem.teacherSubjectId,
      subjectId: historyDetailCartItem.teacherSubject.subjectId,
      gradeId: historyDetailCartItem.teacherSubject.gradeId,
      gradeGroupId: historyDetailCartItem.teacherSubject.grade.gradeGroupId,
      curriculumId: historyDetailCartItem.teacherSubject.grade.gradeGroup.curriculumId,
      reasonId: reason ? reason.id : null,
      defaultStatus: historyDetailCartItem.cartItemStatus,
      lesStatus,
      teacher: dataTutor,
      student: dataStudent,
      les: dataLes,
      reason: dataReason,
      transaction: dataTransaction,
      createdAt: historyDetailCartItem.createdAt,
      updatedAt: historyDetailCartItem.updatedAt,
    };

    return res.sendWrapped(dataResult, httpStatus.OK);
  }

  const reason = await reasonService.getReasonByCategoryAndId(id, 'schedule');

  let lesStatus = null;
  const convertDay = days(historyDetailSchedule.availabilityHour.dayCode);
  const convertDate = dates(historyDetailSchedule.dateSchedule);

  if (role == 'teacher') {
    lesStatus = statusForTutor(historyDetailSchedule.statusSchedule);
  } else if (role == 'student') {
    lesStatus = statusLes(historyDetailSchedule.statusSchedule);
  }

  const dataStudent = {
    profile: historyDetailSchedule.student.profile,
    name: `${historyDetailSchedule.student.firstName} ${historyDetailSchedule.student.lastName}`,
  };

  const dataTutor = {
    profile: historyDetailSchedule.teacher.profile,
    name: `${historyDetailSchedule.teacher.firstName} ${historyDetailSchedule.teacher.lastName}`,
    aboutTeacher: `${historyDetailSchedule.teacherSubject.subject.subjectName} - ${historyDetailSchedule.teacherSubject.grade.gradeGroup.curriculum.curriculumName} - ${historyDetailSchedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${historyDetailSchedule.teacherSubject.grade.gradeCode}`,
  };

  const dataLes = {
    date: `${convertDay}, ${convertDate} | ${historyDetailSchedule.availabilityHour.timeStart} - ${historyDetailSchedule.availabilityHour.timeEnd}`,
    subject: `${historyDetailSchedule.teacherSubject.subject.subjectName} - ${historyDetailSchedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${historyDetailSchedule.teacherSubject.grade.gradeCode}`,
    typeClass: historyDetailSchedule.typeClass,
    material: historyDetailSchedule.requestMaterial,
    materialImage: historyDetailSchedule.imageMaterial,
  };

  const dataTransaction = {
    transactionId: historyDetailSchedule.tutoringTransactionDetails[0].tutoringTransactionId,
    transactionDetailId: historyDetailSchedule.tutoringTransactionDetails[0].id,
    createdAt: moment(historyDetailSchedule.tutoringTransactionDetails[0].createdAt).format('DD MMM, HH:MM'),
  };

  const dataReason = {
    reason: reason ? reason.reason : null,
  };

  const dataResult = {
    cartId: null,
    cartItemId: null,
    scheduleId: historyDetailSchedule.id,
    teacherId: historyDetailSchedule.teacherId,
    studentId: historyDetailSchedule.studentId,
    availabilityHoursId: historyDetailSchedule.availabilityHoursId,
    teacherSubjectId: historyDetailSchedule.teacherSubjectId,
    subjectId: historyDetailSchedule.teacherSubject.subjectId,
    gradeId: historyDetailSchedule.teacherSubject.gradeId,
    gradeGroupId: historyDetailSchedule.teacherSubject.grade.gradeGroupId,
    curriculumId: historyDetailSchedule.teacherSubject.grade.gradeGroup.curriculumId,
    reasonId: reason ? reason.id : null,
    defaultStatus: historyDetailSchedule.statusSchedule,
    lesStatus,
    teacher: dataTutor,
    student: dataStudent,
    les: dataLes,
    reason: dataReason,
    transaction: dataTransaction,
    createdAt: historyDetailSchedule.createdAt,
    updatedAt: historyDetailSchedule.updatedAt,
  };

  res.sendWrapped(dataResult, httpStatus.OK);
});

const updateRequestMateri = catchAsync(async (req, res) => {
  const { id } = req.params;
  const destination = 'images/material';

  const conditionStatus = [PENDING, ACCEPT, PROCESS];

  const schedule = await scheduleService.getScheduleById(id);

  if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Jadwal les tidak ditemukan');

  if (!conditionStatus.some((value) => schedule.statusSchedule.includes(value))) {
    throw new ApiError(httpStatus.NOT_FOUND, `Hanya dapat request materi pada keranjang yang berstatus ${PENDING}, ${ACCEPT}, ${PROCESS}`);
  }

  multering.options(`./public/${destination}`, id).single('fileMaterial')(req, res, async (err) => {
    if (err) {
      return res.sendWrapped(err);
    }

    if (!req.file || !req.file.filename) {
      return res.sendWrapped(
        'Please insert file/photo!',
        httpStatus.BAD_REQUEST,
      );
    }

    const schemaJoi = Joi.object({
      requestMaterial: Joi.string().allow(''),
      email1: Joi.string().email().allow(''),
      email2: Joi.string().email().allow(''),
      phone1: Joi.string().max(14).allow('').pattern(/^[0-9]+$/),
      phone2: Joi.string().max(14).allow('').pattern(/^[0-9]+$/),
    });

    const { value, error } = schemaJoi.validate(req.body);
    const {
      requestMaterial, email1, email2, phone1, phone2,
    } = value;

    if (error) {
      return res.sendWrapped(error.message, httpStatus.BAD_REQUEST);
    }

    let arrayFriend = [];

    const updateMaterial = await scheduleService.updateRequestMateri(
      id,
      `static/${destination}/${req.file.filename}`,
      requestMaterial,
    );

    await resizing(
      req.file.path,
      200,
      200,
      90,
      `./public/${destination}/${req.file.filename}`,
    );

    const group = [
      {
        email: email1,
        phone: phone1,
      },
      {
        email: email2,
        phone: phone2,
      },
    ];

    if (schedule.typeClass == 'group') {
      const filtering = group.filter((o) => o.email !== '' && o.phone !== '');

      if (filtering.length > 0) {
        if (filtering.length == 1) {
          const user = await userService.getUserByEmail(filtering[0].email);

          if (!user) {
            return res.sendWrapped(`${filtering[0].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
          }
          const updateFriend = await Schedule.update(
            {
              friend1: user.id,
            },
            {
              where: {
                id,
              },
            },
          );

          console.log('have data and update friend', updateFriend);
        } else if (filtering.length == 2) {
          const user1 = await userService.getUserByEmail(filtering[0].email);
          const user2 = await userService.getUserByEmail(filtering[1].email);

          if (!user1) {
            arrayFriend.push(filtering[0].email);
            // return res.sendWrapped(`${filtering[0].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
          } else {
            const updateFriend1 = await Schedule.update(
              {
                friend1: user1.id,
              },
              {
                where: {
                  id,
                },
              },
            );

            console.log('have data and update friend 1', updateFriend1);
          }

          // USER 2
          if (!user2) {
            arrayFriend.push(filtering[1].email);
            // return res.sendWrapped(`${filtering[1].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
          } else {
            const updateFriend2 = await Schedule.update(
              {
                friend2: user2.id,
              },
              {
                where: {
                  id,
                },
              },
            );

            console.log('user ada, update friend 2', updateFriend2);
          }
        }
      }

      if (arrayFriend.length == 2) {
        return res.sendWrapped(`${arrayFriend[0]} dan ${arrayFriend[1]} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES`, httpStatus.NOT_FOUND);
      }

      if (arrayFriend.length == 1) {
        return res.sendWrapped(`${arrayFriend[0]} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES`, httpStatus.NOT_FOUND);
      }
    } else if (schedule.typeClass == 'private' && (email1 || email2)) {
      return res.sendWrapped('Menambahkan teman hanya dapat dilakukan pada jadwal les yang memiliki tipe group', httpStatus.CONFLICT);
    }

    res.sendWrapped(updateMaterial, httpStatus.OK);
  });
});

// TEACHER

const getOwnTeacherSchedule = catchAsync(async (req, res) => {
  const { id, role } = req.user;
  let { page, limit, filter } = req.query;

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

  const schedule = await scheduleService.getOwnScheduleTutor(
    id,
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
          model: User,
          as: 'firstFriend',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'secondFriend',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: Room,
        },
      ],
    },
  );

  if (!schedule && schedule.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Don\'t have data schedule.');

  // Ambil data original
  const originalData = JSON.stringify(schedule);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  let arrayResults = [];

  const serverHost = `https://${req.get('host')}`;

  for (const loopSchedule of convertData) {
    const convertDay = days(loopSchedule.availabilityHour.dayCode);
    const convertDate = loopSchedule.dateSchedule ? dates(loopSchedule.dateSchedule) : null;
    const lesStatus = statusLes(loopSchedule.statusSchedule);

    const dataSchedule = {
      scheduleId: loopSchedule.id,
      teacherId: loopSchedule.teacherId,
      studentId: loopSchedule.studentId,
      teacherSubjectId: loopSchedule.teacherSubjectId,
      availabilityHoursId: loopSchedule.availabilityHoursId,
      gradeId: loopSchedule.teacherSubject.gradeId,
      subjectId: loopSchedule.teacherSubject.subjectId,
      roomId: loopSchedule.room ? loopSchedule.room.id : null,
      roomMeetingId: loopSchedule.room ? loopSchedule.room.meetingId : null,
      roomVecteraRoomId: loopSchedule.room ? loopSchedule.room.vecteraRoomId : null,
      type: loopSchedule.typeClass,
      status: loopSchedule.statusSchedule,
      convertStatus: lesStatus,
      subject: loopSchedule.teacherSubject.subject.subjectName,
      grade: loopSchedule.teacherSubject.grade.gradeName,
      date: `${convertDay}, ${convertDate}`,
      time: `${loopSchedule.availabilityHour.timeStart} - ${loopSchedule.availabilityHour.timeEnd}`,
      requestMaterial: loopSchedule.requestMaterial ? loopSchedule.requestMaterial : null,
      imageMaterial: loopSchedule.imageMaterial ? loopSchedule.imageMaterial : null,
      firiend1: loopSchedule.firstFriend ? loopSchedule.firstFriend : null,
      friend2: loopSchedule.secondFriend ? loopSchedule.secondFriend : null,
      roomIsActive: loopSchedule.room ? loopSchedule.room.isActive : false,
      roomIsDeleted: loopSchedule.room ? loopSchedule.room.isVecteraDeleted : false,
      roomLink: loopSchedule.room ? `${serverHost}/v1/schedule/enter-less/tutor/${id}/${loopSchedule.room.meetingId}` : null,
      createdAt: loopSchedule.createdAt,
      updatedAt: loopSchedule.updatedAt,
      dateSortingSchedule: loopSchedule.dateSchedule,
    };

    arrayResults.push(dataSchedule);
  }

  const conditionStatus = [PENDING, ACCEPT, PROCESS];

  if (filter == 'process') {
    const queryFilter = arrayResults.filter((a) => {
      // const scheduleDateStart = moment(a.dateSortingSchedule).format('YYYY-MM-DD HH:mm:ss');
      const scheduleDateEnd = moment(a.dateSortingSchedule).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');

      return (scheduleDateEnd >= moment().format('YYYY-MM-DD HH:mm:ss') && conditionStatus.some((o) => a.status.includes(o)));
    });
    arrayResults = queryFilter;
  }

  // Sorting schedule
  const sortingSchedule = arrayResults.sort(
    (a, b) => new Date(a.dateSortingSchedule) - new Date(b.dateSortingSchedule),
  );
  // Pagination data
  const paginateData = pagination.paginator(sortingSchedule, page, limit);

  res.sendWrapped('', httpStatus.OK, paginateData);
});

const enterLessonRoom = catchAsync(async (req, res) => {
  const { userId, roomId } = req.params;

  const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');

  const user = await userService.getUserById(userId);

  const vecteraEmail = user.email.replace(new RegExp('@.*$'), '@sebisles.com');
  const vecteraUserId = (user.vecteraUserId != undefined && user.vecteraUserId != null) ? user.vecteraUserId : await vecteraHelper.getOrCreateUser(vecteraEmail, user.firstName);
  const tutorLoginToken = await vecteraHelper.createLoginToken(vecteraUserId);
  const redirectUrl = `${tutorLoginToken}&next=/room/sebis/${roomId}/`;

  res.redirect(redirectUrl);
});

const orderList = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  let { limit, page, qstatus } = req.query;

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

  let status = [];

  const serverHost = `https://${req.get('host')}`;

  if (qstatus && qstatus == 'pending') {
    status = [PENDING];
  } else if (qstatus && qstatus == 'accept') {
    status = [ACCEPT];
  } else if (qstatus && qstatus == 'fail') {
    status = [REJECT, CANCEL, EXPIRE];
  } else {
    status = [PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, DONE, DELETE];
  }

  let arraySchedule = [];

  const schedules = await scheduleService.getOwnScheduleTutorWithStatus(teacherId, status, {
    include: [
      {
        model: User,
        as: 'student',
      },
      {
        model: User,
        as: 'teacher',
      },
      {
        model: TeacherSubject,
        include: [
          {
            model: Subject,
          },
          {
            model: Grade,
            include: [
              {
                model: GradeGroup,
                include: [
                  {
                    model: Curriculum,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: AvailabilityHours,
      },
      {
        model: User,
        as: 'firstFriend',
      },
      {
        model: User,
        as: 'secondFriend',
      },
      {
        model: Room,
      },
    ],
  });

  if (schedules.length > 0) {
    for (const schedule of schedules) {
      const convertDay = days(schedule.availabilityHour.dayCode);
      const convertDate = schedule.dateSchedule
        ? dates(schedule.dateSchedule)
        : null;

      let friends = [];

      if (schedule.firstFriend || schedule.secondFriend) {
        friends = [
          {
            friendId: schedule.firstFriend ? schedule.firstFriend.id : null,
            email: schedule.firstFriend ? schedule.firstFriend.email : null,
            name: `${schedule.firstFriend ? schedule.firstFriend.firstName : ''} ${schedule.firstFriend ? schedule.firstFriend.lastName : ''}`,
            profile: schedule.firstFriend ? schedule.firstFriend.profile : null,
          },
          {
            friendId: schedule.secondFriend ? schedule.secondFriend.id : null,
            email: schedule.secondFriend ? schedule.secondFriend.email : null,
            name: `${schedule.secondFriend ? schedule.secondFriend.firstName : ''} ${schedule.secondFriend ? schedule.secondFriend.lastName : ''}`,
            profile: schedule.secondFriend ? schedule.secondFriend.profile : null,
          },
        ];
      }

      if (friends.length > 0) {
        friends = friends.filter((o) => o.email);
      }

      const dataSchedule = {
        scheduleId: schedule.id,
        studentId: schedule.studentId,
        teacherId: schedule.teacherId,
        teacherSubjectId: schedule.teacherSubjectId,
        subjectId: schedule.teacherSubject.subjectId,
        gradeId: schedule.teacherSubject.gradeId,
        gradeGroupId: schedule.teacherSubject.grade.gradeGroupId,
        curriculumId: schedule.teacherSubject.grade.gradeGroup.curriculumId,
        availabilityHoursId: schedule.availabilityHoursId,
        roomId: schedule.room ? schedule.room.id : null,
        friend1: schedule.friend1,
        friend2: schedule.friend2,
        teacher: {
          email: schedule.teacher.email,
          name: `${schedule.teacher.firstName} ${schedule.teacher.lastName}`,
          profile: schedule.teacher.profile,
        },
        student: {
          email: schedule.student.email,
          name: `${schedule.student.firstName} ${schedule.student.lastName}`,
          profile: schedule.student.profile,
        },
        order: {
          subject: `Les ${schedule.teacherSubject.subject.subjectName}`,
          grade: `${schedule.teacherSubject.grade.gradeGroup.curriculum.curriculumName} - ${schedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${schedule.teacherSubject.grade.gradeCode}`,
          typeClass: schedule.typeClass,
          status: statusScheduleForTutor(schedule.statusSchedule),
          defaultStatus: schedule.statusSchedule,
          date: `${convertDay}, ${convertDate}`,
          time: `${schedule.availabilityHour.timeStart} - ${schedule.availabilityHour.timeEnd}`,
          isActive: schedule.room ? schedule.room.isActive : false,
          isVecteraDeleted: schedule.room ? schedule.room.isVecteraDeleted : false,
          linkRoom: schedule.room ? `${serverHost}/v1/schedule/enter-less/tutor/${teacherId}/${schedule.room.meetingId}` : null,
          requestMaterial: schedule.requestMaterial,
          imageMaterial: schedule.imageMaterial,
        },
        friends,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      };

      arraySchedule.push(dataSchedule);
    }
  }

  arraySchedule.filter((o) => status.includes((s) => o.order.defaultStatus));

  // Sorting
  const sorting = arraySchedule.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Pagination data
  const paginate = pagination.paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

module.exports = {
  createSchedule,
  getSchedule,
  getMySchedule,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  historySchedule,
  historyScheduleDetail,
  updateRequestMateri,
  getOwnTeacherSchedule,
  enterLessonRoom,
  orderList,
};
