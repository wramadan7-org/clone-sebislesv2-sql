const fcmQueue = require('./fcmQueue');
const reminderQueue = require('./reminderQueue');

const initializeQueue = () => {
  fcmQueue.initializeFcmQueue();
  reminderQueue.initializeReminderQueue();
};

module.exports = {
  initializeQueue,
};
