import Pino from 'pino';

import { LOGGER_CONFIG } from '#src/configs/logger.js';

// Creates a Pino logger instance using the configuration specified in LOGGER_CONFIG.
// Pino provides extremely fast and low overhead logging capabilities.
// The LOGGER_CONFIG object should define various Pino options such as log level, serializers, transport, etc.
export const logger = Pino(LOGGER_CONFIG);

// For more detailed information about Pino and its configuration options,
// refer to the Pino documentation: http://getpino.io/#/docs/api
