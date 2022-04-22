const httpStatus = require('http-status');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const userService = require('./userService');
const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { TeachingExperience } = require('../models/TeachingExperience');
const { TeachingExperienceDetail } = require('../models/TeachingExperienceDetail');
const { EducationBackground } = require('../models/EducationBackground');
const { Bank } = require('../models/Bank');
const { Device } = require('../models/Device');
const { Subject } = require('../models/Subject');
const { Curriculum } = require('../models/Curriculum');
const { GradeGroup } = require('../models/GradeGroup');
const { Grade } = require('../models/Grade');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Price } = require('../models/Price');
const dataJson = require('../../public/files/userJson.json');
const teachingJson = require('../../public/Migration_Dec_16_21_15/teaching_exps.json');

const { convertDate } = require('../utils/convertUpnormalDate');
const { floater } = require('../utils/floating');
const { AvailabilityHours } = require('../models/AvailabilityHours');

const { generateRandomString } = require('../utils/random');

const listUser = async () => {
  const user = await axios.get('http://localhost:3000/migrate/user');

  const userMaping = await Promise.all(user.data.data.map(async (o) => {
    let userType;
    let gender;
    let province;
    let teacherStatus;
    let images;
    let teachExp;
    let eduBackground;

    if (o.userIdentity && o.userIdentity.userType == 'admin') {
      userType = 'd33f5a01-7128-4fe0-9af5-af2359a204a2';
    }
    if (o.userIdentity && o.userIdentity.userType == 'administrator') {
      userType = '07487e28-d781-42e7-9e50-a990565e2560';
    }
    if (o.userIdentity && o.userIdentity.userType == 'pteacher') {
      userType = '584c4a79-9dc5-4fae-9aa0-f49dc6b790f5';
      teacherStatus = 'pending';
    }
    if (o.userIdentity && o.userIdentity.userType == 'teacher') {
      userType = '437e0221-eb3d-477f-a3b3-799256fbcab6';
      teacherStatus = 'accepted';
    }
    if (o.userIdentity && o.userIdentity.userType == 'rteacher') {
      userType = 'd39b1062-dcf0-4cb1-b8df-2790af008c46';
      teacherStatus = 'rejected';
    }
    if (o.userIdentity && o.userIdentity.userType == 'student') {
      userType = 'a0a76676-e446-49d2-ab7a-ae622783d7b8';
    }
    if (o.userIdentity && o.userIdentity.userType == 'verifikator') {
      userType = '07348839-b192-450c-b9a2-8416389eacaa';
    }
    if (o.userIdentity && o.userIdentity.userType == 'finance') {
      userType = 'c5168f64-b5fa-4ebb-94b5-337d7540fedc';
    }
    if (o.userIdentity && o.userIdentity.userType == 'public') {
      userType = '1034f7bb-5ec6-447a-80b5-44a0bad040a1';
    }

    if (o.userDetail && o.userDetail.gender) {
      gender = o.userDetail.gender;
    }

    if (o.userDetail && o.userDetail.province) {
      province = o.userDetail.province;
    }

    if (o.userImages && o.userImages.length > 0) {
      images = o.userImages.map((img) => {
        const dataImages = {
          temporaryImageId: (img && img._id) ? img._id : null,
          temporaryIdentityId: (img && img.identitiesId) ? img.identitiesId : null,
          userId: 'User id',
          fileName: (img && img.image) ? img.image : null,
          fileType: (img && img.type) ? img.type : null,
        };

        return dataImages;
      });
    }

    if (o.userTeachingExperiences && o.userTeachingExperiences.length > 0) {
      teachExp = o.userTeachingExperiences.map((teach) => {
        const dataTeachingExperienceDetail = {
          temporaryTeachingExperienceId: (teach && teach._id) ? teach._id : null,
          gradeCode: (teach && teach.grade) ? teach.grade : null,
          subject: (teach && teach.course) ? teach.course : null,
        };

        const dataTeachingExperience = {
          temporaryTeachingExperienceId: (teach && teach._id) ? teach._id : null,
          temporaryIdentityId: (teach && teach.identitiesId) ? teach.identitiesId : null,
          teacherId: (teach && teach.identitiesId) ? teach.identitiesId : null,
          universityName: (teach && teach.school) ? teach.school : null,
          univeristyCity: (teach && teach.city) ? teach.city : null,
          teachingStatus: (teach && teach.status) ? teach.status : null,
          teachingFrom: (teach && teach.fromDate) ? teach.fromDate : null,
          teachingTo: (teach && teach.toDate) ? teach.toDate : null,
          teachingExperienceDetails: dataTeachingExperienceDetail,
        };

        return dataTeachingExperience;
      });
    }

    if (o.userEducationBackgrounds && o.userEducationBackgrounds.length > 0) {
      eduBackground = o.userEducationBackgrounds.map((edu) => {
        const dataEducationBackground = {
          temporaryEducationBackground: (edu && edu._id) ? edu._id : null,
          temporaryIdentityId: (edu && edu.identitiesId) ? edu.identitiesId : null,
          educationMajor: (edu && edu.major) ? edu.major : null,
          faculty: '',
          city: '',
          educationLevel: (edu && edu.strata) ? edu.strata : null,
          universityName: (edu && edu.institution) ? edu.institution : null,
          thesisTitle: (edu && edu.thesis) ? edu.thesis : null,
          educationGpa: (edu && edu.score) ? edu.score : null,
          educationFrom: (edu && edu.fromDate) ? edu.fromDate : null,
          educationTo: (edu && edu.toDate) ? edu.toDate : null,
          educationCertificate: '',
          educationTranscript: '',
        };

        return dataEducationBackground;
      });
    }

    const dataUser = {
      temporaryPeopleId: (o.user && o.user._id) ? o.user._id : null,
      temporaryIdentityId: (o.userIdentity && o.userIdentity._id) ? o.userIdentity._id : null,
      email: (o.user && o.user.email) ? o.user.email : null,
      firstName: (o.user && o.user.name && o.user.name.split(' ').length > 1) ? o.user.name.split(' ')[0] : o.user.name,
      lastName: (o.user && o.user.name && o.user.name.split(' ').length > 1) ? o.user.name.split(' ').shift() : '',
      phoneNumber: (o.user && o.user.phone) ? o.user.phone : null,
      password: (o.user && o.user.password) ? o.user.password : null,
      gender: gender ? gender : 'male',
      roleId: userType ? userType : '1034f7bb-5ec6-447a-80b5-44a0bad040a1',
    };

    const dataUserDetail = {
      userId: 'data user id',
      temporaryPeopleId: (o.user && o.user._id) ? o.user._id : null,
      temporaryIdentityId: (o.userIdentity && o.userIdentity._id) ? o.userIdentity._id : null,
      birthPlace: (o.userDetail && o.userDetail.birthPlace) ? o.userDetail.birthPlace : null,
      birthDate: (o.userDetail && o.userDetail.birthDate) ? moment(o.userDetail.birthDate).format('YYYY-MM-DD') : null,
      religion: (o.userDetail && o.userDetail.religion) ? o.userDetail.religion : null,
      idCardType: (o.userDetail && o.userDetail.cardType) ? o.userDetail.cardType : null,
      idCardNumber: (o.userDetail && o.userDetail.cardId) ? o.userDetail.cardId : null,
      mailingAddress: (o.userDetail && o.userDetail.address) ? o.userDetail.address : null,
      city: (o.userDetail && o.userDetail.city) ? o.userDetail.city : null,
      region: province ? province : null,
      postalCode: (o.userDetail && o.userDetail.postalcode) ? parseInt(o.userDetail.postalcode) : null,
      aboutMe: (o.user && o.user.nameEng) ? o.user.nameEng : null,
      priceId: 'Harga',
      teacherStatus: teacherStatus ? teacherStatus : null,
    };

    const dataUserSchool = {
      temporaryPeopleId: (o.user && o.user._id) ? o.user._id : null,
      temporaryIdentityId: (o.userIdentity && o.userIdentity._id) ? o.userIdentity._id : null,
      schoolName: (o.userSchool && o.userSchool.name) ? o.userSchool.name : null,
      schoolAddress: (o.userSchool && o.userSchool.grade) ? o.userSchool.grade : null,
    };

    const dataResponse = {
      user: dataUser ? dataUser : null,
      userDetail: dataUserDetail ? dataUserDetail : null,
      userSchool: dataUserSchool ? dataUserSchool : null,
      userImages: images ? images : null,
      userTeachingExperiences: teachExp ? teachExp : null,
      userEducationBackground: eduBackground ? eduBackground : null,
    };

    return dataResponse;
  }));
    // const data = fs.readFileSync('./public/files/userJson.json', 'utf-8');
    // const convertJson = JSON.parse(data);
    // const maping = convertJson.map(o => o);
    // const mapingUser = maping.map(o => o.user);
    // const mapingUserDetail = maping.map(o => o.userDetail);

  // const insertUser = await User.bulkCreate(mapingUser, {validate: false, ignoreDuplicates: true});
  // const insertUserDetail = await UserDetail.bulkCreate()
  // return {
  //     mapingUser,
  //     mapingUserDetail
  // };
  // return insertUser;
};

const addUser = async () => {
  const data = fs.readFileSync('./public/files/userJson.json', 'utf-8');
  const convertJson = JSON.parse(data);
  let arrayResults = [];
  const maping = convertJson.map((o) => o);

  for (const loop of maping) {
    const dataLoop = {
      ...loop,
      referralCode: generateRandomString(),
    };
    const insertUser = await User.create(dataLoop);
    arrayResults.push(insertUser);
  }

  return arrayResults;
};

const addUserDetail = async () => {
  const user = await User.findAll();
  const data = fs.readFileSync('./public/files/userJson.json', 'utf-8');
  const convertJson = JSON.parse(data);
  const maping = convertJson.map((o) => o.userDetail);

  // set new map
  const map = new Map();
  // IDK
  user.forEach((item) => map.set(item.temporaryIdentityId, item));
  maping.forEach((item) => map.set(item.temporaryIdentityId, { ...map.get(item.temporaryIdentityId), ...item }));
  // IDK
  const merging = Array.from(map.values());

  let arrayResults = [];
  let postalCode = '';

  for (const loop of merging) {
    let birthDate = '01-01-1999';

    if (loop.birthDate) {
      birthDate = moment(loop.birthDate).isValid() === true ? moment(loop.birthDate).format('YYYY-MM-DD') : moment('1999-01-01').format('YYYY-MM-DD');
    }

    if (loop.postalCode && loop.postalCode.length > 11) {
      postalCode = loop.postalCode.slice(0, 10);
    } else {
      postalCode = '111111';
    }

    const dataUserDetail = {
      userId: loop.dataValues.id,
      temporaryPeopleId: loop.dataValues.temporaryPeopleId,
      temporaryIdentityId: loop.dataValues.temporaryIdentityId,
      birthPlace: loop.birthPlace,
      birthDate,
      religion: loop.religion,
      idCardType: loop.idCardType,
      idCardNumber: loop.idCardNumber,
      mailingAddress: loop.mailingAddress,
      city: loop.city,
      region: loop.region,
      postalCode,
      // aboutMe: loop.aboutMe,
      priceId: loop.priceId,
      teacherStatus: loop.teacherStatus,
    };

    const insertUserDetail = await UserDetail.create(dataUserDetail);
    arrayResults.push(insertUserDetail);
  }

  return arrayResults;
};

const addTeachingExperience = async () => {
  const user = await User.findAll();
  const data = fs.readFileSync('./public/Migration_Dec_16_21_15/teaching_exps.json', 'utf-8');
  const convertJson = JSON.parse(data);
  const maping = convertJson.map((o) => o);

  const userMap = user.map((o) => o.temporaryIdentityId);
  // console.log(userMap)
  const filteringTeaching = maping.filter((o) => userMap.includes(o.identitiesId));
  const mapTemporaryIdentityId = filteringTeaching.map((o) => o.identitiesId);
  const filteringUser = user.filter((o) => mapTemporaryIdentityId.includes(o.temporaryIdentityId));

  const map = new Map();
  filteringUser.forEach((item) => map.set(item.temporaryIdentityId, item));
  filteringTeaching.forEach((item) => map.set(item.identitiesId, { ...map.get(item.identitiesId), ...item }));

  const merging = Array.from(map.values());

  const arrayTeachingExperience = [];
  const arrayTeachingExperienceDetail = [];

  for (const loopTeaching of merging) {
    // convert valid date (month/year)
    const converterFromDate = await convertDate(loopTeaching.fromDate);
    const converterToDate = await convertDate(loopTeaching.toDate);

    const dataTeachingExperience = {
      temporaryTeachingExperienceId: (loopTeaching && loopTeaching._id.$oid) ? loopTeaching._id.$oid : null,
      temporaryIdentityId: (loopTeaching && loopTeaching.identitiesId) ? loopTeaching.identitiesId : null,
      teacherId: (loopTeaching && loopTeaching.dataValues.id) ? loopTeaching.dataValues.id : null,
      universityName: (loopTeaching && loopTeaching.school) ? loopTeaching.school : null,
      univeristyCity: (loopTeaching && loopTeaching.city) ? loopTeaching.city : null,
      teachingStatus: (loopTeaching && loopTeaching.status) ? loopTeaching.status : null,
      teachingFrom: converterFromDate,
      teachingTo: converterToDate,
    };

    const dataTeachingExperienceDetail = {
      temporaryTeachingExperienceId: (loopTeaching && loopTeaching._id.$oid) ? loopTeaching._id.$oid : null,
      gradeCode: (loopTeaching && loopTeaching.grade) ? loopTeaching.grade : null,
      subject: (loopTeaching && loopTeaching.course) ? loopTeaching.course : null,
    };

    const insertTeachingExperience = await TeachingExperience.create(dataTeachingExperience);

    arrayTeachingExperience.push(insertTeachingExperience);
    arrayTeachingExperienceDetail.push(dataTeachingExperienceDetail);
  }

  const resultMap = new Map();

  arrayTeachingExperience.forEach((item) => resultMap.set(item.temporaryTeachingExperienceId, item));
  arrayTeachingExperienceDetail.forEach((item) => resultMap.set(item.temporaryTeachingExperienceId, { ...resultMap.get(item.temporaryTeachingExperienceId), ...item }));

  const mergingResults = Array.from(resultMap.values());

  let arrayTeachingExperienceDetailResults = [];

  for (const loopTeachingDetail of mergingResults) {
    const dataTeachingExperienceDetailResult = {
      teachingExperienceId: loopTeachingDetail.dataValues.id,
      temporaryTeachingExperienceId: loopTeachingDetail.temporaryTeachingExperienceId,
      gradeCode: loopTeachingDetail.gradeCode,
      subject: loopTeachingDetail.subject,
    };

    const insertTeachingExperienceDetail = await TeachingExperienceDetail.create(dataTeachingExperienceDetailResult);

    arrayTeachingExperienceDetailResults.push(insertTeachingExperienceDetail);
  }
  return { arrayTeachingExperience, arrayTeachingExperienceDetailResults };
};

const addEducationBackground = async () => {
  const user = await User.findAll();
  const fileEduBackground = fs.readFileSync('./public/Migration_Dec_16_21_15/edu_backgrounds.json', 'utf-8');
  const dataEduBackground = JSON.parse(fileEduBackground);
  const mapEducationBackground = dataEduBackground.map((o) => o);

  const mapTemporaryIdentitiesId = user.map((o) => o.temporaryIdentityId);

  const filteringEducationBackground = mapEducationBackground.filter((o) => mapTemporaryIdentitiesId.includes(o.identitiesId));
  const mapIdentitiesId = filteringEducationBackground.map((o) => o.identitiesId);
  const filteringUser = user.filter((o) => mapIdentitiesId.includes(o.temporaryIdentityId));

  const map = new Map();

  filteringUser.forEach((item) => map.set(item.temporaryIdentityId, item));
  filteringEducationBackground.forEach((item) => map.set(item.identitiesId, { ...map.get(item.identitiesId), ...item }));

  const merging = Array.from(map.values());

  const arrayEducationBackground = [];
  for (const loopEdu of merging) {
    const converterFromDate = await convertDate(loopEdu.fromDate);
    const converterToDate = await convertDate(loopEdu.toDate);
    const floatingScore = await floater(loopEdu.score ? loopEdu.score : 0);

    const dataEdu = {
      temporaryIdentityId: (loopEdu && loopEdu.identitiesId) ? loopEdu.identitiesId : null,
      teacherId: (loopEdu && loopEdu.dataValues.id) ? loopEdu.dataValues.id : null,
      educationMajor: (loopEdu && loopEdu.major) ? loopEdu.major : null,
      faculty: (loopEdu && loopEdu.faculty) ? loopEdu.faculty : null,
      city: (loopEdu && loopEdu.city) ? loopEdu.city : null,
      educationLevel: (loopEdu && loopEdu.strata) ? loopEdu.strata : null,
      universityName: (loopEdu && loopEdu.institution) ? loopEdu.institution : null,
      thesisTitle: (loopEdu && loopEdu.title) ? loopEdu.title : '-',
      educationGpa: floatingScore ? parseFloat(floatingScore) : 0,
      educationFrom: loopEdu.fromDate ? converterFromDate : moment('01-01-2000', 'DD-MM-YYYY').format('DD-MM-YYYY'),
      educationTo: loopEdu.toDate ? converterToDate : moment('01-01-2000', 'DD-MM-YYYY').format('DD-MM-YYYY'),
      educationCertificate: null,
      educationTranscript: null,
    };

    const insertEducationBackground = await EducationBackground.create(dataEdu);
    arrayEducationBackground.push(insertEducationBackground);
  }

  return arrayEducationBackground;
};

const addBank = async () => {
  const user = await User.findAll();
  const fileBank = fs.readFileSync('./public/Migration_Dec_16_21_15/bank_accounts.json', 'utf-8');
  const dataBank = JSON.parse(fileBank);
  const mapBank = dataBank.map((o) => o);

  const mapTemporaryIdentityId = user.map((o) => o.temporaryIdentityId);

  const filteringBank = mapBank.filter((o) => mapTemporaryIdentityId.includes(o.identitiesId));
  const mapingIdentitiesId = filteringBank.map((o) => o.identitiesId);
  const filteringUser = user.filter((o) => mapingIdentitiesId.includes(o.temporaryIdentityId));

  const map = new Map();

  filteringUser.forEach((item) => map.set(item.temporaryIdentityId, item));
  filteringBank.forEach((item) => map.set(item.identitiesId, { ...map.get(item.identitiesId), ...item }));

  const merging = Array.from(map.values());

  const arrayBank = [];

  for (const loopBank of merging) {
    const data = {
      userId: (loopBank && loopBank.dataValues.id) ? loopBank.dataValues.id : null,
      bankName: (loopBank && loopBank.bankName) ? loopBank.bankName : null,
      bankNumber: (loopBank && loopBank.bankNumber) ? loopBank.bankNumber : null,
      bankOwnerName: (loopBank && loopBank.bankOwnerName) ? loopBank.bankOwnerName : null,
      temporaryIdentityId: (loopBank && loopBank.identitiesId) ? loopBank.identitiesId : null,
    };

    const insertBankAccount = await Bank.create(data);
    arrayBank.push(insertBankAccount);
  }

  return arrayBank;
};

const addDevice = async () => {
  const user = await User.findAll();
  const fileDevice = fs.readFileSync('./public/Migration_Dec_16_21_15/devices.json', 'utf-8');
  const dataDevice = JSON.parse(fileDevice);
  const mapDevice = dataDevice.map((o) => o);

  const mapTemporaryIdentityId = user.map((o) => o.temporaryIdentityId);

  const filteringDevice = mapDevice.filter((o) => mapTemporaryIdentityId.includes(o.identitiesId));
  const mapingIdentitiesId = filteringDevice.map((o) => o.identitiesId);
  const filteringUser = user.filter((o) => mapingIdentitiesId.includes(o.temporaryIdentityId));

  const map = new Map();

  filteringUser.forEach((item) => map.set(item.temporaryIdentityId, item));
  filteringDevice.forEach((item) => map.set(item.identitiesId, { ...map.get(item.identitiesId), ...item }));

  const merging = Array.from(map.values());

  const arrayDevice = [];

  for (const loopDevice of merging) {
    const data = {
      userId: (loopDevice && loopDevice.dataValues.id) ? loopDevice.dataValues.id : null,
      registeredToken: (loopDevice && loopDevice.registerdToken) ? loopDevice.registerdToken : null,
    };

    const insertDevice = await Device.create(data);
    arrayDevice.push(insertDevice);
  }

  return arrayDevice;
};

const addSubject = async () => {
  const fileSubject = fs.readFileSync('./public/Migration_Dec_16_21_15/mapels.json', 'utf-8');
  const dataSubject = JSON.parse(fileSubject);
  const mapSubject = dataSubject.map((o) => o);

  const distinctSubject = [
    ...new Set(
      mapSubject.map((item) => item.name),
    ),
  ];

  const arraySubject = [];

  for (const loopSubject of distinctSubject) {
    const data = {
      subjectCode: loopSubject.toLowerCase(),
      subjectName: loopSubject.toUpperCase(),
    };

    const insertSubject = await Subject.create(data);
    arraySubject.push(insertSubject);
  }

  // const insertSubject = await Subject.bulkCreate(distinctSubject);

  return arraySubject;
};

const addGradeGroup = async () => {
  const fileGrade = fs.readFileSync('./public/Migration_Dec_16_21_15/kelas.json', 'utf-8');
  const dataGrade = JSON.parse(fileGrade);
  const mapGrade = dataGrade.map((o) => o);

  const distinctGrade = [
    ...new Map(
      mapGrade.map((item) => [
        item.name, item,
      ]),
    ).values(),
  ];

  const arrayGradeGroup = [];

  for (const loopGradeGroup of distinctGrade) {
    const curriculum = await Curriculum.findOne(
      {
        where: {
          curriculumCode: loopGradeGroup.curriculum,
        },
      },
    );

    const data = {
      temporaryGradeId: (loopGradeGroup && loopGradeGroup._id.$oid) ? loopGradeGroup._id.$oid : null,
      curriculumId: (curriculum && curriculum.id) ? curriculum.id : null,
      gradeGroupCode: (loopGradeGroup && loopGradeGroup.name) ? loopGradeGroup.name.toLowerCase() : null,
      gradeGroupName: (loopGradeGroup && loopGradeGroup.name) ? loopGradeGroup.name.toUpperCase() : null,
    };

    const insertGradeGroup = await GradeGroup.create(data);

    arrayGradeGroup.push(insertGradeGroup);
  }

  // "60d2a8fd166e761664fa5040"
  // "60d2d8f49350dc2948d5f8bf"

  let arrayGrade = [];

  for (const loopGrade of arrayGradeGroup) {
    if (loopGrade.gradeGroupCode == 'sd') {
      for (let x = 1; x <= 6; x++) {
        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: x,
          gradeName: `${x} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'smp') {
      for (let x = 0; x <= 2; x++) {
        const gradeManipulation = 7 + x;

        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: gradeManipulation,
          gradeName: `${gradeManipulation} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'sma (ipa)') {
      for (let x = 0; x <= 2; x++) {
        const gradeManipulation = 10 + x;

        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: gradeManipulation,
          gradeName: `${gradeManipulation} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'sma (ips)') {
      for (let x = 0; x <= 2; x++) {
        const gradeManipulation = 10 + x;

        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: gradeManipulation,
          gradeName: `${gradeManipulation} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'primary') {
      for (let x = 1; x <= 6; x++) {
        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: x,
          gradeName: `${x} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'low secondary') {
      for (let x = 0; x <= 1; x++) {
        const gradeManipulation = 7 + x;

        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: gradeManipulation,
          gradeName: `${gradeManipulation} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'up secondary') {
      for (let x = 0; x <= 1; x++) {
        const gradeManipulation = 9 + x;

        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: gradeManipulation,
          gradeName: `${gradeManipulation} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'advanced') {
      for (let x = 0; x <= 1; x++) {
        const gradeManipulation = 11 + x;

        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: gradeManipulation,
          gradeName: `${gradeManipulation} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'primary year') {
      for (let x = 1; x <= 6; x++) {
        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: x,
          gradeName: `${x} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'middle year') {
      for (let x = 0; x <= 3; x++) {
        const gradeManipulation = 7 + x;

        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: gradeManipulation,
          gradeName: `${gradeManipulation} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'diploma') {
      for (let x = 0; x <= 1; x++) {
        const gradeManipulation = 11 + x;

        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: gradeManipulation,
          gradeName: `${gradeManipulation} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'pemula') {
      for (let x = 1; x <= 12; x++) {
        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: x,
          gradeName: `${x} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'menengah') {
      for (let x = 1; x <= 12; x++) {
        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: x,
          gradeName: `${x} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }

    if (loopGrade.gradeGroupCode == 'lanjut') {
      for (let x = 1; x <= 12; x++) {
        const data = {
          gradeGroupId: loopGrade.id,
          gradeCode: x,
          gradeName: `${x} - ${loopGrade.gradeGroupName}`,
        };

        arrayGrade.push(data);
      }
    }
  }

  const insertGrade = await Grade.bulkCreate(arrayGrade);

  // get temporaryGradeId
  // kemudian map untuk memasukkan kelasnya berdasarkan tingkatan grade dan to grade
  // kemudian ambil curriculumnya

  return { arrayGradeGroup, arrayGrade };
};

const addAvailabilityHours = async () => {
  const user = await User.findAll();
  const fileAvailabilityHours = fs.readFileSync('./public/Migration_Dec_16_21_15/jadwals.json', 'utf-8');
  const dataAvailabilityHours = JSON.parse(fileAvailabilityHours);
  const mapAvailabilityHours = dataAvailabilityHours.map((o) => o);

  const mapTemporaryIdentityId = user.map((o) => o.temporaryIdentityId);

  const filteringAvailabilityHours = mapAvailabilityHours.filter((o) => mapTemporaryIdentityId.includes(o.identitiesId));
  const mapingIdentitiesId = filteringAvailabilityHours.map((o) => o.identitiesId);
  const filteringUser = user.filter((o) => mapingIdentitiesId.includes(o.temporaryIdentityId));

  const arrayAvailabilityHours = [];

  for (const loopAvailabilityHours of filteringAvailabilityHours) {
    const checkUser = await User.findOne(
      {
        where: {
          temporaryIdentityId: loopAvailabilityHours.identitiesId,
        },
      },
    );

    const data = {
      teacherId: checkUser.id,
      dayCode: parseInt(loopAvailabilityHours.day),
      timeStart: loopAvailabilityHours.dateStart.split(' ')[1],
      timeEnd: loopAvailabilityHours.dateEnd.split(' ')[1],
    };

    arrayAvailabilityHours.push(data);
  }

  const insertAvailabilityHours = await AvailabilityHours.bulkCreate(arrayAvailabilityHours, { ignoreDuplicates: true });

  return insertAvailabilityHours;
};

const addTeacherSubjects = async () => {
  const user = await User.findAll();

  const fileGrade = fs.readFileSync('./public/Migration_Dec_16_21_15/kelas.json', 'utf-8');
  const fileMapel = fs.readFileSync('./public/Migration_Dec_16_21_15/mapels.json', 'utf-8');
  const fileStudy = fs.readFileSync('./public/Migration_Dec_16_21_15/studies.json', 'utf-8');

  const dataGrade = JSON.parse(fileGrade);
  const dataMapel = JSON.parse(fileMapel);
  const dataStudy = JSON.parse(fileStudy);

  const mapTemporaryIdentityId = user.map((o) => o.temporaryIdentityId);

  const filteringStudy = dataStudy.filter((o) => mapTemporaryIdentityId.includes(o.identitiesId));

  const array = [];

  for (const loopStudy of filteringStudy) {
    const findMapel = dataMapel.find((element) => element._id.$oid == loopStudy.typeId);
    const findGrade = dataGrade.find((element) => element._id.$oid == loopStudy.gradeId);
    const findUser = user.find((element) => element.temporaryIdentityId == loopStudy.identitiesId);

    const subjectes = await Subject.findOne(
      {
        where: {
          subjectName: findMapel.name,
        },
      },
    );
    const arrayGrade = [];
    for (let i = parseInt(findGrade.grade); i <= parseInt(findGrade.tograde); i++) {
      const numbering = 0;
      let type = '';
      let status = false;

      if (loopStudy.status == '0') {
        type = 'private';
      } else {
        type = 'group';
      }

      if (loopStudy.disable == 'enable') {
        status = true;
      } else {
        status = false;
      }

      const grade = await Grade.findOne(
        {
          where: {
            gradeName: `${numbering + i} - ${findGrade.name}`,
          },
        },
      );

      const data = {
        gradeId: grade.id,
        subjectId: subjectes.id,
        teacherId: findUser.id,
        type,
        status,
      };

      arrayGrade.push(data);
    }

    array.push(...arrayGrade);
  }

  const insertTeacherSubject = await TeacherSubject.bulkCreate(array, { ignoreDuplicates: true });

  return insertTeacherSubject;
};

const addPrice = async (body) => Price.create(body);

module.exports = {
  listUser,
  addUser,
  addUserDetail,
  addTeachingExperience,
  addEducationBackground,
  addBank,
  addDevice,
  addSubject,
  addGradeGroup,
  addAvailabilityHours,
  addTeacherSubjects,
  addPrice,
};
