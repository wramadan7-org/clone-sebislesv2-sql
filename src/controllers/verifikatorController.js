const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { paginator } = require('../utils/pagination');

const assessmentService = require('../services/assessmentService');
const interviewReportService = require('../services/questionInterviewService');
const userService = require('../services/userService');
const roleService = require('../services/roleService');
const teacherSubjectService = require('../services/teacherSubjectService');
const teachingExperienceService = require('../services/teachingExperienceService');

const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { TeacherSubject } = require('../models/TeacherSubject');
const { TeachingExperience } = require('../models/TeachingExperience');
const { EducationBackground } = require('../models/EducationBackground');
const { TeachingExperienceDetail } = require('../models/TeachingExperienceDetail');
const { File } = require('../models/Files');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');

const { roleTypes } = require('../config/roles');

const createTutorAssessment = catchAsync(async (req, res) => {
  const { id } = req.user;
  const assessmentBody = req.body;

  const hasAssessment = await assessmentService.getAssessmentByUserId(id);

  if (!hasAssessment) {
    const assessment = await assessmentService.createAssessment(id, assessmentBody);

    if (!assessment) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahakan penilaian pada Tutor.');

    return res.sendWrapped(assessment, httpStatus.OK);
  }

  const assessment = await assessmentService.updateAssessment(hasAssessment.id, assessmentBody);

  if (!assessment) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengganti penilaian pada Tutor.');

  res.sendWrapped(assessment, httpStatus.OK);
});

const reportInterview = catchAsync(async (req, res) => {
  const interviewBody = req.body;

  const role = await roleService.getRoleByRoleName(roleTypes.TEACHER);

  if (!role) throw new ApiError(httpStatus.NOT_FOUND, `Role tidak dapat ditemukan ${roleTypes.TEACHER}.`);

  const user = await userService.getUserById(interviewBody.userId);

  if (user && user.roleId !== role.id) throw new ApiError(httpStatus.BAD_REQUEST, 'Hanya dapat menilai user dengan status sebagai guru.');

  const hasInterview = await interviewReportService.getInterviewReportByUserId(interviewBody.userId);

  const data = {
    ...interviewBody,
    questioner: JSON.stringify(interviewBody.questioner),
  };

  if (!hasInterview) {
    const interview = await interviewReportService.createInterview(data);

    if (!interview) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambah laporan.');

    return res.sendWrapped(data, httpStatus.OK);
  }

  const interview = await interviewReportService.updateInterviewReport(hasInterview.id, data);

  if (!interview) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengubah data laporan interview.');

  res.sendWrapped(interview, httpStatus.OK);
});

const getAllReportInterview = catchAsync(async (req, res) => {
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

  const interview = await interviewReportService.getAllInterview();

  if (!interview) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengambil data interview.');

  const mapInterview = interview.map((o) => {
    const data = {
      userId: o.userId,
      questioner: JSON.parse(o.questioner),
    };

    return data;
  });

  const sorting = mapInterview.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pagination = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, pagination);
});

const getRequestTeacherSubject = catchAsync(async (req, res) => {
  const { userId } = req.params;

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

  const request = await teacherSubjectService.getTeacherSubjectByTeacherId(
    userId,
    {
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
  );

  if (!request) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengambil request data jadwal tutor.');

  const mapRequest = request.map((o) => {
    const data = {
      teacherSubjectId: o.id,
      subjectId: o.subject ? o.subjectId : null,
      gradeId: o.grade ? o.gradeId : null,
      gradeGroupId: o.grade ? o.grade.gradeGroupId : null,
      teacherId: o.teacherId,
      curriculum: o.grade ? o.grade.gradeGroup.curriculum.curriculumName : null,
      grade: o.grade ? `${o.grade.gradeGroup.gradeGroupName} - ${o.grade.gradeCode}` : null,
      subject: o.subject ? o.subject.subjectName : null,
      statusClassActive: o.status ? o.status : false, // Apakah guru masih ingin mengajar di pelajaran ini atau ingin dinonaktifkan
      statusRequestSubject: o.request ? o.request : false,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  const sorting = mapRequest.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pagination = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, pagination);
});

const approveTeahcerSubject = catchAsync(async (req, res) => {
  const { teacherSubjectId } = req.params;
  const approveBody = req.body;

  const teacherSubject = await teacherSubjectService.getTeacherSubjectOnlyById(teacherSubjectId);

  if (!teacherSubject) throw new ApiError(httpStatus.NOT_FOUND, 'Mata pelajran tidak ditemukan.');

  const dataApprove = Object.assign(teacherSubject, approveBody);

  const approve = await teacherSubjectService.approveTeacherSubjectById(teacherSubjectId, dataApprove.status, dataApprove.request);

  if (!approve && !approve[0] && !approve[1]) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengganti status mata pelajaran Tutor.');

  res.sendWrapped(approve[1], httpStatus.OK);
});

const infoTutor = catchAsync(async (req, res) => {
  const { teacherId } = req.params;

  const basicTeacher = await userService.getUserById(
    teacherId,
    {
      include: [
        {
          model: UserDetail,
          attributes: [
            'religion',
            'birthPlace',
            'birthDate',
          ],
        },
        {
          model: TeachingExperience,
          include: [
            {
              model: TeachingExperienceDetail,
            },
          ],
        },
        {
          model: EducationBackground,
        },
        {
          model: File,
        },
        {
          model: User,
          as: 'referrerUser',
        },
        {
          model: User,
          as: 'referredUsers',
        },
      ],
      attributes: [
        'firstName',
        'lastName',
        'gender',
        'phoneNumber',
        'profile',
      ],
    },
  );

  const basicTeacherData = basicTeacher.toJSON();
  const fullUrl = `${req.protocol}://${req.get('host')}/`;

  const convertedFiles = basicTeacher.files.reduce((prevObj, currObj) => {
    const jsonData = currObj.toJSON();
    return {
      ...prevObj,
      [jsonData.fileType]: {
        ...jsonData,
        fileUrl: `${fullUrl}/${jsonData.fileName}`,
      },
    };
  }, {});
  basicTeacherData.files = convertedFiles;

  // Alternative logic
  // const objFiles = {};
  // basicTeacherData.files.forEach((file) => {
  //   const obj = {
  //     ...file.toJSON(),
  //     fileUrl: `${fullUrl}${file.fileType}/${file.fileName}`,
  //   };
  //   objFiles[file.fileType] = obj;
  // });

  // basicTeacher.files = objFiles;
  // basicTeacherData.files = objFiles;

  res.sendWrapped(basicTeacherData, httpStatus.OK);
});

const showTeachingExperience = catchAsync(async (req, res) => {
  const { teachingExperienceId } = req.params;
  const { show } = req.body;

  const teachingExperience = await teachingExperienceService.showTeachingExperience(teachingExperienceId, show);

  if (!teachingExperience && !teachingExperience[0] && !teachingExperience[1]) throw new ApiError(httpStatus.CONFLICT, 'Gagal menampilak/menyembunyikan pengalaman mengajar Tutor.');

  res.sendWrapped(teachingExperience[1], httpStatus.OK);
});

module.exports = {
  createTutorAssessment,
  reportInterview,
  getAllReportInterview,
  getRequestTeacherSubject,
  approveTeahcerSubject,
  infoTutor,
  showTeachingExperience,
};
