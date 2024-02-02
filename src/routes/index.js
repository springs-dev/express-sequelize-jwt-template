import express from 'express';

import auth from '#src/routes/auth.js';
import users from '#src/routes/users.js';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', users);
export default router;
