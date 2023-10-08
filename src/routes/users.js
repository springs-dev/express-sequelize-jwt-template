import express from 'express';
import CreateError from 'http-errors';
import passport from 'passport';

import User from '#src/models/user.js';

const router = express.Router();

router.all('*', passport.authenticate('jwt', { session: false }));

/**
 * GET /api/users/current
 * @summary Get current authenticated user's information
 * @tags Users
 * @security JWT
 * @return {User} 200 - Authenticated User information
 */
router.get('/current', async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw CreateError.Unauthorized(
      'You are not authorized to access this resource. Please login and try again.',
    );
  }

  const user = await User.findByPkOrFail(userId);

  res.json(user);
});
export default router;
