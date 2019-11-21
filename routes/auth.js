const router = require('express').Router();
const passwordGenerator = require('generate-password');
const mailgun = require('../config/mailgun');
const { User } = require('../models');
const { FRONT_APP_URL, EMAIL_FROM } = require('../config/constants');
const {
  createAndSaveAuthTokens,
  createAndSaveResetPasswordToken,
} = require('../helpers/tokens');

/**
 * @typedef SentResponseData
 * @property {boolean} sent
 */

/**
 * @typedef AuthData
 * @property {string} email
 * @property {string} password
 */

/**
 * @route POST /login
 * @group Auth
 * @param {AuthData.model} .body.required - User login data
 * @returns {AuthTokensData.model} 200 - User Tokens
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
 * @typedef AuthTokenRefreshData
 * @property {string} id User id
 * @property {string} refreshToken
 */
/**
 * @route POST /auth-token-refresh
 * @group Auth
 * @param {AuthTokenRefreshData.model} .body.required - User Tokens
 * @returns {AuthTokensData.model} 200 - New tokens
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
 * @typedef ForgotPasswordData
 * @property {string} email
 */
/**
 * @route POST /forgot-password
 * @group Auth
 * @param {ForgotPasswordData.model} .body.required - User data
 * @returns {SentResponseData.model} 200
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
  await mailgun.messages().send({
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Reset password for app-name',
    text: `Follow the link to reset your password: ${FRONT_APP_URL}/reset-password?token=${token}`,
  });

  res.json({ sent: true });
});

/**
 * @typedef ResetPasswordData
 * @property {string} token
 */
/**
 * @route POST /reset-password
 * @group Auth
 * @param {ResetPasswordData.model} .body.required - Reset token
 * @returns {SentResponseData.model} 200
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

  await mailgun.messages().send({
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Your new password for app-name',
    text: `Your new password is: ${password}\nUse it for login ${FRONT_APP_URL}/login`,
  });

  res.json({ sent: true });
});

module.exports = router;
