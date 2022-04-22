/* eslint-disable default-case */
const moment = require('moment');

const dates = (fullDate) => {
  const defaultFullDate = moment(fullDate).format('YYYY-MM-DD');
  const year = moment(defaultFullDate).format('YYYY');
  const month = moment(defaultFullDate).format('MM');
  const date = moment(defaultFullDate).format('DD');

  let nameMonth = '';

  switch (parseInt(month)) {
    case 1:
      nameMonth = 'Januari';
      break;
    case 2:
      nameMonth = 'Februari';
      break;
    case 3:
      nameMonth = 'Maret';
      break;
    case 4:
      nameMonth = 'April';
      break;
    case 5:
      nameMonth = 'Mei';
      break;
    case 6:
      nameMonth = 'Juni';
      break;
    case 7:
      nameMonth = 'Juli';
      break;
    case 8:
      nameMonth = 'Agustus';
      break;
    case 9:
      nameMonth = 'September';
      break;
    case 10:
      nameMonth = 'Oktober';
      break;
    case 11:
      nameMonth = 'November';
      break;
    case 12:
      nameMonth = 'Desember';
      break;
  }
  return `${date} ${nameMonth} ${year}`;
};

module.exports = dates;
