import { ADMIN_EMAIL, ADMIN_PASSWORD } from '#src/configs/constants.js';
import User from '#src/models/user.js';

export default {
  up: async () => {
    await User.findOrCreate({
      where: { email: ADMIN_EMAIL },
      defaults: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        // role: ROLES.ADMIN,
      },
    });
  },

  down: async () => {
    await User.destroy({
      where: { email: ADMIN_EMAIL },
    });
  },
};
