const Joi = require('joi');

const basicInfo = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    gender: Joi.equal('male', 'female'),
    phoneNumber: Joi.string().max(14),
    religion: Joi.string().lowercase(),
    birthPlace: Joi.string().lowercase().max(32),
    birthDate: Joi.date(),
  }),
};

const personalData = {
  body: Joi.object().keys({
    idCardType: Joi.string().lowercase().max(12),
    idCardNumber: Joi.string().max(32),
    mailingAddress: Joi.string().max(32), // alamat domisili
    city: Joi.string().lowercase().max(32),
    region: Joi.string().lowercase().max(32), // provinsi
    postalCode: Joi.string().max(8),
    country: Joi.string().lowercase().max(32), // kota
    aboutMe: Joi.string().max(32),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().max(15).min(11).pattern(/^[0-9+]+$/),
    firstName: Joi.string().max(15).min(3),
    lastName: Joi.string().max(15).allow(''),
    profile: Joi.string().max(50),
    schoolId: Joi.string().max(50),
    city: Joi.string().max(50).allow(''),
    grade: Joi.number().allow(''),
    email: Joi.string().email(),
  }),
};

const teacherById = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  basicInfo,
  personalData,
  updateProfile,
  teacherById,
};
