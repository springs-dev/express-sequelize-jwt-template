import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { AUTH_SECRET_KEY } from '#src/configs/constants.js';
import User from '#src/models/user.js';

/**
 * Sets up the Passport authentication middleware with a JWT strategy.
 * This function configures Passport to authenticate users based on a JSON Web Token.
 * It extracts the JWT from the Authorization header and uses it to find the associated user.
 *
 * @param {import('express').Application} app - The Express application to which the middleware is added.
 */
export const passportMiddleware = (app) => {
  // Options for the JWT strategy.
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'), // Defines how the JWT is extracted from the request.
    secretOrKey: AUTH_SECRET_KEY, // The secret key to verify the JWT's signature.
    session: false, // Indicates that Passport should not use sessions.
  };

  // Use a JWT strategy for Passport.
  passport.use(
    'jwt',
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        // Attempt to find the user by the ID contained in the JWT payload.
        const user = await User.findByPk(payload.id);
        if (!user) {
          // If no user is found, pass false to indicate an authentication failure.
          return done(null, false, { message: 'User not found' });
        }
        // If the user is found, pass the user object to Passport.
        return done(null, user);
      } catch (error) {
        // In case of an error, pass the error object along with false to indicate an authentication failure.
        return done(error, false, { message: 'Internal server Error' });
      }
    }),
  );

  // Initialize Passport middleware.
  app.use(passport.initialize());
};

// This setup assumes that you have a User model with a findByPk method to search for user records by their primary key.
// The AUTH_SECRET_KEY should be a string that is kept secret and is used to sign and verify JWTs.
