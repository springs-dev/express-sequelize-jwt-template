/**
 * Middleware for handling unhandled promise rejections. This ensures that any unhandled promise rejections are caught
 * and passed forward to the next middleware in the stack, potentially an errors.md middleware.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The callback function to pass control to the next middleware.
 */
export const unhandledRejectionMiddleware = (req, res, next) => {
  /**
   * Callback for 'unhandledRejection' event, invoked when there is an unhandled promise rejection.
   * It forwards the error reason to the next middleware in line.
   *
   * @param {*} reason - The reason for the promise rejection, can be any value or Error object.
   */
  const unhandledRejection = (reason) => {
    next(reason);
  };

  process.on('unhandledRejection', unhandledRejection);

  const originalEnd = res.end;
  res.end = (chunk, encoding) => {
    process.removeListener('unhandledRejection', unhandledRejection);

    if (res.finished) return;
    originalEnd.call(res, chunk, encoding);
  };

  next();
};
