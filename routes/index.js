const router = require('express').Router();
const auth = require('./auth');
const users = require('./users');
// const admin = require('./admin');

router.use('/', auth);
router.use('/users', users);
// router.use('/admin', admin);

module.exports = router;
