const httpStatus = require('http-status');
const moment = require('moment');
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

/**
 * Filter les umum
 * @param {string} curriculumId
 * @returns object
 */
const filterLes = async (curriculumId) => {
  const curriculum = await Curriculum.findOne(
    {
      where: {
        id: curriculumId,
      },
      include: [
        {
          model: GradeGroup,
          include: {
            model: Grade,
          },
        },
      ],
    },
  );

  const subjects = await Subject.findAll();

  const mapGradeGroup = curriculum.gradeGroups.map((o) => {
    const dataGradeGroup = {
      gradeGroupId: o.id,
      gradeGroupCode: o.gradeGroupCode,
      gradeGroupName: o.gradeGroupName,
      temporaryGradeId: o.temporaryGradeId ? o.temporaryGradeId : null,
      grades: o.grades.map((g) => {
        const dataGrade = {
          gradeId: g.id,
          gradeCode: g.gradeCode,
          gradeName: g.gradeName,
        };
        return dataGrade;
      }).sort((a, b) => a.gradeCode - b.gradeCode),
    };
    return dataGradeGroup;
  });

  const mapSubject = subjects.map((o) => {
    const dataSubject = {
      id: o.id,
      subjectCode: o.subjectCode,
      subjectName: o.subjectName,
    };
    return dataSubject;
  });

  const dataResults = {
    curriculumId,
    curriculumCode: curriculum.curriculumCode,
    curriculumName: curriculum.curriculumName,
    gradeGroups: mapGradeGroup,
    subjects: mapSubject,
  };

  return dataResults;
};

module.exports = {
  filterLes,
};
