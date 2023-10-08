import http from 'node:http';
import * as util from 'node:util';

import compressionMiddleware from 'compression';
import corsMiddleware from 'cors';
import express from 'express';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import expressRateLimitMiddleware from 'express-rate-limit';
import helmetMiddleware from 'helmet';
import CreateError from 'http-errors';
import requestLoggerMiddleware from 'pino-http';

import { APP_CONFIG } from '#src/configs/app.js';
import { REQUEST_LOGGER_CONFIG } from '#src/configs/logger.js';
import { SWAGGER_CONFIG } from '#src/configs/swagger.js';
import { logger } from '#src/libs/logger.js';
import { errorHandlerMiddleware } from '#src/middlewares/error-handler.js';
import { passportMiddleware } from '#src/middlewares/passport.js';

const app = express();
const server = http.createServer(app);

/** Initialize middlewares required for the application. */
const initializeMiddlewares = () => {
  app.use(requestLoggerMiddleware(REQUEST_LOGGER_CONFIG));
  app.use(helmetMiddleware());
  app.use(compressionMiddleware());
  app.use(corsMiddleware());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(expressRateLimitMiddleware(APP_CONFIG.rateLimit));

  expressJSDocSwagger(app)(SWAGGER_CONFIG);
  passportMiddleware(app);
};

/** Initialize application routes. */
const initializeRoutes = async () => {
  const rootRoutesModule = await import('#src/routes/index.js');
  app.use('/api', rootRoutesModule.default);
};

/** Initialize error handling mechanisms. */
const initializeErrorHandling = () => {
  app.use((req, res, next) =>
    next(CreateError(404, "Resource not found'", { key: 'error.resource-not-found' })),
  );
  app.use(errorHandlerMiddleware);
};

/** Start the application server. */
const startServer = async () => {
  app.set('trust proxy', APP_CONFIG.enableTrustProxy);
  initializeMiddlewares();
  await initializeRoutes();
  initializeErrorHandling();

  server.listen(APP_CONFIG.port, () => {
    logger.info(
      `[${APP_CONFIG.name}] 🚀 App started on the http://localhost:${APP_CONFIG.port} ENV: ${APP_CONFIG.env}`,
    );
  });
};

/** Gracefully stop the application server */
const closeServer = async () => {
  if (!server || typeof server.close !== 'function') return;
  const closeServerHandler = util.promisify(server.close.bind(server));
  await closeServerHandler();
  logger.info(`[${APP_CONFIG.name}] Server closed gracefully`);
};

export default {
  start: startServer,
  close: closeServer,
  server,
};
