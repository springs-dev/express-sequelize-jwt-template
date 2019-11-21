const swagger = require('express-swagger-generator');
const path = require('path');

module.exports = (app) => {
  swagger(app)({
    swaggerDefinition: {
      host: process.env.API_URL.replace(/^https?:\/\//i, ''),
      basePath: '/api',
      produces: ['application/json'],
      schemes: [process.env.API_URL.replace(/:\/\/.+/, '')],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: '',
        },
      },
    },
    basedir: path.resolve(__dirname, '../'),
    files: ['./routes/*.js', './helpers/*.js', './models/*.js'],
  });
};
