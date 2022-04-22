const httpStatus = require('http-status');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const migrateService = require('../services/migrationService');

const listUser = catchAsync(async (req, res) => {
  const user = await migrateService.listUser();

  // if (user.length <= 0) {
  //     return res.sendWraped('Data empty', httpStatus.NOT_FOUND);
  // };

  // fs.writeFileSync('./public/files/userJson.json', JSON.stringify(user));

  res.sendWrapped(user, httpStatus.OK);
});

const addUser = catchAsync(async (req, res) => {
  const user = await migrateService.addUser();
  // fs.writeFileSync('./public/files/userFix.csv', JSON.stringify(user));

  res.sendWrapped(user, httpStatus.CREATED);
});

const addUserDetail = catchAsync(async (req, res) => {
  const userDetail = await migrateService.addUserDetail();

  // fs.writeFileSync('./public/files/userDetailFix.json', JSON.stringify(userDetail));

  res.sendWrapped(userDetail, httpStatus.CREATED);
});

const addTeachingExperiences = catchAsync(async (req, res) => {
  const teachingExperience = await migrateService.addTeachingExperience();

  res.sendWrapped(teachingExperience, httpStatus.CREATED);
});

const addEducationBackground = catchAsync(async (req, res) => {
  const educationBakground = await migrateService.addEducationBackground();

  res.sendWrapped(educationBakground, httpStatus.CREATED);
});

const addBank = catchAsync(async (req, res) => {
  const bank = await migrateService.addBank();

  res.sendWrapped(bank, httpStatus.CREATED);
});

const addDevice = catchAsync(async (req, res) => {
  const devices = await migrateService.addDevice();

  res.sendWrapped(devices, httpStatus.CREATED);
});

const addSubject = catchAsync(async (req, res) => {
  const subject = await migrateService.addSubject();

  res.sendWrapped(subject, httpStatus.CREATED);
});

const addGradeGroup = catchAsync(async (req, res) => {
  const grade = await migrateService.addGradeGroup();

  res.sendWrapped(grade, httpStatus.CREATED);
});

const addAvailabilityHours = catchAsync(async (req, res) => {
  const availabilityHours = await migrateService.addAvailabilityHours();

  res.sendWrapped(availabilityHours, httpStatus.CREATED);
});

const addTeacherSubjects = catchAsync(async (req, res) => {
  const teacherSubject = await migrateService.addTeacherSubjects();

  res.sendWrapped(teacherSubject, httpStatus.CREATED);
});

const addPrice = catchAsync(async (req, res) => {
  const priceBody = req.body;
  const price = await migrateService.addPrice(priceBody);

  res.sendWrapped(price, httpStatus.OK);
});

module.exports = {
  listUser,
  addUser,
  addUserDetail,
  addTeachingExperiences,
  addEducationBackground,
  addBank,
  addDevice,
  addSubject,
  addGradeGroup,
  addAvailabilityHours,
  addTeacherSubjects,
  addPrice,
};
