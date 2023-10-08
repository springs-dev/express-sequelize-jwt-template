import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_CONFIG } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Swagger configuration object for express-jsDoc-swagger.
 * This configuration helps generate Swagger UI based API documentation.
 */
export const SWAGGER_CONFIG = {
  info: {
    version: '1.0.0', // The version of the API documentation.
    title: APP_CONFIG.name, // The title of the API, typically the name of the application.
    description: `API documentation for ${APP_CONFIG.name}`, // A short description of the API. It can be detailed as needed.
  },
  security: {
    JWT: {
      type: 'apiKey', // Type of the security scheme.
      in: 'header', // Location of the API key (e.g., "header").
      name: 'Authorization', // Name of the header field to be used.
      description: 'JWT token for authentication', // Description of the security scheme.
    },
  },
  baseDir: path.resolve(__dirname, '../'), // The base directory where the 'filesPattern' paths will resolve from.
  filesPattern: ['./routes/*.js', './services/*.js', './utils/*.js', './models/*.js'], // Glob patterns to include for Swagger documentation.
  exposeApiDocs: true, // Flag to expose generated API documentation as JSON.
  apiDocsPath: '/api-docs.json', // Path where the API documentation JSON will be served.
};
