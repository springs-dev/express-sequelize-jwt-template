import CreateError from 'http-errors';
import _ from 'lodash-es';
import { ValidationError as SequelizeValidationError } from 'sequelize';

const errorHandlers = {
  SequelizeValidationError: (error) => ({
    key: 'error.validation_failure',
    message: `Validation failed: ${error.errors.map((e) => e.message).join('; ')}`,
    statusCode: 400,
  }),
  SequelizeUniqueConstraintError: (error) => ({
    key: 'error.duplicate_entry',
    message: `Duplicate entry: ${Object.values(error.fields).join(', ')} already exists.`,
    statusCode: 400,
  }),
  SequelizeForeignKeyConstraintError: () => ({
    key: 'error.foreign_key_constraint',
    message: 'Invalid reference: A foreign key constraint fails.',
    statusCode: 400,
  }),
  SequelizeDatabaseError: (error) => {
    if (error.original && error.original.code === '22P02') {
      return {
        key: 'error.invalid_data_format',
        message: error.message,
        statusCode: 400,
      };
    }
    return {
      key: 'error.database_error',
      message: error.message || 'An internal error occurred. Please try again later.',
      statusCode: 500,
    };
  },
};

/**
 * Handles Sequelize database errors by matching them with defined handlers.
 * If a specific handler for the error is defined, it formats the error accordingly,
 * otherwise, it defaults to a general database error response.
 *
 * @param {Error} error - The error object thrown by Sequelize.
 * @returns {object} A formatted error response object with `key`, `message`, and `statusCode`.
 */
const handleDatabaseError = (error) => {
  const handler =
    errorHandlers[error.name] ||
    (() => ({
      key: 'error.unknown_database_error',
      message: 'An unexpected database error occurred.',
      statusCode: 500,
    }));
  return handler(error);
};

/**
 * Handle sequelize validation errors.
 * @param {SequelizeValidationError} err - The error object
 * @returns {object} Formatted error object
 */
const handleSequelizeValidationError = (err) => {
  return {
    key: 'error.validation',
    message: 'Validation',
    incidentDetails: err.errors.map((errorItem) => ({
      location: 'body',
      message: errorItem.message,
      key: `error.${errorItem.validatorKey}`,
    })),
  };
};

/**
 * Handle HTTP errors.
 * @param {object} err - The error object
 * @returns {object} Formatted error object
 */
const handleHttpError = (err) => {
  const { statusCode, message, expose, key } = err;
  const defaultMessage = err.constructor.name.replace('Error', '');
  const defaultKey = `error.${_.kebabCase(defaultMessage)}`;
  return {
    statusCode,
    // Suppress detailed error messages for server errors (status codes 5xx) to prevent
    // exposing sensitive system information and enhance security.
    message: expose ? message ?? defaultMessage : defaultMessage,
    key: key ?? defaultKey,
  };
};

/**
 * Middleware for error handling.
 * @param {CreateError.HttpError | Error | null} err - The error object
 * @param {import('express').Request} req - The Express request object
 * @param {import('express').Response} res - The Express response object
 * @param {import('express').NextFunction} next - The next middleware function
 */
export const errorHandlerMiddleware = (err, req, res, next) => {
  if (!err) return next();

  if (err instanceof SequelizeValidationError)
    return res.status(400).json(handleSequelizeValidationError(err));
  if (err instanceof CreateError.HttpError)
    return res.status(err.statusCode).json(handleHttpError(err));
  if (err.name && err.name.startsWith('Sequelize')) {
    const handledError = handleDatabaseError(err);
    return res.status(handledError.statusCode).json(handledError);
  }

  const statusCode = err.status ?? err.statusCode ?? 500;

  return res.status(statusCode).json({
    key: 'error.internal_server_error',
    message: err.message || err || 'An internal error occurred. Please try again later.',
    statusCode,
  });
};
