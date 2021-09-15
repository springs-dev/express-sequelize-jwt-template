const Sequelize = require('sequelize');

const respondWithHttpOrUnknownError = (err, res) => {
  const data = {};
  if (err instanceof String) {
    data.message = err;
  }
  if (err.message) {
    data.message = err.message;
  }
  if (err.key) {
    data.key = err.key;
  }

  res.status(err.status || 500).json(data);
};

module.exports = (err, req, res, next) => {
  if (!err) {
    next();
  }

  console.error(err.errors || err.message || err);

  if (err instanceof Sequelize.ValidationError) {
    res.status(err.status || 400).json(
      err.errors.map(({ path, validatorKey, validatorArgs, message }) => ({
        path,
        validatorKey: `error.${validatorKey}`,
        validatorArgs,
        message,
      }))
    );

    return;
  }

  respondWithHttpOrUnknownError(err, res);
};
