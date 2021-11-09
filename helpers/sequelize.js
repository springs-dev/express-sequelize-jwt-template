const { NotFound } = require('http-errors');

/**
 * example:
 User.findOne({
      where: { id },
    })
 .then(rejectOnNotFound)
 * @param item
 * @param key - eg. 'user.not-found'
 * @returns {Promise<never>|Promise<unknown>}
 */
const rejectOnNotFound = (item, key) => {
  if (item) {
    return Promise.resolve(item);
  }

  return Promise.reject(key ? new NotFound({ key }) : new NotFound());
};

module.exports = {
  rejectOnNotFound,
  rejectOnNotFoundWithKey: (key) => (item) => rejectOnNotFound(item, key),
};
