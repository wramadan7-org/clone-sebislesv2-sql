const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const session = require('express-session');
const path = require('path');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routesV1 = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set response wrapper
app.response.sendWrapped = function (data, statusCode = httpStatus.OK, paginator) {
  if (data && data !== '') {
    return this.status(statusCode).send({
      status: statusCode,
      dataLength: data.length,
      data,
    });
  }
  return this.status(statusCode).send({
    status: statusCode,
    ...paginator,
  });
};

// testing to socket io
app.get('/home', (req, res) => {
  // res.render('home');
  res.sendFile(path.join(`${__dirname}/home.html`));
});

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// google oauth passport and session
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.session());

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routesV1);

// serve static files
app.use('/static', express.static('./public'));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
