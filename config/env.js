require('dotenv-flow').config();
const { join } = require('path');

require('dotenv-safe').config({
  allowEmptyValues: true,
  path: join(__dirname, '..', '.env.local'),
  example: join(__dirname, '..', '.env.local.example'),
});
