const FCM = require('fcm-node');
const { fcm } = require('../config/config');

const { teacherKey, studentKey } = fcm;

const fcmTeacher = new FCM(teacherKey);
const fcmStudent = new FCM(studentKey);

/**
 * Notification sender for teacher
 * @param {string[]} registrationIds
 * @param {string} title
 * @param {string} body
 * @param {Object} data
 * @returns {Object}
 */
const sendNotificationTeacher = (registrationIds, title, body, { data = {} } = {}) => {
  const notificationData = {
    registration_ids: registrationIds,
    notification: {
      title,
      body,
    },
    data,
  };

  fcmTeacher.send(notificationData, (error, response) => error || response);
};

/**
 * Notification sender for student
 * @param {string[]} registrationIds
 * @param {string} title
 * @param {string} body
 * @param {Object} data
 * @returns {Object}
 */
const sendNotificationStudent = (registrationIds, title, body, { data = {} } = {}) => {
  const notificationData = {
    registration_ids: registrationIds,
    notification: {
      title,
      body,
    },
    data,
  };

  fcmStudent.send(notificationData, (error, response) => error || response);
};

module.exports = {
  sendNotificationTeacher,
  sendNotificationStudent,
};
