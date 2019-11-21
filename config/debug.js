const responseTime = require('response-time');
const errorHandler = require('errorhandler');

module.exports = (app) => {
  if (process.env.NODE_ENV !== 'production') {
    app.use(errorHandler());
    app.use(responseTime());
  }
};
