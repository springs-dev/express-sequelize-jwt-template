const Sequelize = require('sequelize');

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
  }
);
