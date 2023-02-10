/* eslint-disable no-useless-escape */
const moment = require('moment/moment');

const getTimestamp = () => moment().format('YYYYMMDDhhmmss');

module.exports = getTimestamp;
