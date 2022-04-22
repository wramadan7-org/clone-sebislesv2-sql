const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

const statusSchedule = (param) => {
  let statusLes;

  if (param == PENDING) {
    statusLes = 'Menunggu konfirmasi Tutor.';
  } else if (param == ACCEPT) {
    statusLes = 'Les diterima Tutor.';
  } else if (param == REJECT) {
    statusLes = 'Les ditolak Tutor.';
  } else if (param == CANCEL) {
    statusLes = 'Les dibatalkan Siswa.';
  } else if (param == EXPIRE) {
    statusLes = 'Les kadaluarsa.';
  } else if (param == DONE) {
    statusLes = 'Les sudah selesai.';
  } else {
    statusLes = '';
  }

  return statusLes;
};

module.exports = statusSchedule;
