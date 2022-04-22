const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Role } = require('../models/Role');
const ApiError = require('../utils/ApiError');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');

const {
  PENDING, ACCEPT, REJECT,
} = process.env;

const getTeacherSubjects = async (opts = {}) => {
  const teacherSubject = await TeacherSubject.findAll(
    {
      ...opts,
    },
  );

  if (teacherSubject.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not have subject.');

  return teacherSubject;
};

const getTeacherSubjectDetail = async (teacherId, gradeId, subjectId) => {
  const teacherSubject = await TeacherSubject.findOne(
    {
      where: {
        teacherId,
        gradeId,
        subjectId,
      },
    },
  );

  return teacherSubject;
};

const getTeacherSubjectById = async (teacherId, teacherSubjectId, opts = {}) => {
  const teacherSubject = await TeacherSubject.findOne(
    {
      where: {
        id: teacherSubjectId,
        teacherId,
      },
      ...opts,
    },
  );

  return teacherSubject;
};

const getTeacherSubjectAnotherOnId = async (teacherSubjectId, teacherId, gradeId, subjectId) => {
  const teacherSubject = await TeacherSubject.findAll(
    {
      where: {
        id: {
          [Op.ne]: teacherSubjectId,
        },
        teacherId,
        gradeId,
        subjectId,
      },
    },
  );

  return teacherSubject;
};

const getRecommendTutor = async (teacherId, subjectId, gradeId, opts = {}) => {
  const teacherSubject = await TeacherSubject.findAll(
    {
      where: {
        teacherId: {
          [Op.notLike]: teacherId,
        },
        subjectId,
        gradeId,
      },
      ...opts,
    },
  );

  return teacherSubject;
};

const createTeacherSubject = async (teacherId, data) => {
  const teacherSubject = await getTeacherSubjectDetail(
    teacherId,
    data.gradeId,
    data.subjectId,
  );

  if (teacherSubject) throw new ApiError(httpStatus.CONFLICT, 'Sudah ada mata pelajaran yang sama.');

  const dataSubject = {
    teacherId,
    ...data,
    type: 'private',
    request: PENDING,
  };

  const created = await TeacherSubject.create(dataSubject);

  return created;
};

const updateTeacherSubject = async (teacherSubjectId, teacherId, teacherSubjectBody) => {
  const teacherSubject = await getTeacherSubjectById(
    teacherId,
    teacherSubjectId,
  );

  if (!teacherSubject) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher subject not found.');

  const teacherSubjectAnother = await getTeacherSubjectAnotherOnId(
    teacherSubjectId,
    teacherId,
    teacherSubjectBody.gradeId,
    teacherSubjectBody.subjectId,
  );

  if (teacherSubjectAnother.length > 0) throw new ApiError(httpStatus.CONFLICT, 'Teacher subject is already exists');

  const dataTeacherSubject = {
    gradeId: teacherSubjectBody.gradeId,
    subjectId: teacherSubjectBody.subjectId,
  };

  teacherSubject.update(dataTeacherSubject);

  return teacherSubject;
};

const deleteTeacherSubject = async (teacherSubjectId, teacherId) => {
  const teacherSubject = await getTeacherSubjectById(teacherId, teacherSubjectId);

  if (!teacherSubject) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher subject not found.');

  teacherSubject.destroy();

  return teacherSubject;
};

const getOwnTeacherSubject = async (userId, opts = {}) => {
  const teacherSubject = await TeacherSubject.findAll(
    {
      where: {
        teacherId: userId,
      },
      ...opts,
    },
  );

  return teacherSubject;
};

/**
 * Get all teacher subject by teacher Id
 * @param { String } teacherId
 * @param { Object } opts
 * @returns { Promise<Array> }
 */
const getTeacherSubjectByTeacherId = async (teacherId, opts = {}) => {
  const teacherSubject = await TeacherSubject.findAll(
    {
      where: {
        teacherId,
      },
      ...opts,
    },
  );

  return teacherSubject;
};

/**
 * Get teacher subject only by Id
 * @param { String } teacherSubjectId
 * @param { Object } opts
 * @returns { Promise <Object | null> }
 */
const getTeacherSubjectOnlyById = async (teacherSubjectId, opts = {}) => {
  const teacherSubject = await TeacherSubject.findOne(
    {
      where: {
        id: teacherSubjectId,
      },
      ...opts,
    },
  );

  return teacherSubject;
};

/**
 * Update status or request teacher subject
 * @param { String } teacherSubjectId
 * @param { String } status
 * @param { String } request
 * @returns
 */
const approveTeacherSubjectById = async (teacherSubjectId, status, request) => {
  const approve = await TeacherSubject.update(
    {
      status,
      request,
    },
    {
      where: {
        id: teacherSubjectId,
      },
      individualHooks: true,
    },
  );

  return approve;
};

module.exports = {
  getTeacherSubjects,
  getTeacherSubjectDetail,
  getTeacherSubjectById,
  getTeacherSubjectAnotherOnId,
  getRecommendTutor,
  createTeacherSubject,
  updateTeacherSubject,
  deleteTeacherSubject,
  getOwnTeacherSubject,
  getTeacherSubjectByTeacherId,
  getTeacherSubjectOnlyById,
  approveTeacherSubjectById,
};
