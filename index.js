/* eslint-disable no-process-exit,no-console, no-unused-vars */
/* eslint-disable import/order */
import '#src/configs/env.js';
/* eslint-enable import/order */

import CreateError from 'http-errors';
import { ValidationError as SequelizeValidationError } from 'sequelize';

import { APP_CONFIG } from '#src/configs/app.js';
import { logger } from '#src/utils/logger.js';

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;
let application;
let database;

process.on('exit', (code) =>
  console.info(`\x1b[38;5;43m[${APP_CONFIG.name}] Exit with code: ${code}.\x1b[0m`),
);

const gracefulShutdown = async () => {
  logger.info(`[${APP_CONFIG.name}]: Stopping application...`);

  const forceShutdown = setTimeout(() => {
    logger.info(`[${APP_CONFIG.name}]: Application stopped forcefully`);
    process.exit(EXIT_FAILURE);
  }, APP_CONFIG.shutdownTimeout);

  await Promise.allSettled([application.close(), database.close()]);

  logger.info(`[${APP_CONFIG.name}]: Application successfully stopped`);
  clearTimeout(forceShutdown);

  process.exit(EXIT_SUCCESS);
};

const initializeShutdownTriggers = () => {
  const handleSignal = async (signal) => {
    logger.info(`[${APP_CONFIG.name}]: ${signal} signal received`);
    await gracefulShutdown();
  };

  ['SIGTERM', 'SIGINT', 'SIGHUP'].forEach((signal) => {
    process.on(signal, () => handleSignal(signal));
  });

  process.on('unhandledRejection', (error, reason) => {
    if (error instanceof SequelizeValidationError) return;
    if (error instanceof CreateError.HttpError) return;
    if (error.name && error.name.startsWith('Sequelize')) return;
    console.log(error, reason);
    logger.warn(
      {
        type: 'unhandledRejection',
        name: error.name,
        message: error.message,
        stack: error.stack,
        reason,
      },
      'Unhandled promise rejection',
    );
  });

  process.on('uncaughtException', (error) =>
    logger.warn({
      type: 'uncaughtException',
      name: error.name,
      message: error.message,
      stack: error.stack,
    }),
  );
};

const init = async () => {
  try {
    initializeShutdownTriggers();

    const databaseModule = await import('#src/database.js');
    database = databaseModule.default;
    await database.start();

    const appModule = await import('#src/app.js');
    application = appModule.default;
    await application.start();
  } catch (err) {
    logger.error(err);
    process.exit(EXIT_FAILURE);
  }
};

// Initialize the server
await init();
