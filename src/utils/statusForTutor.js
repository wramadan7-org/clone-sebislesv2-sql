const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

const statusForTutor = (param) => {
  let statusLes;

  if (param == PENDING) {
    statusLes = 'Menunggu konfirmasi';
  } else if (param == ACCEPT) {
    statusLes = 'Les diterima';
  } else if (param == REJECT) {
    statusLes = 'Les ditolak';
  } else if (param == CANCEL) {
    statusLes = 'Les dibatalkan Siswa.';
  } else if (param == EXPIRE) {
    statusLes = 'Les kadaluarsa.';
  } else if (param == DONE) {
    statusLes = 'Les sudah selesai.';
  } else if (param == `c${PENDING}`) {
    statusLes = 'Menunggu konfirmasi';
  } else if (param == `c${ACCEPT}`) {
    statusLes = 'Les ditambahkan ke keranjang oleh Siswa';
  } else if (param == `c${REJECT}`) {
    statusLes = 'Pesanan les ditolak';
  } else if (param == `c${CANCEL}`) {
    statusLes = 'Pesanan les dibatalkan oleh Siswa.';
  } else if (param == `c${EXPIRE}`) {
    statusLes = 'Pesanan les kadaluarsa';
  } else if (param == `c${DONE}`) {
    statusLes = 'Pesanan les sudah dibayar oleh Siswa.';
  } else {
    statusLes = '';
  }

  return statusLes;
};

module.exports = statusForTutor;
