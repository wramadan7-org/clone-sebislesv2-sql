const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { paginator } = require('../utils/pagination');

const teacherSubjectService = require('../services/teacherSubjectService');

const ApiError = require('../utils/ApiError');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const { Duration } = require('../models/Duration');

const {
  PENDING, ACCEPT, REJECT,
} = process.env;

const createTeacherSubject = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacherSubjectBody = req.body;

  const teacherSubject = await teacherSubjectService.createTeacherSubject(
    teacherId,
    teacherSubjectBody,
  );

  if (!teacherSubject) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambah mata pelajaran.');

  res.sendWrapped(teacherSubject, httpStatus.CREATED);
});

const getTeacherSubjectAll = catchAsync(async (req, res) => {
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

  const teacherSubject = await teacherSubjectService.getTeacherSubjects(
    {
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
  );

  if (teacherSubject.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher subject empty');

  const sorting = teacherSubject.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginate = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

const getTeacherSubjectById = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { teacherSubjectId } = req.params;

  const teacherSubject = await teacherSubjectService.getTeacherSubjectById(
    teacherId,
    teacherSubjectId,
    {
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
  );

  if (!teacherSubject) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher subject not found.');

  res.sendWrapped(teacherSubject, httpStatus.OK);
});

const updateTeacherSubject = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { teacherSubjectId } = req.params;
  const teacherSubjectBody = req.body;

  const teacherSubject = await teacherSubjectService.updateTeacherSubject(
    teacherSubjectId,
    teacherId,
    teacherSubjectBody,
  );

  res.sendWrapped(teacherSubject, httpStatus.OK);
});

const deleteTeacherSubject = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { teacherSubjectId } = req.params;

  const deleting = await teacherSubjectService.deleteTeacherSubject(teacherSubjectId, teacherId);

  res.sendWrapped(deleting, httpStatus.OK);
});

// Tutor

const getOwnTeacherSubject = catchAsync(async (req, res) => {
  const { id } = req.user;
  let { page, limit, qrequest } = req.query;

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

  const teacherSubject = await teacherSubjectService.getOwnTeacherSubject(
    id,
    {
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
  );

  const mapTeacherSubject = teacherSubject.map((o) => {
    let request = null;

    switch (o.request) {
      case PENDING:
        request = 'menunggu konfirmasi';
        break;
      case ACCEPT:
        request = 'pengajuan diterima';
        break;
      case REJECT:
        request = 'penagjuan ditolak';
        break;
      default:
        request = 'menunggu konfrimasi';
        break;
    }

    const data = {
      teacherSubjectId: o.id,
      subjectId: o.subjectId,
      gradeId: o.gradeId,
      gradeGroupId: o.grade.gradeGroupId,
      subject: o.subject.subjectName,
      curriculum: o.grade.gradeGroup.curriculum.curriculumName,
      gradeGroup: o.grade.gradeGroup.gradeGroupName,
      grade: `Kelas ${o.grade.gradeCode}`,
      status: o.status,
      request,
      defaultStatusRequest: o.request,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter((o) => (qrequest === 'true' ? (o.defaultStatusRequest === PENDING || o.defaultStatusRequest === REJECT) : o.defaultStatusRequest == ACCEPT));

  const paginate = paginator(mapTeacherSubject, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

module.exports = {
  createTeacherSubject,
  getTeacherSubjectAll,
  getTeacherSubjectById,
  updateTeacherSubject,
  deleteTeacherSubject,
  getOwnTeacherSubject,
};
