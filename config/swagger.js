const swagger = require('express-jsdoc-swagger');
const path = require('path');

module.exports = (app) => {
  swagger(app)({
    info: {
      version: '1.0.0',
      title: 'app-name',
      description: '',
    },
    security: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
    baseDir: path.resolve(__dirname, '../'),
    filesPattern: ['./routes/*.js', './helpers/*.js', './models/*.js'],
    exposeApiDocs: true,
    apiDocsPath: '/api-docs.json',
  });
};
