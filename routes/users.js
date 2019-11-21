const router = require('express').Router();
const passport = require('passport');
const { User } = require('../models');
const { createAndSaveAuthTokens } = require('../helpers/tokens');

/**
 * @typedef UserCreationData
 * @property {string} email
 * @property {string} password
 */

/**
 * @route POST /users
 * @group Users
 * @param {UserCreationData.model} .body.required - User registration data
 * @returns {User.model} 200 - Created User
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
 * @route GET /users
 * @group Users
 * @security JWT
 * @returns {Array.<User>} 200 - Users list
 */
router.get('/', passport.authenticate('jwt'), (req, res, next) => {
  User.findAll()
    .then((keys) => res.json(keys))
    .catch(next);
});

module.exports = router;
