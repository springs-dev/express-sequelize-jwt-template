const Sequelize = require('sequelize');

module.exports = (err, req, res, next) => {
  if (!err) {
    next();
  }

  console.error(err.errors || err.message);

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

  res.status(err.status || 500).json({ message: err.message });
};
