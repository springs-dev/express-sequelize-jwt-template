const { NotFound } = require('http-errors');

/**
 * example:
 User.findOne({
      where: { id },
    })
 .then(rejectOnNotFound)
 * @param item
 * @returns {Promise<never>|Promise<unknown>}
 */
const rejectOnNotFound = (item) => {
  if (item) {
    return Promise.resolve(item);
  }

  return Promise.reject(new NotFound());
};

module.exports = {
  rejectOnNotFound,
};
