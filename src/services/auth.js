import jwt from 'jsonwebtoken';

import {
  AUTH_ACCESS_TOKEN_EXPIRATION_TIME,
  AUTH_REFRESH_TOKEN_EXPIRATION_TIME,
  AUTH_SECRET_KEY,
  AUTH_RESET_PASSWORD_TOKEN_EXPIRATION_TIME,
} from '#src/configs/constants.js';
import Token from '#src/models/token.js';
import { generateRandomString } from '#src/utils/common.js';

/**
 * @typedef {object} AuthTokensData
 * @property {number} userId
 * @property {string} accessToken
 * @property {string} refreshToken
 */

/**
 * Generates an access token for a user.
 * @param {object} user - The user for which to generate the token.
 * @returns {string} The generated access token.
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, AUTH_SECRET_KEY, {
    expiresIn: AUTH_ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

/**
 * Creates a refresh token and saves it in the database.
 * @param {string} userId - The ID of the user for which to create the token.
 * @returns {Promise<string>} The created refresh token.
 */
const createRefreshToken = async (userId) => {
  const refreshToken = generateRandomString(255);

  await Token.create({
    userId,
    token: refreshToken,
    expiresAt: AUTH_REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return refreshToken;
};

/**
 * Creates and saves authentication tokens for a user.
 * @param {object} user - The user for which to create the tokens.
 * @returns {Promise<Object>} The created access and refresh tokens.
 */
const createAndSaveAuthTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = await createRefreshToken(user.id);

  return { userId: user.id, accessToken: `JWT ${accessToken}`, refreshToken };
};

/**
 * Creates and saves a reset password token for a user.
 * @param {object} user - The user for which to create the token.
 * @returns {Promise<string>} The created reset password token.
 */
const createAndSaveResetPasswordToken = async (user) => {
  const payload = {
    id: user.id,
  };

  const resetPasswordToken = jwt.sign(payload, AUTH_SECRET_KEY, {
    expiresIn: AUTH_RESET_PASSWORD_TOKEN_EXPIRATION_TIME,
  });

  await Token.create({
    userId: user.id,
    token: resetPasswordToken,
    expiresAt: AUTH_REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return resetPasswordToken;
};

export { createAndSaveResetPasswordToken, createAndSaveAuthTokens };
