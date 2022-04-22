const httpStatus = require('http-status');
const moment = require('moment');
const Joi = require('joi');
const catchAsync = require('../utils/catchAsync');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const { User } = require('../models/User');
const { Role } = require('../models/Role');
const { TeacherSubject } = require('../models/TeacherSubject');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Price } = require('../models/Price');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { UserDetail } = require('../models/UserDetail');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const { Room } = require('../models/Room');
const { Wishlist } = require('../models/Wishlist');
const { WishlistItem } = require('../models/WishlistItem');
const ApiError = require('../utils/ApiError');
const days = require('../utils/day');
const dates = require('../utils/date');
const multering = require('../utils/multer');
const resizing = require('../utils/resizeImage');
const { paginator } = require('../utils/pagination');
const statusCart = require('../utils/statusCart');
const statusSchedule = require('../utils/statusSchedule');

const cartService = require('../services/cartService');
const scheduleService = require('../services/scheduleService');
const userService = require('../services/userService');
const wishlistService = require('../services/wishlistService');

const {
  PENDING, ACCEPT, PROCESS, REJECT, CANCEL, EXPIRE, DONE, DELETE, OFFSET_ORDER_HOURS,
} = process.env;

// teacher
const getOrderList = catchAsync(async (req, res) => {
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
  let schedules = [];
  const serverHost = `https://${req.get('host')}`;

  if (qstatus && qstatus == 'pending') {
    status = [PENDING];
  } else if (qstatus && qstatus == 'success') {
    status = [ACCEPT];

    schedules = await scheduleService.getOwnScheduleTutorWithStatus(teacherId, status, {
      include: [
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
  } else if (qstatus && qstatus == 'fail') {
    status = [REJECT, CANCEL, EXPIRE, DELETE];
  } else {
    status = [PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, DONE, DELETE];
  }

  const cartItems = await cartService.orderList(teacherId, status, {
    include: [
      {
        model: Cart,
        include: [
          {
            model: User,
            as: 'student',
          },
        ],
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
    ],
  });

  if (!cartItems) throw new ApiError(httpStatus.NOT_FOUND, 'Gagal mengambil data order.');

  const arrayOrder = [];
  const arraySchedule = [];

  if (cartItems.length > 0) {
    for (const cart of cartItems) {
      const convertDay = days(cart.availabilityHour.dayCode);
      const convertDate = cart.startTime
        ? dates(cart.startTime)
        : null;

      let friends = [];

      if (cart.firstFriend || cart.secondFriend) {
        friends = [
          {
            friendId: cart.firstFriend ? cart.firstFriend.id : null,
            email: cart.firstFriend ? cart.firstFriend.email : null,
            name: `${cart.firstFriend ? cart.firstFriend.firstName : ''} ${cart.firstFriend ? cart.firstFriend.lastName : ''}`,
            profile: cart.firstFriend ? cart.firstFriend.profile : null,
          },
          {
            friendId: cart.secondFriend ? cart.secondFriend.id : null,
            email: cart.secondFriend ? cart.secondFriend.email : null,
            name: `${cart.secondFriend ? cart.secondFriend.firstName : ''} ${cart.secondFriend ? cart.secondFriend.lastName : ''}`,
            profile: cart.secondFriend ? cart.secondFriend.profile : null,
          },
        ];
      }

      if (friends.length > 0) {
        friends = friends.filter((o) => o.email);
      }

      const dataCart = {
        cartId: cart.cart.id,
        cartItemId: cart.id,
        studentId: cart.cart.studentId,
        teacherSubjectId: cart.teacherSubjectId,
        subjectId: cart.teacherSubject.subjectId,
        gradeId: cart.teacherSubject.gradeId,
        gradeGroupId: cart.teacherSubject.grade.gradeGroupId,
        curriculumId: cart.teacherSubject.grade.gradeGroup.curriculumId,
        availabilityHoursId: cart.availabilityHoursId,
        roomId: null,
        scheduleId: null,
        friend1: cart.friend1,
        friend2: cart.friend2,
        student: {
          email: cart.cart.student.email,
          name: `${cart.cart.student.firstName} ${cart.cart.student.lastName}`,
          profile: cart.cart.student.profile,
        },
        order: {
          subject: `Les ${cart.teacherSubject.subject.subjectName}`,
          grade: `${cart.teacherSubject.grade.gradeGroup.curriculum.curriculumName} - ${cart.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${cart.teacherSubject.grade.gradeCode}`,
          typeClass: cart.typeCourse,
          status: statusCart(cart.cartItemStatus),
          date: `${convertDay}, ${convertDate}`,
          time: `${cart.availabilityHour.timeStart} - ${cart.availabilityHour.timeEnd}`,
          isActive: false,
          isVecteraDeleted: false,
          linkRoom: null,
          requestMaterial: cart.requestMaterial,
          imageMaterial: cart.imageMaterial,
        },
        friends,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      };

      arrayOrder.push(dataCart);
    }
  }

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
        cartId: null,
        cartItemId: null,
        studentId: schedule.studentId,
        teacherSubjectId: schedule.teacherSubjectId,
        subjectId: schedule.teacherSubject.subjectId,
        gradeId: schedule.teacherSubject.gradeId,
        gradeGroupId: schedule.teacherSubject.grade.gradeGroupId,
        curriculumId: schedule.teacherSubject.grade.gradeGroup.curriculumId,
        availabilityHoursId: schedule.availabilityHoursId,
        roomId: schedule.room ? schedule.room.id : null,
        scheduleId: schedule.id,
        friend1: schedule.friend1,
        friend2: schedule.friend2,
        student: {
          email: schedule.student.email,
          name: `${schedule.student.firstName} ${schedule.student.lastName}`,
          profile: schedule.student.profile,
        },
        order: {
          subject: `Les ${schedule.teacherSubject.subject.subjectName}`,
          grade: `${schedule.teacherSubject.grade.gradeGroup.curriculum.curriculumName} - ${schedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${schedule.teacherSubject.grade.gradeCode}`,
          typeClass: schedule.typeClass,
          status: statusSchedule(schedule.statusSchedule),
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

  const arrayResults = arrayOrder.concat(arraySchedule);

  // Sorting
  const sorting = arrayResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Pagination data
  const pagination = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, pagination);
});

const approvingOrder = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { cartItemId } = req.params;
  const { cartItemStatus } = req.body;

  const cartItem = await cartService.approvingCartRequest(
    cartItemId,
    teacherId,
    cartItemStatus,
  );

  res.sendWrapped(cartItem, httpStatus.OK);
});

// student
const addCart = catchAsync(async (req, res) => {
  const studentId = req.user.id;

  const arrayBody = req.body;

  if (!arrayBody || arrayBody.length <= 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Masukkan data dengan benar.');

  const arrayResult = [];

  for (const loopBody of arrayBody) {
    // Pengecekan jam untuk melakukan pemesanan les
    const currentHour = parseInt(moment().format('H'));
    if (currentHour >= 22 || currentHour <= 5) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Batas jam pemesanan les hanya pukul 06:00 WIB - 21:59 WIB!',
      );
    }

    const availSchedule = await scheduleService.checkerSchedule(
      loopBody.teacherId,
      loopBody.teacherSubjectId,
      loopBody.availabilityHoursId,
      moment(loopBody.startTime).utc().format('YYYY-MM-DD HH:mm:ss'),
    );

    if (availSchedule) throw new ApiError(httpStatus.CONFLICT, 'Sudah ada yang membeli jadwal les ini, harap pilih les jadwal lain.');

    const createCart = await cartService.findOrCreateCart(studentId, loopBody.teacherId);

    if (!createCart) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal membuat cart');

    const cartItemData = {
      cartItemStatus: ACCEPT,
      typeCourse: loopBody.typeCourse,
      startTime: moment(loopBody.startTime).format('YYYY-MM-DD HH:mm'),
      endTime: moment(loopBody.endTime).format('YYYY-MM-DD HH:mm'),
      cartId: createCart[0].id,
      teacherSubjectId: loopBody.teacherSubjectId,
      availabilityHoursId: loopBody.availabilityHoursId,
    };

    // Cek apakah jam sekarang berseilih lebih dari 2 jam dari jadwal les
    const offsetHours = parseInt(OFFSET_ORDER_HOURS);
    const checkBetweenHours = await cartService.checkBetweenHours(
      cartItemData.startTime,
      offsetHours,
    );

    if (!checkBetweenHours) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Waktu pemesanan kelas sudah habis. Pembelian kelas maksimal ${offsetHours} jam sebelum kelas dimulai. Yuk... pilih jadwal yang lain.`,
      );
    }

    // Ambil semua data keranjang milik kita sendiri
    const ownCart = await cartService.getCartByStudentId(studentId);

    if (!ownCart && ownCart.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Anda belum memiliki keranjang.');

    const mapCartId = ownCart.map((o) => o.id);

    // Cek cart sudah ada atau belum
    const checkCartItem = await cartService.checkerCartItem(
      loopBody.teacherSubjectId,
      moment(loopBody.startTime).utc().format('YYYY-MM-DD HH:mm:ss'),
      mapCartId,
      studentId,
    );

    // Jika hasil dari pengecekan true(cart sudah ada), maka tampilkan error
    if (checkCartItem) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Sudah ada yang memesan jadwal les di jam dan tanggal ini ${moment(
          loopBody.startTime,
        ).format('YYYY-MM-DD HH:mm:ss')}, silahkan pilih jadwal yang lain.`,
      );
    }

    // Cek apakah sudah memiliki les di tanggal dan jam yang sama
    const checkSchedule = await scheduleService.checkAvailDateSchedule(
      studentId,
      moment(loopBody.startTime).utc().format('YYYY-MM-DD HH:mm:ss'),
      loopBody.availabilityHoursId,
    );

    // Jika ada maka response true dan mengirim pesan error
    if (checkSchedule) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Anda sudah memiliki jadwal les di jam dan tanggal ini.',
      );
    }

    const dataResult = {
      teacherId: loopBody.teacherId,
      ...cartItemData,
    };

    arrayResult.push(dataResult);
  }

  const createCartItem = await CartItem.bulkCreate(arrayResult);

  if (!createCartItem && createCartItem.length !== arrayResult.length) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan ke keranjang. Periksa kembali!');

  for (const loopForWishlistItem of arrayResult) {
    const wishlistItem = await WishlistItem.findOne(
      {
        where: {
          teacherId: loopForWishlistItem.teacherId,
          teacherSubjectId: loopForWishlistItem.teacherSubjectId,
          availabilityHoursId: loopForWishlistItem.availabilityHoursId,
          typeCourse: loopForWishlistItem.typeCourse,
          dateTimeStart: new Date(loopForWishlistItem.startTime),
        },
        include: {
          model: Wishlist,
        },
      },
    );

    if (wishlistItem && wishlistItem.wishlist && wishlistItem.wishlist.studentId == studentId) {
      // console.log('samaaa', wishlistItem.wishlist.studentId == studentId ? true : false);
      await wishlistService.deleteWishlistItemById(wishlistItem.id);
    }
  }

  res.sendWrapped(createCartItem, httpStatus.OK);

  /*
  // Pengecekan jam untuk melakukan pemesanan les
  const currentHour = parseInt(moment().format('H'));
  if (currentHour >= 22 || currentHour <= 5) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Batas jam pemesanan les hanya pukul 06:00 WIB - 21:59 WIB!',
    );
  }

  const createCart = await cartService.findOrCreateCart(studentId, teacherId);

  if (!createCart) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal membuat cart');

  const cartItemData = {
    cartItemStatus: ACCEPT,
    typeCourse,
    startTime: moment(startTime).format('YYYY-MM-DD HH:mm'),
    endTime: moment(endTime).format('YYYY-MM-DD HH:mm'),
    cartId: createCart[0].id,
    teacherSubjectId,
    availabilityHoursId,
  };

  // Cek apakah jam sekarang berseilih lebih dari 2 jam dari jadwal les
  const offsetHours = parseInt(OFFSET_ORDER_HOURS);
  const checkBetweenHours = await cartService.checkBetweenHours(
    cartItemData.startTime,
    offsetHours,
  );

  if (!checkBetweenHours) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Waktu pemesanan kelas sudah habis. Pembelian kelas maksimal ${offsetHours} jam sebelum kelas dimulai. Yuk... pilih jadwal yang lain.`,
    );
  }

  // Ambil semua data keranjang milik kita sendiri
  const ownCart = await cartService.getCartByStudentId(studentId);

  if (!ownCart && ownCart.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Anda belum memiliki keranjang.');

  const mapCartId = ownCart.map((o) => o.id);

  // Cek cart sudah ada atau belum
  const checkCartItem = await cartService.checkerCartItem(
    teacherSubjectId,
    moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
    mapCartId,
    studentId,
  );

  // Jika hasil dari pengecekan true(cart sudah ada), maka tampilkan error
  if (checkCartItem) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Sudah ada yang membeli jadwal di jam dan tanggal ini ${moment(
        startTime,
      ).format('YYYY-MM-DD HH:mm:ss')}`,
    );
  }

  // Cek apakah sudah memiliki les di tanggal dan jam yang sama
  const checkSchedule = await scheduleService.checkAvailDateSchedule(
    studentId,
    moment(startTime).format('YYYY-MM-DD'),
    availabilityHoursId,
  );

  // Jika ada maka response true dan mengirim pesan error
  if (checkSchedule) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Anda sudah memiliki jadwal les di jam dan tanggal ini.',
    );
  }

  // Buat item cart
  const createCartItem = await cartService.createCartItem(
    teacherId,
    cartItemData,
  );
  if (!createCartItem) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal menambah item');
  */

  // res.sendWrapped({ createCart, createCartItem }, httpStatus.OK);
});

const viewCart = catchAsync(async (req, res) => {
  let { page, limit, status } = req.query;
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

  const cart = await cartService.getCartByStudentId(studentId, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: {
          exclude: ['password'],
        },
        include: {
          model: Role,
          attributes: ['roleName'],
        },
      },
      {
        model: User,
        as: 'teacher',
        attributes: {
          exclude: ['password'],
        },
        include: {
          model: Role,
          attributes: ['roleName'],
        },
        include: {
          model: UserDetail,
          include: {
            model: Price,
          },
        },
      },
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
            attributes: {
              exclude: ['password'],
            },
            as: 'firstFriend',
            include: {
              model: Role,
              attributes: ['roleName'],
            },
          },
          {
            model: User,
            as: 'secondFriend',
            attributes: {
              exclude: ['password'],
            },
          },
        ],
      },
    ],
  });

  // Ambil data original
  const originalData = JSON.stringify(cart);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  const successStatus = [PENDING, ACCEPT];
  const failStatus = [REJECT, EXPIRE, CANCEL];

  let privatePrice = 0;
  let groupPrice = 0;
  let total = 0;

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
    let arrayResults = [];
    const item = o.cartItems.map((itm) => {
      const convertDay = itm.availabilityHour
        ? days(itm.availabilityHour.dayCode)
        : days(moment(itm.startTime).day());
      const convertDate = itm.startTime ? dates(itm.startTime) : null;

      const dataCartItem = {
        cartItemId: itm.id,
        teacherId: itm.teacherId,
        teacherSubjectId: itm.teacherSubjectId,
        availabilityHoursId: itm.availabilityHoursId,
        gradeId: itm.teacherSubject.gradeId,
        gradeGroupId: itm.teacherSubject.grade.gradeGroupId,
        curriculumId: itm.teacherSubject.grade.gradeGroup.curriculumId,
        subjectId: itm.teacherSubject.subjectId,
        type: itm.typeCourse,
        subject: itm.teacherSubject.subject.subjectName,
        grade: itm.teacherSubject.grade.gradeName,
        gradeCode: itm.teacherSubject.grade.gradeCode,
        gradeGroup: itm.teacherSubject.grade.gradeGroup.gradeGroupName,
        curriculum: itm.teacherSubject.grade.gradeGroup.curriculum.curriculumName,
        date: `${convertDay}, ${convertDate}`,
        time: `${moment(itm.startTime).format('HH:mm')} - ${moment(
          itm.endTime,
        ).format('HH:mm')}`,
        status: itm.cartItemStatus,
        price: itm.typeCourse == 'private' ? privatePrice : groupPrice,
        requestMaterial: itm.requestMaterial ? itm.requestMaterial : null,
        imageMaterial: itm.imageMaterial ? itm.imageMaterial : null,
        createdAt: itm.createdAt,
        updatedAt: itm.updatedAt,
        friend1: itm.firstFriend,
        friend2: itm.secondFriend,
      };

      return arrayResults.push(dataCartItem);
    });

    // Sorting item cart
    const sortingItem = arrayResults.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    let arrayCartItemWithStatus = [];
    if (status && status === 'success') {
      const filteringCartItemByStatus = sortingItem.filter((s) => successStatus.some((v) => s.status.includes(v)));
      arrayCartItemWithStatus = filteringCartItemByStatus;
    } else if (status && status === 'fail') {
      const filteringCartItemByStatus = sortingItem.filter((s) => failStatus.some((v) => s.status.includes(v)));
      arrayCartItemWithStatus = filteringCartItemByStatus;
    } else {
      arrayCartItemWithStatus = sortingItem;
    }

    const data = {
      cartId: o.id,
      studentId: o.studentId,
      teacherId: o.teacherId,
      student: `${o.student.firstName} ${o.student.lastName}`,
      teacher: `${o.teacher.firstName} ${o.teacher.lastName}`,
      profile: o.student.profile,
      referralCode: o.student.referralCode,
      referredBy: o.student.referredBy,
      cartItems: status ? arrayCartItemWithStatus : sortingItem,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  // Filter untuk menampikan data yang memiliki item wishlist
  const filteringItem = mapingData.filter((o) => o.cartItems.length > 0);
  // Sorting parent cart
  const sorting = filteringItem.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  sorting.map((o) => {
    let sum = o.cartItems.map((s) => {
      let price = Number(s.price);
      total += price;

      return total;
    });
    return sum;
  });

  // let total = 0;
  // sorting.forEach((e) => {
  //   e.cartItems.forEach((a) => {
  //     total += a.price;
  //   });
  // });

  const paginateData = paginator(sorting, page, limit);
  const concatData = {
    ...paginateData,
    total,
  };

  res.sendWrapped('', httpStatus.OK, concatData);

  /**
  // Ambil data original
  const originalData = JSON.stringify(cart[0]);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  let arrayCartItems = [];

  // Looping untuk mengganti formating tanggal les
  if (convertData.cartItems && convertData.cartItems.length > 0) {
    for (const loopCartItems of convertData.cartItems) {
      const convertDay = loopCartItems.availabilityHour ? days(loopCartItems.availabilityHour.dayCode) : days(moment(loopCartItems.startTime).day());
      const convertDate = loopCartItems.startTime ? dates(loopCartItems.startTime) : null;
      const dataCartItem = {
        cartItemId: loopCartItems.id,
        teacherId: loopCartItems.teacherId,
        teacherSubjectId: loopCartItems.teacherSubjectId,
        availabilityHoursId: loopCartItems.availabilityHoursId,
        gradeId: loopCartItems.teacherSubject.gradeId,
        subjectId: loopCartItems.teacherSubject.subjectId,
        teacher: `${loopCartItems.teacher.firstName} ${loopCartItems.teacher.lastName}`,
        type: loopCartItems.teacherSubject.type,
        subject: loopCartItems.teacherSubject.subject.subjectName,
        grade: loopCartItems.teacherSubject.grade.gradeName,
        date: `${convertDay}, ${convertDate}`,
        time: `${moment(loopCartItems.startTime).format('HH:mm')} - ${moment(loopCartItems.endTime).format('HH:mm')}`,
      };
      arrayCartItems.push(dataCartItem);
    }
  }

  // Ambil data original kemudian ganti key cartItems menjadi arrayCartItems
  convertData.cartItems = arrayCartItems;

  const data = {
    cartId: convertData.id,
    studentId: convertData.studentId,
    student: `${convertData.student.firstName} ${convertData.lastName}`,
    profile: convertData.student.profile,
    referralCode: convertData.student.referralCode,
    referredBy: convertData.student.referredBy,
    cartItems: arrayCartItems,
  };

  const mapToDistinct = new Map();

  arrayCartItems.forEach((item) => mapToDistinct.set(item.teacherId, { ...mapToDistinct.get(item.teacherId), ...item }));

  const results = Array.from(mapToDistinct.values());
*/
});

const getCartById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const cartItem = await cartService.getCartItemById(id, {
    include: [
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
        include: {
          model: User,
          as: 'student',
        },
      },
      {
        model: User,
        attributes: {
          exclude: ['password'],
        },
        as: 'firstFriend',
      },
      {
        model: User,
        attributes: {
          exclude: ['password'],
        },
        as: 'secondFriend',
      },
    ],
  });

  let privatePrice = 0;
  let groupPrice = 0;

  if (
    cartItem.teacher
    && cartItem.teacher.userDetail
    && cartItem.teacher.userDetail.price
  ) {
    privatePrice = cartItem.teacher.userDetail.price.private;
    groupPrice = cartItem.teacher.userDetail.price.group;
  } else {
    const defaultPrice = await Price.findOne({
      where: {
        type: 'A',
      },
    });

    privatePrice = defaultPrice.private;
    groupPrice = defaultPrice.group;
  }

  const convertDay = cartItem.availabilityHour
    ? days(cartItem.availabilityHour.dayCode)
    : days(moment(cartItem.startTime).day());
  const convertDate = cartItem.startTime ? dates(cartItem.startTime) : null;

  const data = {
    cartItemId: cartItem.id,
    teacherId: cartItem.teacherId,
    studentId: cartItem.cart.student.id,
    teacherSubjectId: cartItem.teacherSubjectId,
    availabilityHoursId: cartItem.availabilityHoursId,
    gradeId: cartItem.teacherSubject.gradeId,
    gradeGroupId: cartItem.teacherSubject.grade.gradeGroupId,
    curriculumId: cartItem.teacherSubject.grade.gradeGroup.curriculumId,
    subjectId: cartItem.teacherSubject.subjectId,
    student: `${cartItem.cart.student.firstName} ${cartItem.cart.student.lastName}`,
    teacher: `${cartItem.teacher.firstName} ${cartItem.teacher.lastName}`,
    type: cartItem.typeCourse,
    subject: cartItem.teacherSubject.subject.subjectName,
    grade: cartItem.teacherSubject.grade.gradeName,
    gradeCode: cartItem.teacherSubject.grade.gradeCode,
    gradeGroup: cartItem.teacherSubject.grade.gradeGroup.gradeGroupName,
    curriculum: cartItem.teacherSubject.grade.gradeGroup.curriculum.curriculumName,
    date: `${convertDay}, ${convertDate}`,
    time: `${moment(cartItem.startTime).format('HH:mm')} - ${moment(
      cartItem.endTime,
    ).format('HH:mm')}`,
    status: cartItem.cartItemStatus,
    price: cartItem.typeCourse == 'private' ? privatePrice : groupPrice,
    requestMaterial: cartItem.requestMaterial ? cartItem.requestMaterial : null,
    imageMaterial: cartItem.imageMaterial ? cartItem.imageMaterial : null,
    friend1: cartItem.firstFriend,
    friend2: cartItem.secondFriend,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
  };

  res.sendWrapped(data, httpStatus.OK);
});

const updateStatusCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { cartItemStatus } = req.body;

  const cartItem = await cartService.updateCart(id, cartItemStatus);

  res.sendWrapped(cartItem, httpStatus.OK);
});

const updateRequestMateri = catchAsync(async (req, res) => {
  const { id } = req.params;
  const destination = 'images/material';

  const conditionStatus = [PENDING, ACCEPT, PROCESS];

  const checkCartItem = await cartService.getCartItemById(id);

  if (!conditionStatus.some((value) => checkCartItem.cartItemStatus.includes(value))) {
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

    const updateMaterial = await cartService.updateRequestMateri(
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

    if (checkCartItem.typeCourse == 'private' && (email1 || email2)) {
      return res.sendWrapped('Menambahkan teman hanya dapat dilakukan pada keranjang yang memiliki tipe group', httpStatus.CONFLICT);
    } if (checkCartItem.typeCourse == 'group') {
      const filtering = group.filter((o) => o.email && o.phone);

      if (filtering.length > 0) {
        if (filtering.length == 1) {
          const user = await userService.getUserByEmail(filtering[0].email);

          if (!user) {
            return res.sendWrapped(`${filtering[0].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
          }

          if (email1) {
            const updateFriend = await CartItem.update(
              {
                friend1: user.id,
              },
              {
                where: {
                  id,
                },
              },
            );

            console.log('have data and update friend 1', updateFriend);
          } else if (email2) {
            const updateFriend = await CartItem.update(
              {
                friend2: user.id,
              },
              {
                where: {
                  id,
                },
              },
            );

            console.log('have data and update friend 2', updateFriend);
          }
        } else if (filtering.length == 2) {
          const user1 = await userService.getUserByEmail(filtering[0].email);
          const user2 = await userService.getUserByEmail(filtering[1].email);

          if (!user1) {
            // arrayFriend.push(filtering[0].email);
            return res.sendWrapped(`${filtering[0].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
          }
          const updateFriend1 = await CartItem.update(
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

          // USER 2
          if (!user2) {
            arrayFriend.push(filtering[1].email);
            return res.sendWrapped(`${filtering[1].email} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES!`, httpStatus.NOT_FOUND);
          }
          const updateFriend2 = await CartItem.update(
            {
              friend2: user2.id,
            },
            {
              where: {
                id,
              },
            },
          );

          console.log('have data and update friend 2', updateFriend2);
        }
      }

      // if (arrayFriend.length == 2) {
      //   return res.sendWrapped(`${arrayFriend[0]} dan ${arrayFriend[1]} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES`, httpStatus.NOT_FOUND);
      // }

      // if (arrayFriend.length == 1) {
      //   return res.sendWrapped(`${arrayFriend[0]} belum terdaftar di aplikasi. Yuk ajak temanmu untuk register di SEBISLES`, httpStatus.NOT_FOUND);
      // }
    }

    const response = await cartService.getCartItemById(id);

    res.sendWrapped(response, httpStatus.OK);
  });
});

const deleteCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const cartItem = await cartService.deleteCartItem(id);

  res.sendWrapped(cartItem, httpStatus.OK);
});

module.exports = {
  getOrderList,
  addCart,
  approvingOrder,
  viewCart,
  getCartById,
  updateStatusCart,
  updateRequestMateri,
  deleteCartItem,
};
