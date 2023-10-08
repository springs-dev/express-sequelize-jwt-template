import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv-safe';

// Obtain the directory of the current file
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Configuration for loading environment variables from .env.local and .env.local.example files.
 * Uses the `dotenv-safe` library to ensure a safe loading of environment variables.
 *
 * @property {boolean} allowEmptyValues - allows for empty values in .env files.
 * @property {string} path - path to the file from which environment variables will be loaded.
 * @property {string} example - path to the sample .env file used to verify that all required variables are present in the main .env file.
 */
export default dotenv.config({
  allowEmptyValues: true,
  path: join(__dirname, '..', '..', '.env.local'),
  example: join(__dirname, '..', '..', '.env.local.example'),
});
