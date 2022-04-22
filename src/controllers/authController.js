const httpStatus = require('http-status');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const { tokenTypes } = require('../config/tokens');
const { googleAuth } = require('../utils/googleOauth');
const { roleId } = require('../config/roles');
const ApiError = require('../utils/ApiError');
const { sendMail } = require('../utils/mailer');
const config = require('../config/config');

const register = catchAsync(async (req, res) => {
  const userBody = req.body;
  const user = await userService.createUser(userBody);
  const { email, id } = user;
  const registeredUser = await userService.getUserById(id, { include: 'role' });
  const { access } = await tokenService.generateAuthTokens(registeredUser);
  const url = `${req.protocol}://${req.headers.host}/v1/auth/confirmation/${access.token}`;
  let textEmail = `Hello ${email}, <br>`;
  textEmail
    += 'Silahkan klik link dibawah ini untuk melakukan verifikasi pendaftaran akun:<br>';
  textEmail += `Link Validasi: <u><b>${url}</b></u>`;
  textEmail += '<br><br><br>';
  textEmail += 'Regards,<br>';
  textEmail += 'SebisLes Staff';

  sendMail(email, 'SEBIS Les - User Email', textEmail);

  const message = 'Registration is successful, please check your email to confirm';
  const result = {
    user,
    message,
  };
  res.sendWrapped(result, httpStatus.CREATED);
});

const registerByPhoneNumber = catchAsync(async (req, res) => {
  // belum otp
  const { body } = req;
  body.roleId = roleId.STUDENT;
  body.isVerified = true;
  const user = await userService.createUserByPhoneNumber(body);
  const token = await tokenService.generateAuthTokens(user);
  const login = {
    user,
    token,
  };
  res.sendWrapped(login, httpStatus.CREATED);
});
const resendEmailConfirmation = catchAsync(async (req, res) => {
  const { email } = req.query;
  const user = await userService.getUserByEmail(email, { include: 'role' });
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found, please input your registered email',
    );
  }
  const { access } = await tokenService.generateAuthTokens(user);
  const url = `${req.protocol}://${req.headers.host}/v1/auth/confirmation/${access.token}`;
  let textEmail = `Hello ${email}, <br>`;
  textEmail
    += 'Silahkan klik link dibawah ini untuk melakukan verifikasi pendaftaran akun:<br>';
  textEmail += `Link Validasi: <u><b>${url}</b></u>`;
  textEmail += '<br><br><br>';
  textEmail += 'Regards,<br>';
  textEmail += 'SebisLes Staff';

  sendMail(email, 'SEBIS Les - User Email', textEmail);
  res.sendWrapped(
    'Link confirmation already send to your email, please check your inbox',
    httpStatus.OK,
  );
});

const emailConfirmation = catchAsync(async (req, res) => {
  const { sub } = jwt.verify(req.params.token, config.jwt.secret);
  const body = {
    isVerified: true,
  };
  userService.updateUserById(sub, body);
  res.sendWrapped(
    'Your account successfully confirmed, now you can login using your email and password',
    httpStatus.OK,
  );
});

const loginByPhoneNumber = catchAsync(async (req, res) => {
  // belum otp
  const { phoneNumber } = req.body;
  const user = await userService.getUserByPhoneNumber(phoneNumber, {
    include: 'role',
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Phone not registered');
  }

  const token = await tokenService.generateAuthTokens(user);
  const login = {
    user,
    token,
  };

  res.sendWrapped(login, httpStatus.OK);
});

const loginByGoogleTeacher = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const role = roleId.TEACHER;
  const googleUser = await googleAuth(idToken, role);
  if (googleUser.roleId !== role) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Akun ini telah terdaftar sebagai murid',
    );
  }

  const { access, refresh } = await tokenService.generateAuthTokens(googleUser);

  const message = 'Login Sucessfully';
  const user = {
    message,
    googleUser,
    access,
    refresh,
  };

  res.sendWrapped(user, httpStatus.OK);
});

const loginByGoogleStudent = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const role = roleId.STUDENT;
  const user = await googleAuth(idToken, role);

  console.log('user: ', user.roleId);
  console.log('role: ', role);

  if (user.roleId !== role) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Akun ini telah terdaftar sebagai tutor',
    );
  }
  const { access, refresh } = await tokenService.generateAuthTokens(user);

  const message = 'Login Sucessfully';
  const login = {
    message,
    user,
    access,
    refresh,
  };

  res.sendWrapped(login, httpStatus.OK);
});

const login = catchAsync(async (req, res) => {
  const { identity, password } = req.body;
  const user = await authService.loginWithIdentityAndPassword(
    identity,
    password,
  );
  const token = await tokenService.generateAuthTokens(user);
  if (user.isVerified === false) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Account has not been confirmed, please confirm your email and re login',
    );
  }
  res.sendWrapped(token, httpStatus.OK);
});

const verifyPin = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { pin } = req.body;
  const user = await authService.pinVerify(userId, pin);
  res.sendWrapped('success', httpStatus.OK);
});

const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokenData = await authService.refreshAuth(refreshToken);
  const user = await userService.getUserById(tokenData.userId, {
    include: 'role',
  });
  const token = await tokenService.generateAuthTokens(user);
  res.sendWrapped(token, httpStatus.OK);
});

const logout = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const userToken = req.token;
  tokenService.revokeToken(userId, tokenTypes.ACCESS, userToken);
  tokenService.revokeUser(userId);
  res.sendWrapped('Logout success.', httpStatus.OK);
});

const testProtected = catchAsync(async (req, res) => {
  res.sendWrapped('Access granted.', httpStatus.OK);
});

const resetPassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;
  await authService.updatePassword(userId, password);
  res.sendWrapped('Password updated.', httpStatus.OK);
});

const resetPin = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { pin } = req.body;
  await authService.updatePin(userId, pin);
  res.sendWrapped('Pin updated.', httpStatus.OK);
});

const forgetPin = catchAsync(async (req, res) => {
  const { email, id } = req.user;

  const registeredUser = await userService.getUserByEmail(email, {
    include: 'role',
  });
  if (!registeredUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email not registered');
  }
  const pin = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });
  await authService.updatePin(id, pin);

  let textEmail = `Hello ${email}, <br>`;
  textEmail += `Pin kamu adalah <b>${pin}</b>, kamu dapat menggunakan atau mengganti pin tersebut. <br>`;
  textEmail += '<br><br><br>';
  textEmail += 'Regards,<br>';
  textEmail += 'SebisLes Staff';

  sendMail(email, 'SEBIS Les - User Email', textEmail);

  res.sendWrapped('Pin baru telah terkirim ke email kamu', httpStatus.CREATED);
});

const sendEmailResetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const registeredUser = await userService.getUserByEmail(email, {
    include: 'role',
  });
  if (!registeredUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found, please input your registered email',
    );
  }

  const token = await tokenService.generateResetPasswordToken(registeredUser);
  const url = `${req.protocol}://${req.headers.host}/v1/auth/reset-password/${registeredUser.id}/${token}`;
  let textEmail = `Hello ${email}, <br>`;
  textEmail
    += 'Silahkan klik link dibawah ini untuk mereset password kamu:<br>';
  textEmail += `Link reset password: <u><b>${url}</b></u>`;
  textEmail += '<br><br><br>';
  textEmail += 'Regards,<br>';
  textEmail += 'SebisLes Staff';

  sendMail(email, 'SEBIS Les - User Email', textEmail);

  res.sendWrapped(
    'Password reset link has been sent to your email',
    httpStatus.CREATED,
  );
});

const resetPasswordByEmail = catchAsync(async (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;
  try {
    const user = await userService.getUserById(userId, { include: 'role' });
    const secret = config.jwt.secret + user.password;
    const verify = await jwt.verify(token, secret);
    await authService.updatePassword(userId, password);
    res.sendWrapped('Password updated', httpStatus.OK);
  } catch (error) {
    console.log(error);
    res.sendWrapped(
      'The password reset link has expired, please request a password reset again',
      httpStatus.BAD_REQUEST,
    );
  }
});

module.exports = {
  login,
  refreshTokens,
  register,
  logout,
  testProtected,
  resetPassword,
  loginByGoogleTeacher,
  loginByGoogleStudent,
  loginByPhoneNumber,
  registerByPhoneNumber,
  emailConfirmation,
  resendEmailConfirmation,
  sendEmailResetPassword,
  resetPasswordByEmail,
  resetPin,
  verifyPin,
  forgetPin,
};
