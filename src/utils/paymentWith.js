const paymentWith = (param) => {
  let payWith;
  if (param.payment_type == 'gopay') {
    payWith = 'gopay';
  } else if (param.payment_type == 'shopeepay') {
    payWith = 'shopeepay';
  } else if (param.payment_type == 'qris') {
    payWith = `${param.acquirer} - qris`;
  } else if (param.payment_type == 'echannel') {
    payWith = 'mandiri bill';
  } else if (param.payment_type == 'bca_klikpay') {
    payWith = 'bca klikpay';
  } else if (param.payment_type == 'bca_klikbca') {
    payWith = 'klik bca';
  } else if (param.payment_type == 'cimb_clicks') {
    payWith = 'cimb clicks';
  } else if (param.payment_type == 'danamon_online') {
    payWith = 'danamon online';
  } else if (param.payment_type == 'cstore') {
    if (param.store == 'indomaret') {
      payWith = 'indomaret';
    } else {
      payWith = 'alfamart';
    }
  } else if (param.payment_type == 'akulaku') {
    payWith = 'akulaku';
  } else if (param.payment_type == 'bri_epay') {
    payWith = 'brimo';
  } else if (param.bank) {
    payWith = `${param.card_type} - ${param.bank}`;
  } else if (param.permata_va_number) {
    payWith = 'permata va';
  } else if (param.va_numbers.length) {
    payWith = `${param.va_numbers[0].bank} va`;
  } else {
    payWith = '';
  }

  return payWith;
};

module.exports = paymentWith;
