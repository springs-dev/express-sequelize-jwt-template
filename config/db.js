const Sequelize = require('sequelize');
const highlightSQL = require('sequelize-log-syntax-colors').default;

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    logging:
      process.env.IS_DB_LOG_ENABLED === 'true'
        ? (text) => {
            console.log(highlightSQL(text));
          }
        : false,
    host: process.env.DB_HOST || '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
  }
);
