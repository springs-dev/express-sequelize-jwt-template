const router = require('express').Router();
const passwordGenerator = require('generate-password');
const { User } = require('../models');
const { FRONT_APP_URL, EMAIL_FROM } = require('../config/constants');
const sendEmail = require('../helpers/sendEmail');
const {
  createAndSaveAuthTokens,
  createAndSaveResetPasswordToken,
} = require('../helpers/tokens');

/**
 * @typedef {object} SentResponseData
 * @property {boolean} sent
 */

/**
 * @typedef {object} AuthData
 * @property {string} email
 * @property {string} password
 */

/**
 * POST /login
 * @summary Login user
 * @tags Auth
 * @param {AuthData} request.body.required - User login data
 * @return {AuthTokensData} 200 - User Tokens
 */
router.post('/login', async (req, res) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if (!user || !user.isEqualPassword(req.body.password)) {
    res.status(401).json({
      key: 'error.login-or-password',
      message: 'No such user or password is invalid',
    });
    return;
  }

  const tokenData = await createAndSaveAuthTokens(user, req);
  res.json(tokenData);
});

/**
 * @typedef {object} AuthTokenRefreshData
 * @property {string} id - User id
 * @property {string} refreshToken
 */

/**
 * POST /auth-token-refresh
 * @summary issue new access and refresh tokens
 * @tags Auth
 * @param {AuthTokenRefreshData} request.body.required - User Tokens
 * @return {AuthTokensData} 200 - New tokens
 */
router.post('/auth-token-refresh', async (req, res) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        id: req.body.userId,
        refreshToken: req.body.refreshToken,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if (!user) {
    res.status(401).json({ key: 'error.token-expired' });
    return;
  }

  const tokenData = await createAndSaveAuthTokens(user, req);
  res.json(tokenData);
});

/**
 * @typedef {object} ForgotPasswordData
 * @property {string} email
 */

/**
 * POST /forgot-password
 * @summary Send forgot password email
 * @tags Auth
 * @param {ForgotPasswordData} request.body.required - User data
 * @return {SentResponseData} 200
 */
router.post('/forgot-password', async (req, res) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if (!user) {
    res.status(404).json({ key: 'error.email-was-not-registered' });
    return;
  }

  const token = await createAndSaveResetPasswordToken(user);
  await sendEmail({
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Reset password for app-name',
    text: `Follow the link to reset your password: ${FRONT_APP_URL}/reset-password?token=${token}`,
  });

  res.json({ sent: true });
});

/**
 * @typedef {object} ResetPasswordData
 * @property {string} token
 */

/**
 * POST /reset-password
 * @summary Send reset password email
 * @tags Auth
 * @param {ResetPasswordData} request.body.required - Reset token
 * @return {SentResponseData} 200
 */
router.post('/reset-password', async (req, res) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        resetPasswordToken: req.body.token,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {
    console.error(e);
  }

  if (!user) {
    res.status(401).json({ key: 'error.url-is-invalid-or-expired' });
    return;
  }

  const password = passwordGenerator.generate();
  user.password = password;
  await user.save(user);

  await sendEmail({
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Your new password for app-name',
    text: `Your new password is: ${password}\nUse it for login ${FRONT_APP_URL}/login`,
  });

  res.json({ sent: true });
});

module.exports = router;
