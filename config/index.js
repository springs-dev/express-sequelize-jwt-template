const api = require('./api');
const debug = require('./debug');
const passport = require('./passport');
const swagger = require('./swagger');

module.exports = (app) => {
  debug(app);
  api(app);
  passport(app);
  swagger(app);
};
