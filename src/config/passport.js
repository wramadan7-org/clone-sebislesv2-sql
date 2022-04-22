const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models/User');
const { redisUserLoginKey } = require('./redis');
const redis = require('../utils/redis');
const { signUser } = require('../services/tokenService');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    // Get user detail from redis
    let user = await redis.getObject(`${redisUserLoginKey}:${payload.sub}`);

    // Get user from database if data not exist in redis
    if (!user) {
      user = await User.findOne({
        where: {
          id: payload.sub,
        },
        include: 'role',
      });
      if (user) await signUser(user);
    }

    // verify jwt failed
    if (!user) return done(null, false);

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
