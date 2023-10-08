export const APP_CONFIG = {
  name: process.env.APP_NAME ?? 'App', // The name of the application. Defaults to 'App' if not specified.
  port: process.env.HTTP_PORT || 3001, // The port on which the application will run. Defaults to 3001 if not specified.
  env: process.env.NODE_ENV, // The environment in which the application is running (e.g., 'development', 'production').
  shutdownTimeout: 5000, // Time in milliseconds to wait before forcefully shutting down the app. Default is 5000ms.
  enableTrustProxy: 1, // Whether to enable the 'trust proxy' setting in Express (converts to boolean). No default provided; if needed, set explicitly.
  rateLimit: {
    windowMs: 60 * 1000, // Timeframe for which requests are checked/remembered. Here, 60,000ms (1 minute).
    limit: 100, // Maximum number of connections during `windowMs` milliseconds before sending a 429 response. Default is 100 requests per windowMs.
  },
};
