const mailer = require('nodemailer');

/**
 * Mail transporter instance
 */
const mailTransporter = mailer.createTransport({
  host: 'c002.dapurhosting.com',
  port: 465,
  secure: true,
  auth: {
    user: 'no-reply@sebisedu.co.id',
    pass: 'sebisnoreply123',
  },
});

/**
 * Send email
 * @param {string} emailAddress
 * @param {string} emailSubject
 * @param {string} emailContent
 * @param {Object<{html: boolean}>} opts
 * @return {Promise<*>}
 */
const sendMail = async (
  emailAddress,
  emailSubject,
  emailContent,
  opts = { html: true },
) => {
  const emailData = {
    from: '"No-Reply SEBIS Les" <no-reply@sebisedu.co.id>',
    to: emailAddress,
    subject: emailSubject,
    ...(opts.html ? { html: emailContent } : { text: emailContent }),
  };
  return mailTransporter.sendMail(emailData);
};

module.exports = {
  sendMail,
};
