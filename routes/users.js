const router = require('express').Router();
const passport = require('passport');
const { User } = require('../models');
const { createAndSaveAuthTokens } = require('../helpers/tokens');

/**
 * @typedef {object} UserCreationData
 * @property {string} email
 * @property {string} password
 */

/**
 * POST /api/users
 * @summary Register new User
 * @tags Users
 * @param {UserCreationData} request.body.required - User registration data
 * @return {User} 200 - Created User
 */
router.post('/', (req, res, next) => {
  User.create({
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => createAndSaveAuthTokens(user, req))
    .then((tokenData) => res.json(tokenData))
    .catch(next);
});

/**
 * GET /api/users
 * @summary Get users list
 * @tags Users
 * @security JWT
 * @return {Array.<User>} 200 - Users list
 */
router.get('/', passport.authenticate('jwt'), (req, res, next) => {
  User.findAll()
    .then((keys) => res.json(keys))
    .catch(next);
});

module.exports = router;
