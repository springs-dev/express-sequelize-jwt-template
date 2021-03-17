const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config/constants');
const { User } = require('../models');

module.exports = {
  up: () =>
    User.findOrCreate({
      where: { email: ADMIN_EMAIL },
      defaults: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        // role: ROLES.ADMIN,
      },
    }),

  down: () =>
    User.delete({
      where: { email: ADMIN_EMAIL },
    }),
};
