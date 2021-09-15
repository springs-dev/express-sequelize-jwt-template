const router = require('express').Router();
const unhandledRejectionHandler = require('../helpers/unhandledRejectionHandler');
const auth = require('./auth');
const users = require('./users');
// const admin = require('./admin');

router.all('*', unhandledRejectionHandler);
router.use('/', auth);
router.use('/users', users);
// router.use('/admin', admin);

module.exports = router;
