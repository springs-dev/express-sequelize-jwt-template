/* eslint-disable import/order, no-unused-vars */
// DON'T DELETE THIS
import env from '#src/configs/env.js';
/* eslint-enable import/order */
import { resolve } from 'node:path';

import { Sequelize } from 'sequelize';
// eslint-disable-next-line node/no-unpublished-import,import/no-extraneous-dependencies
import { Umzug, SequelizeStorage } from 'umzug';

import database from '#src/database.js';
import { logger } from '#src/libs/logger.js';

await database.start();
const { sequelize } = database;

/**
 * Load migration or seed files based on the provided path.
 * @returns {Function} - A function to resolve the migration or seed file.
 */
const loadMigrationOrSeedFiles = () => (params) => {
  const getModule = () => import(params.path);

  return {
    name: params.name,
    path: params.path,
    up: async ({ context }) => {
      const module = await getModule();
      if (!module?.default?.up)
        throw new Error(`'up' is missing in migration module ${params.path}`);

      return module.default.up(context.sequelize.queryInterface, Sequelize);
    },
    down: async ({ context }) => {
      const module = await getModule();
      if (!module?.default?.down)
        throw new Error(`'down' is missing in migration module ${params.path}`);

      return module.default.down(context.sequelize.queryInterface, Sequelize);
    },
  };
};

/**
 * Create an instance of Umzug for managing migrations or seeds.
 * @param {string} pathToFiles - Path to migration or seed files.
 * @param {boolean} [isSeeds=false] - Flag to determine if the current operation is for seeds.
 * @returns {Umzug} - An instance of Umzug.
 */
const createUmzugInstance = (pathToFiles, isSeeds = false) =>
  new Umzug({
    migrations: {
      glob: `${pathToFiles}/*.js`,
      resolve: loadMigrationOrSeedFiles(isSeeds),
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger,
  });

/**
 * Execute migration or seed operation based on the command-line argument.
 */
const run = async () => {
  const command = process.argv[2];
  const commandConfig = {
    'db:migrate': { path: './src/migrations', action: 'up' },
    'db:migrate:undo': { path: './src/migrations', action: 'down' },
    'db:seed:up': { path: './src/seeders', action: 'up' },
    'db:seed:undo': { path: './src/seeders', action: 'down' },
  };
  const settings = commandConfig[command];
  if (settings) {
    const umzugInstance = createUmzugInstance(resolve(settings.path), settings.isSeed);
    if (umzugInstance && settings.action) await umzugInstance[settings.action]();
    return;
  }
  logger.error('Unknown command');
};

try {
  await run();
} catch (e) {
  logger.error(e);
} finally {
  // eslint-disable-next-line no-process-exit
  process.exit(0);
  await database.close();
}
