/* eslint-disable default-case */
const days = (numDay) => {
  let nameDay = '';

  switch (numDay) {
    case 0:
      nameDay = 'Minggu';
      break;
    case 1:
      nameDay = 'Senin';
      break;
    case 2:
      nameDay = 'Selasa';
      break;
    case 3:
      nameDay = 'Rabu';
      break;
    case 4:
      nameDay = 'Kamis';
      break;
    case 5:
      nameDay = 'Jumat';
      break;
    case 6:
      nameDay = 'Sabtu';
      break;
  }
  return nameDay;
};

module.exports = days;
