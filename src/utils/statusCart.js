const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

const statusCart = (param) => {
  let statusLes;

  if (param == PENDING) {
    statusLes = 'Menunggu konfirmasi Tutor.';
  } else if (param == ACCEPT) {
    statusLes = 'Menunggu dibayar Siswa.';
  } else if (param == REJECT) {
    statusLes = 'Ditolak oleh Tutor.';
  } else if (param == CANCEL) {
    statusLes = 'Dibatalkan Siswa.';
  } else if (param == EXPIRE) {
    statusLes = 'Kadaluarsa.';
  } else if (param == DONE) {
    statusLes = 'Sudah dibayar Siswa.';
  } else {
    statusLes = '';
  }

  return statusLes;
};

module.exports = statusCart;
