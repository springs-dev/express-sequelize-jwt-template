import express from 'express';
import CreateError from 'http-errors';
import passport from 'passport';

import { FRONTEND_BASE_URL, STATUS_SUCCESS } from '#src/configs/constants.js';
import { DEFAULT_SENDER_EMAIL } from '#src/configs/mailgun.js';
import Token from '#src/models/token.js';
import User from '#src/models/user.js';
import * as authService from '#src/services/auth.js';
import * as mailer from '#src/services/mailer.js';

const router = express.Router();

/**
 * @typedef {object} AuthData
 * @property {string} email - json: {"format": "email"}
 * @property {string} password - json: {"minLength": 8 }
 */

/**
 * POST /api/auth/sign-in
 * @summary Login user
 * @tags Auth
 * @param {AuthData} request.body.required - User login data
 * @return {AuthTokensData} 200 - User Tokens
 */
router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLocaleString(),
    },
  });

  if (!user || !user.isEqualPassword(password)) {
    throw new CreateError(401, 'Email invalid', {
      key: 'error.email-or-password-invalid',
    });
  }

  const tokenData = await authService.createAndSaveAuthTokens(user);

  res.json(tokenData);
});

/**
 * @typedef {object} UserCreationData
 * @property {string} email - json:{ "format": "email" }
 * @property {string} password - json: { "minLength": 8 }
 */

/**
 * POST /api/auth/sign-out
 * @security JWT
 * @summary User can delete his session
 * @tags Auth
 * @param {AuthTokenRefreshData} request.body.required
 * @return {ResponseStatus} 200
 */
router.delete(
  '/sign-out',
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    const { id } = req.user;
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new CreateError.BadRequest('Refresh token is required');
    }

    const token = await Token.findOneOrFail({
      where: {
        userId: id,
        token: refreshToken,
      },
    });

    await token.destroy();

    return res.send(STATUS_SUCCESS);
  },
);

/**
 * POST /api/auth/sign-up
 * @summary Register new User
 * @tags Auth
 * @param {AuthData} request.body.required - User registration data
 * @return {User} 200 - Created User
 */
router.post('/sign-up', async (req, res) => {
  const { email, password } = req.body;

  const exitUser = await User.findOne({
    where: {
      email: email.toLocaleString(),
    },
  });

  if (exitUser) {
    throw new CreateError(409, `Email already use`, {
      key: 'error.email-already-use',
    });
  }

  const user = await User.create({
    email,
    password,
  });

  const tokenData = await authService.createAndSaveAuthTokens(user);

  res.json(tokenData);
});

/**
 * @typedef {object} AuthTokenRefreshData
 * @property {string} userId
 * @property {string} refreshToken
 */
/**
 * POST /api/auth/refresh-token
 * @summary Issue new access and refresh tokens
 * @tags Auth
 * @param {AuthTokenRefreshData} request.body.required
 * @return {AuthTokensData} 200 - User Tokens
 */
router.post('/refresh-token', async (req, res) => {
  /** @type {AuthTokenRefreshData} */
  const { refreshToken, userId } = req.body;

  const foundRefreshToken = await Token.findOne({
    where: { token: refreshToken, userId },
  });

  if (!foundRefreshToken) {
    throw new CreateError(401, 'Refresh token has expired or invalid', {
      key: 'error.refresh-token-has-expired',
    });
  }

  if (foundRefreshToken.expiresAt < new Date()) {
    await Token.destroy({
      where: { userId, token: refreshToken },
    });

    throw new CreateError(401, 'Refresh token has expired or invalid', {
      key: 'error.refresh-token-has-expired',
    });
  }

  const user = await User.findByPkOrFail(foundRefreshToken.userId);

  const tokenData = await authService.createAndSaveAuthTokens(user);

  await foundRefreshToken.destroy();

  res.json(tokenData);
});

/**
 * POST /api/auth/password/forgot
 * @summary Send forgot password email 1/3
 * @tags Auth
 * @param {ForgotPasswordData} request.body.required - User data
 * @return {ResponseStatus} 201
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOneOrFail({
    where: {
      email,
    },
  });

  const token = await authService.createAndSaveResetPasswordToken(user);

  await mailer.send({
    from: DEFAULT_SENDER_EMAIL,
    to: user.email,
    subject: 'Reset password for Caesar',
    html: `<button><a href="${FRONTEND_BASE_URL}/reset-password?token=${token}">Reset password</a></button>`,
  });

  return res.status(201).json(STATUS_SUCCESS);
});

/**
 * @typedef {object} ResetPasswordVerifyTokenData
 * @property {string} token
 */

/**
 * @typedef {object} ResetPasswordData
 * @property {string} token
 * @property {string} password
 * @property {string} confirmPassword
 */

/**
 * POST /api/auth/password/reset-verify
 * @summary Check if the password reset token is valid 2/3
 * @tags Auth
 * @param {ResetPasswordData} request.body.required - Token for reset password
 * @return {ResetPasswordVerifyTokenData} 200
 */
router.post('/password/reset-verify', async (req, res) => {
  const { token } = req.body;

  const restPasswordToken = await Token.findOne({
    where: {
      token,
    },
  });

  if (!restPasswordToken) {
    throw new CreateError(401, 'Refresh token has expired or invalid', {
      key: 'error.refresh-token-has-expired',
    });
  }

  if (restPasswordToken.expiresAt < new Date()) {
    await Token.destroy({
      where: { token },
    });

    throw new CreateError(401, 'Refresh token has expired or invalid', {
      key: 'error.refresh-token-has-expired',
    });
  }

  return res.status(200).json(STATUS_SUCCESS);
});

/**
 * @typedef {object} ForgotPasswordData
 * @property {string} email User's email address
 */

/**
 * POST /api/auth/password/reset
 * @summary Reset user's password 3/3
 * @tags Auth
 * @param {ResetPasswordData} request.body.required - New password data
 * @return {ResponseStatus} 201
 */
router.post('/password/reset', async (req, res) => {
  const { token, password } = req.body;
  const resetPasswordToken = await Token.findOne({
    where: { token },
  });

  if (!resetPasswordToken) {
    throw new CreateError(401, 'Refresh token has expired or invalid', {
      key: 'error.refresh-token-has-expired',
    });
  }

  if (resetPasswordToken.expiresAt < new Date()) {
    await Token.destroy({
      where: { token },
    });

    throw new CreateError(401, 'Refresh token has expired or invalid', {
      key: 'error.refresh-token-has-expired',
    });
  }

  const user = await User.findByPkOrFail(resetPasswordToken.userId);

  user.password = password;
  await user.save();

  await Token.destroy({
    where: {
      id: user.id,
    },
  });

  return res.status(200).json(STATUS_SUCCESS);
});

export default router;
