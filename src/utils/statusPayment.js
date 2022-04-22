const {
  PENDING,
  ACCEPT,
  REJECT,
  CANCEL,
  EXPIRE,
  PROCESS,
  DONE,
  DELETE,
} = process.env;

const statusPayment = (param) => {
  let status;

  if (param == PENDING) {
    status = 'Menunggu pembayaran';
  } else if (param == PROCESS) {
    status = 'Pembayaran sedang diproses';
  } else if (param == CANCEL) {
    status = 'Pembayaran dibatalkan';
  } else if (param == EXPIRE) {
    status = 'Pembayaran kadaluarsa';
  } else if (param == REJECT) {
    status = 'Pembayaran gagal';
  } else if (param == DONE) {
    status = 'Pembayaran berhasil';
  } else {
    status = '';
  }

  return status;
};

module.exports = statusPayment;
