const httpStatus = require('http-status');
const moment = require('moment');
const {
  getAllPesananKelas,
  getPesananKelas,
  getPesananKelasOnlyDateRange,
  getSiswaByKeyword,
  getAllSiswa,
  getReportTutor,
  getSiswaBy,
  getReportTutorByUserId,
  getUserByKeyword,
  getPesananByUserId,
  createAttendanceTeacher,
  getAllAttendaceTeacher,
  getAttendanceTeacherByKeyword,
  getScheduleClass,
  getTutorBy,
  getRatingTutorByUserId,
  getRatingTutors,
  getAllSchedule,
  getAllTutor,
  getTutorByReport,
  getRatingTutor,
  getReportTutorById,
  getRatingTutorById,
} = require('../services/adminService');
const { getScheduleById, getSchedule } = require('../services/scheduleService');
const { getTeacherSubjectById } = require('../services/teacherSubjectService');
const { getSubjectById } = require('../services/subjectService');
const { getUserById } = require('../services/userService');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  definePage,
  getPagingData,
  arrayPaginator,
} = require('../utils/pagination');

const getPesanan = catchAsync(async (req, res) => {
  const { query } = req;
  const { keyword } = query;
  const { page, size, offset } = definePage(query.page, query.size);
  let { status, endDate, startDate } = query;
  let pesanan;
  let result;

  if (!startDate && !endDate) {
    startDate = moment().add(-3, 'years');
    endDate = moment();
  }
  startDate = moment(startDate).add(-1, 'days');
  endDate = moment(endDate).add(1, 'days');

  if (status) {
    pesanan = await getPesananKelas(status, startDate, endDate, size, offset);
  } else if (startDate && endDate) {
    pesanan = await getPesananKelasOnlyDateRange(
      startDate,
      endDate,
      size,
      offset,
    );
  } else if (size && page) {
    pesanan = await getAllPesananKelas(size, offset);
  }

  if (keyword) {
    let user = await getUserByKeyword(keyword);
    if (user.length) {
      user.forEach(async (e) => {
        pesanan = await getPesananByUserId(
          e.id,
          startDate,
          endDate,
          size,
          offset,
        );

        result = getPagingData(pesanan, page, size);
        res.sendWrapped(result, httpStatus.OK);
      });
    } else {
      res.sendWrapped('Data Not Found', httpStatus.NOT_FOUND);
    }
  } else {
    result = getPagingData(pesanan, page, size);
    res.sendWrapped(result, httpStatus.OK);
  }
});

const getSiswa = catchAsync(async (req, res) => {
  const { query } = req;
  let { keyword, startDate, endDate } = query;
  const { page, size, offset } = definePage(query.page, query.size);
  let siswa;

  if (!startDate && !endDate) {
    startDate = moment().add(-3, 'years');
    endDate = moment();
  }
  startDate = moment(startDate).add(-1, 'days');
  endDate = moment(endDate).add(1, 'days');

  if (keyword) {
    siswa = await getSiswaByKeyword(keyword, startDate, endDate, size, offset);
  } else {
    siswa = await getAllSiswa(startDate, endDate, size, offset);
  }

  let result = getPagingData(siswa, page, size);
  res.sendWrapped(result, httpStatus.OK);
});

const getReport = catchAsync(async (req, res) => {
  const { query } = req;
  let {
    student, startDate, endDate, studentId, id,
  } = query;
  const { page, size, offset } = definePage(query.page, query.size);
  let report;
  let murid;
  let result;

  if (!startDate && !endDate) {
    startDate = moment().add(-3, 'years');
    endDate = moment();
  }
  startDate = moment(startDate).add(-1, 'days');
  endDate = moment(endDate).add(1, 'days');

  if (student) {
    murid = await getSiswaBy(student);
    if (murid.length) {
      murid.forEach(async (e) => {
        report = await getReportTutorByUserId(
          e.id,
          startDate,
          endDate,
          size,
          offset,
        );
        result = getPagingData(report, page, size);
        res.sendWrapped(result, httpStatus.OK);
      });
    } else {
      res.sendWrapped('Data Not Found', httpStatus.NOT_FOUND);
    }
  } else if (studentId) {
    report = await getReportTutorByUserId(
      studentId,
      startDate,
      endDate,
      size,
      offset,
    );
    result = getPagingData(report, page, size);
    res.sendWrapped(result, httpStatus.OK);
  } else if (id) {
    report = await getReportTutorById(id);

    res.sendWrapped(report, httpStatus.OK);
  } else {
    report = await getReportTutor(startDate, endDate, size, offset);
    result = getPagingData(report, page, size);
    res.sendWrapped(result, httpStatus.OK);
  }
});

const reportTutorSiswa = catchAsync(async (req, res) => {
  const { query } = req;
  let {
    name, teacher, student, startDate, endDate,
  } = query;
  const { page, size, offset } = definePage(query.page, query.size);
  let report = [];
  let reportRating = [];
  let rating;
  let averageRating = [];

  if (!startDate && !endDate) {
    startDate = moment().add(-3, 'years');
    endDate = moment();
  }
  startDate = moment(startDate).add(-1, 'days');
  endDate = moment(endDate).add(1, 'days');

  const ratingTutor = await getRatingTutor();
  ratingTutor.forEach((e) => {
    const data = {
      tutorRating: e.averageRating,
      tutorId: e.tutorId,
    };
    averageRating.push(data);
  });

  rating = 0;
  const jadwal = await getAllSchedule();
  jadwal.forEach(async (e) => {
    const data = {
      id: e.id,
      tutorId: e.teacherId,
      tutorName: `${e.teacher.firstName} ${e.teacher.lastName}`,
      studentId: e.studentId,
      studentName: `${e.student.firstName} ${e.student.lastName}`,
      classDate: e.dateSchedule,
      classTime: moment(e.dateSchedule).format('HH:mm'),
      typeClass: e.typeClass,
      subject: e.teacherSubject.subject.subjectName,
      grade: e.teacherSubject.grade.gradeName,
      // tutorRating: `Bintang ${rating}`,
    };
    report.push(data);
  });

  const merge = (arr1, arr2) => {
    const temp = [];

    arr1.forEach((x) => {
      arr2.forEach((y) => {
        if (x.tutorId === y.tutorId) {
          temp.push({ ...x, ...y });
        }
      });
    });

    return temp;
  };
  // merge report and rating
  let mergedReport = merge(report, averageRating);

  // merge array + remove duplicate
  let ids = new Set(mergedReport.map((d) => d.tutorId));
  let merged = [...mergedReport, ...report.filter((d) => !ids.has(d.tutorId))];

  if (name) {
    merged = merged.filter(
      (item) => item.tutorName.includes(name)
        || (item.studentName.includes(name)
          && item.classDate >= startDate
          && item.classDate <= endDate),
    );
  } else {
    merged = merged.filter(
      (item) => item.classDate >= startDate && item.classDate <= endDate,
    );
  }

  let data = arrayPaginator(merged, page, size);

  res.sendWrapped(data, httpStatus.OK);
});

const createAttendance = catchAsync(async (req, res) => {
  const { body } = req;
  let status;

  const checkSchedule = await getScheduleById(body.scheduleId);
  if (!checkSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule Not Found');
  }
  const { dateSchedule, teacherSubjectId } = checkSchedule;
  const { subjectId } = await getTeacherSubjectById(
    req.user.id,
    teacherSubjectId,
  );
  const { subjectName } = await getSubjectById(subjectId);
  if (moment(dateSchedule) >= moment()) {
    status = 'Tepat waktu';
  } else {
    status = 'Telat';
  }

  const { firstName, lastName } = await getUserById(req.user.id);
  body.teacherId = req.user.id;
  body.status = status;
  body.teacherName = `${firstName} ${lastName}`;
  body.subject = subjectName;
  const attendance = await createAttendanceTeacher(body);
  res.sendWrapped(attendance, httpStatus.CREATED);
});

const getAttendance = catchAsync(async (req, res) => {
  const { query } = req;
  let { keyword, startDate, endDate } = query;
  const { page, size, offset } = definePage(query.page, query.size);

  if (!startDate && !endDate) {
    startDate = moment().add(-3, 'years');
    endDate = moment();
  }
  startDate = moment(startDate).add(-1, 'days');
  endDate = moment(endDate).add(1, 'days');

  let attendance;
  if (keyword) {
    attendance = await getAttendanceTeacherByKeyword(
      keyword,
      startDate,
      endDate,
      size,
      offset,
    );
  } else {
    attendance = await getAllAttendaceTeacher(startDate, endDate, size, offset);
  }
  const result = getPagingData(attendance, page, size);
  res.sendWrapped(result, httpStatus.OK);
});

const kelasBerlangsung = catchAsync(async (req, res) => {
  const { query } = req;
  let { startDate, endDate } = query;
  const status = 'accept  ';
  startDate = moment().add(-12, 'hours');
  endDate = moment().add(1, 'hours');

  const jadwal = await getScheduleClass(startDate, endDate, status);
  res.sendWrapped(jadwal, httpStatus.OK);
});

const ratingTutor = catchAsync(async (req, res) => {
  const { query } = req;
  let {
    tutor, tutorId, id, startDate, endDate,
  } = query;
  const { page, size, offset } = definePage(query.page, query.size);
  let rating;
  let guru;
  let result;

  if (!startDate && !endDate) {
    startDate = moment().add(-3, 'years');
    endDate = moment();
  }
  startDate = moment(startDate).add(-1, 'days');
  endDate = moment(endDate).add(1, 'days');

  if (tutor) {
    guru = await getTutorBy(tutor);
    if (guru.length) {
      guru.forEach(async (e) => {
        rating = await getRatingTutorByUserId(
          e.id,
          startDate,
          endDate,
          size,
          offset,
        );
        result = getPagingData(rating, page, size);
        res.sendWrapped(result, httpStatus.OK);
      });
    } else {
      res.sendWrapped('Data Not Found', httpStatus.NOT_FOUND);
    }
  } else if (tutorId) {
    rating = await getRatingTutorByUserId(
      tutorId,
      startDate,
      endDate,
      size,
      offset,
    );
    result = getPagingData(rating, page, size);
    res.sendWrapped(result, httpStatus.OK);
  } else if (id) {
    rating = await getRatingTutorById(id);
    res.sendWrapped(rating, httpStatus.OK);
  } else {
    rating = await getRatingTutors(startDate, endDate, size, offset);
    result = getPagingData(rating, page, size);
    res.sendWrapped(result, httpStatus.OK);
  }
});

const kelasTutor = catchAsync(async (req, res) => {
  const { query } = req;
  let { tutor, startDate, endDate } = query;
  let kelas = [];
  let data;
  const teacher = await getAllTutor();

  teacher.forEach(async (e) => {
    // const accept = await getScheduleByUserIdAndStatus(e.id, 'accept');

    data = {
      teacherId: e.id,
      teacherName: `${e.firstName} ${e.lastName}`,
      notResponClass: null,
      rejectedClass: null,
      absentClass: null,
      orderedClass: null,
      statusTeacher: null,
    };

    kelas.push(data);
  });
  if (tutor) {
    kelas = kelas.filter((item) => item.teacherName.includes(tutor));
  }
  res.sendWrapped(kelas, httpStatus.OK);
});

const detailKelasTutor = catchAsync(async (req, res) => {
  const { query } = req;
  let {
    tutor, statusSchedule, startDate, endDate,
  } = query;
  const { page, size } = definePage(query.page, query.size);
  let schedule;
  let tutorClass = [];
  if (!startDate && !endDate) {
    startDate = moment().add(-3, 'years');
    endDate = moment();
  }
  startDate = moment(startDate).add(-1, 'days');
  endDate = moment(endDate).add(1, 'days');

  const kelas = await getAllSchedule();
  kelas.forEach(async (e) => {
    schedule = {
      id: e.id,
      teacherName: `${e.teacher.firstName} ${e.teacher.lastName}`,
      teacherId: e.teacherId,
      availabilityHoursId: e.availabilityHoursId,
      studentId: e.studentId,
      studentName: `${e.student.firstName} ${e.student.lastName}`,
      dateSchedule: e.dateSchedule,
      statusSchedule: e.statusSchedule,
      subject: e.teacherSubject.subject.subjectName,
    };
    tutorClass.push(schedule);
  });

  if (tutor) {
    tutorClass = tutorClass.filter(
      (item) => item.teacherName.includes(tutor)
        && item.dateSchedule >= startDate
        && item.dateSchedule <= endDate,
    );
  }

  if (statusSchedule) {
    tutorClass = tutorClass.filter(
      (item) => item.statusSchedule.includes(statusSchedule)
        && item.dateSchedule >= startDate
        && item.dateSchedule <= endDate,
    );
  }

  if (tutor && statusSchedule) {
    tutorClass = tutorClass.filter(
      (item) => item.teacherName.includes(tutor)
        && item.statusSchedule.includes(statusSchedule)
        && item.dateSchedule >= startDate
        && item.dateSchedule <= endDate,
    );
  }

  let data = arrayPaginator(tutorClass, page, size);

  res.sendWrapped(data, httpStatus.OK);
});
module.exports = {
  getPesanan,
  getSiswa,
  getReport,
  createAttendance,
  getAttendance,
  kelasBerlangsung,
  ratingTutor,
  detailKelasTutor,
  kelasTutor,
  reportTutorSiswa,
};
