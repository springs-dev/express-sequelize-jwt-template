import { writeFileSync } from 'node:fs';

// eslint-disable-next-line node/no-unpublished-import,import/no-extraneous-dependencies
import sequelizeErd from 'sequelize-erd';

// DON'T DELETE
// eslint-disable-next-line no-unused-vars
import dotenv from '#src/configs/env.js';
import database from '#src/database.js';

/**
 * Generate an Entity Relationship Diagram (ERD) for the Sequelize models.
 */
try {
  await database.start();
  const svg = await sequelizeErd({ source: database.sequelize }); // sequelizeErd() returns a Promise
  writeFileSync('./docs/erd.svg', svg);
} finally {
  await database.close();
}
