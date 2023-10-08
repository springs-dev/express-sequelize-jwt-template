import { logger } from '#src/libs/logger.js';

export const SEQUELIZE_CONFIG = {
  // The database dialect. Defaults depend on the dialect used.
  dialect: process.env.DB_TYPE,
  // The hostname of the database you are connecting to. Defaults to 'localhost'.
  host: process.env.DB_HOSTNAME,
  // The username which is used to authenticate against the database.
  username: process.env.DB_USERNAME,
  // The password which is used to authenticate against the database.
  password: process.env.DB_PASSWORD,
  // The port of the database you are connecting to. Defaults depend on the dialect used.
  port: process.env.DB_PORT,
  // The name of the database.
  database: process.env.DB_NAME,
  // The timezone used when storing dates in the database. Defaults to the local timezone.
  timezone: '+00:00',
  define: {
    // Default true
    // Should Sequelize add `createdAt` and `updatedAt` fields to your tables? Defaults to true.
    timestamps: false,
    // Default false
    // Enables "soft" deletes. It won't actually delete the data but sets a `deletedAt` timestamp.
    // Default value for `paranoid` is not set because it's false by default and only relevant if `timestamps` is true.
    paranoid: false,
    // Default false
    // Converts all camelCased columns to underscored (e.g. `updatedAt` to `updated_at`). Defaults to false.
    underscored: false,
    // Default false
    // Disables the modification of table names; Sequelize will not pluralize model names. Defaults to false.
    freezeTableName: false,
  },
  // Logging function. Defaults to `console.log`. Set to `false` for no logging.
  logging: process.env.ENABLE_DB_LOGGING === '1' ? (data) => logger.debug(data) : false,
  pool: {
    min: 2, // Minimum number of connections in pool. Defaults to 0.
    max: 40, // Maximum number of connections in pool. Defaults to 5.
    acquire: 6000000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error. Defaults to 60000.
    idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released. Defaults to 10000.
    evict: 1000, // The interval, in milliseconds, for evicting stale connections. No default value provided by Sequelize documentation.
  },
};
