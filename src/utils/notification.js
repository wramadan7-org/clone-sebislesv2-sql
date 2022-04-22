require('dotenv').config();

const { FCM_STUDENT_KEY, FCM_TEACHER_KEY } = process.env;
const FCM = require('fcm-node');

const notification = (regisToken, titleMessage, bodyMessage, role) => {
  let fcm;

  switch (role) {
    case role == 'teacher':
      fcm = new FCM(FCM_TEACHER_KEY);
      break;
    case role == 'student':
      fcm = new FCM(FCM_STUDENT_KEY);
      break;
    default:
      fcm = new FCM(FCM_STUDENT_KEY);
  }

  try {
    const message = {
      registration_ids: regisToken,

      notification: {
        title: titleMessage,
        body: bodyMessage,
        android_channel_id: 'custom-channel-id',
        sound: 'sebissound.mp3',
      },

      data: {
        my_key: 'myValue',
        my_another_key: 'my another value',
      },
    };
    // console.log('message', message)

    fcm.send(message, (err, response) => {
      if (err) {
        console.log('Something has gone wrong!', err);
      } else {
        console.log('Successfully sent it with response', response);
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = notification;
