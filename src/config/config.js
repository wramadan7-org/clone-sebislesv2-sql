const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
// const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

// load database configuration from config.json instead of .env file
// const { NODE_ENV } = process.env;
// const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
// Object.assign(process.env, {
//   DB_DIALECT: dbConfig[NODE_ENV].dialect,
//   DB_HOST: dbConfig[NODE_ENV].host,
//   DB_PORT: dbConfig[NODE_ENV].port,
//   DB_NAME: dbConfig[NODE_ENV].database,
//   DB_USER: dbConfig[NODE_ENV].username,
//   DB_PASSWORD: dbConfig[NODE_ENV].password,
// });

// validate configuration
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required()
      .description('Node app environment'),
    PORT: Joi.number().default(3000).description('Node app listen port'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    DB_DIALECT: Joi.string().default('mysql').description('Database dialect'),
    DB_HOST: Joi.string().default('localhost').description('Database host'),
    DB_PORT: Joi.number().default(3306).description('Database port'),
    DB_NAME: Joi.string().required().description('Database name'),
    DB_USER: Joi.string()
      .default('root')
      .required()
      .description('Database user'),
    DB_PASSWORD: Joi.string().required().description('Database password'),
    REDIS_PROTOCOL: Joi.string()
      .default('redis')
      .valid('redis', 'rediss')
      .description('Redis protocol'),
    REDIS_HOST: Joi.string().default('localhost').description('Redis host'),
    REDIS_PORT: Joi.number().default(6379).description('Redis listen port'),
    REDIS_USER: Joi.string().default('').description('Redis user'),
    REDIS_PASSWORD: Joi.string().default('').description('Redis password'),
    FCM_TEACHER_KEY: Joi.string()
      .required()
      .description('FCM teacher server key'),
    FCM_STUDENT_KEY: Joi.string()
      .required()
      .description('FCM student server key'),
    ENABLE_CLUSTER: Joi.boolean().default(true),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const defaultDbConfiguration = {
  username: envVars.DB_USER,
  password: envVars.DB_PASSWORD,
  database: envVars.DB_NAME,
  host: envVars.DB_HOST,
  port: envVars.DB_PORT,
  dialect: envVars.DB_DIALECT,
};

// change default database configuration depend on node environment
if (envVars.NODE_ENV !== 'production') {
  Object.assign(defaultDbConfiguration, {
    database: `${envVars.DB_NAME}-${envVars.NODE_ENV}`,
  });
}

const tmpDbConfiguration = { ...defaultDbConfiguration };

const developmentDbConfiguration = {
  ...Object.assign(tmpDbConfiguration, {
    database: `${envVars.DB_NAME}-development`,
  }),
};

const testDbConfiguration = {
  ...Object.assign(tmpDbConfiguration, { database: `${envVars.DB_NAME}-test` }),
};

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  database: {
    ...defaultDbConfiguration, // from sequelize production database configuration
  },
  production: defaultDbConfiguration, // default sequelize database configuration
  development: developmentDbConfiguration, // sequelize development database configuration
  test: testDbConfiguration, // sequelize test database configuration
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  redis: {
    protocol: envVars.REDIS_PROTOCOL,
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    user: envVars.REDIS_USER,
    password: envVars.REDIS_PASSWORD,
  },
  fcm: {
    teacherKey: envVars.FCM_TEACHER_KEY,
    studentKey: envVars.FCM_STUDENT_KEY,
  },
  enableCluster: envVars.ENABLE_CLUSTER,
};
