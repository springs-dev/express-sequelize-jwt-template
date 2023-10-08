import crypto from 'node:crypto';

import { DEFAULT_PER_PAGE_COUNT } from '#src/configs/constants.js';

/**
 * @typedef {object} ResponseStatus
 * @property {boolean} status
 */

/**
 * @typedef {object} SortOrder
 * @property {string} sortFiled - Field to sort by.
 * @property {string} sortDirection - Sort direction. - enum:ASC,DESC
 */

/**
 *
 * @param {import('express').Request} req
 * @returns {{limit: number, offset: number, page: (number)}}
 */
export const createPageOptions = (req) => {
  const page = parseInt(req.query?.page ?? 1, 10);
  const limit = parseInt(req.query?.limit ?? DEFAULT_PER_PAGE_COUNT, 10);
  const offset = (page - 1) * page;
  return { page, limit, offset };
};

/**
 * Generates a random string.
 * @param {number} [length=10] - The length of the string.
 * @returns {string} The generated string.
 */
export const generateRandomString = (length = 10) => {
  const bytes = crypto.randomBytes(Math.ceil(length / 2));
  return bytes.toString('hex').slice(0, length);
};
