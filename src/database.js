import { promises as fsPromises } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

import cls from 'cls-hooked';
import _ from 'lodash-es';
import { Sequelize } from 'sequelize';

import { APP_CONFIG } from '#src/configs/app.js';
import { SEQUELIZE_CONFIG } from '#src/configs/sequelize.js';
import { logger } from '#src/utils/logger.js';

const MODELS_PATH = './src/models';

const namespace = cls.createNamespace('sequelize-transaction');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(SEQUELIZE_CONFIG);

/**
 * Load all model definitions.
 * @returns {Object.<string, import('sequelize').Model>} A map of model names to Sequelize model classes.
 */
const loadModels = async () => {
  const modelsDir = resolve(MODELS_PATH);
  const modelFiles = await fsPromises.readdir(modelsDir);
  /**
   * Load individual model definition.
   * @param {string} filename - Name of the model file.
   * @returns {Promise<[string, import('sequelize').Model|null]>} Tuple of model name and Sequelize model class.
   */
  const loadModel = async (filename) => {
    if (!filename.endsWith('.js') && !filename.endsWith('.mjs')) return null;
    const modelPath = join(modelsDir, filename);
    const { default: ModelClass } = await import(modelPath);
    if (_.isFunction(ModelClass?.initialization)) {
      const modelName = _.upperFirst(_.camelCase(basename(filename, extname(filename))));
      return [modelName, ModelClass.initialization(sequelize)];
    }
    logger.warn(`Model '${ModelClass.name}' lacks an 'initialization' function.`);
    return null;
  };

  const modelEntries = await Promise.all(modelFiles.map(loadModel));
  return Object.fromEntries(modelEntries.filter(Boolean));
};

/**
 * Associate Sequelize models with each other based on their relationships.
 * @param {Object.<string, import('sequelize').Model>} models - A map of model names to Sequelize model classes.
 */
const associateModels = (models) => {
  Object.values(models).forEach((model) => {
    if (_.isFunction(model?.associate)) {
      model.associate(models);
    }
  });
};

/**
 * Authenticate and initialize database connection and models.
 * @throws Will throw an error if authentication fails.
 */
const authenticateDatabase = async () => {
  try {
    await sequelize.authenticate();
    const models = await loadModels();
    associateModels(models);
    logger.info(`[${APP_CONFIG.name}] Connected to database: ${sequelize.config.database}`);
  } catch (error) {
    logger.error(`[${APP_CONFIG.name}] Database connection failed: ${error.message}`);
    throw error;
  }
};

/** Close the database connection. */
const closeDatabase = () => sequelize.close();

export default {
  start: authenticateDatabase,
  close: closeDatabase,
  sequelize,
};
