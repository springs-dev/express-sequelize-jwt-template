import express from 'express';

import { unhandledRejectionMiddleware } from '#src/middlewares/unhandled-rejection.js';
import auth from '#src/routes/auth.js';
import users from '#src/routes/users.js';

const router = express.Router();

router.all('*', unhandledRejectionMiddleware);
router.use('/auth', auth);
router.use('/users', users);
export default router;
