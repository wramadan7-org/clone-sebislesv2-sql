const { fcmQueue } = require('../config/bull');
const fcm = require('../utils/fcm');

const teacherQueueName = 'teacher';
const studentQueueName = 'student';

/**
 * Teacher push notification queue producer
 * @param {string[]} registrationIds
 * @param {string} title
 * @param {string} body
 * @param {Object} data
 * @param {Object} opts
 * @returns {void}
 */
const addTeacherQueue = (registrationIds, title, body, { data = {}, opts = {} } = {}) => {
  fcmQueue.add(teacherQueueName, {
    registrationIds,
    title,
    body,
    data,
  }, { ...opts });
};

/**
 * Student push notification queue producer
 * @param {string[]} registrationIds
 * @param {string} title
 * @param {string} body
 * @param {Object} data
 * @param {Object} opts
 * @returns {void}
 */
const addStudentQueue = (registrationIds, title, body, { data = {}, opts = {} } = {}) => {
  fcmQueue.add(studentQueueName, {
    registrationIds,
    title,
    body,
    data,
  }, { ...opts });
};

const initializeFcmQueue = () => {
  // teacher consumer
  fcmQueue.process(teacherQueueName, (job, done) => {
    const {
      registrationIds, title, body, data,
    } = job.data;
    fcm.sendNotificationTeacher(registrationIds, title, body, { data });
    done();
  });
  // student consumer
  fcmQueue.process(studentQueueName, (job, done) => {
    const {
      registrationIds, title, body, data,
    } = job.data;
    fcm.sendNotificationStudent(registrationIds, title, body, { data });
    done();
  });
};

module.exports = {
  initializeFcmQueue,
  addTeacherQueue,
  addStudentQueue,
};
