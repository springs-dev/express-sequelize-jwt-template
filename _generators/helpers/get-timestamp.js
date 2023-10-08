/**
 * Module for getting a timestamp using dayjs.
 * @module getTimestamp
 */

import dayjs from 'dayjs';

/**
 * Function for getting a timestamp formatted as 'YYYYMMDDhhmmss'.
 *
 * @returns {string} - Timestamp in the specified format.
 */
const getTimestamp = () => dayjs().format('YYYYMMDDhhmmss');

export default getTimestamp;
