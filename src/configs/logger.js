const commonConfig = {
  redact: {
    paths: ['pid', 'hostname', 'body.password', 'req.headers', 'res.headers'],
    remove: true,
  },
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.ENABLE_PRETTY_LOG === '1'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            ignore: 'serviceContext',
            translateTime: 'SYS:HH:MM:ss.l',
          },
        }
      : null,
};

export const LOGGER_CONFIG = {
  ...commonConfig,
};

export const REQUEST_LOGGER_CONFIG = {
  ...commonConfig,
  autoLogging: true,
  customLogLevel: (res, err) => {
    if (err?.statusCode >= 400) return 'warn';
    if (err?.statusCode >= 500) return 'error';
    return 'info';
  },
};
