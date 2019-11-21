const passport = require('passport');
const passportJwt = require('passport-jwt');
const { SECRET_KEY } = require('./constants');
const { User } = require('../models');

module.exports = function(app) {
  passport.use(
    'jwt',
    new passportJwt.Strategy(
      {
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: SECRET_KEY,
        session: false,
      },
      (payload, done) => done(null, payload)
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  app.use(passport.initialize());
};
