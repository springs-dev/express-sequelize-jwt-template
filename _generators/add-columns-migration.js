/**
 * Module for Yeoman generator.
 * @module GeneratorModule
 */

// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import, import/no-extraneous-dependencies,node/no-unpublished-import
import pluralize from 'pluralize';
// eslint-disable-next-line node/no-unpublished-import,import/no-extraneous-dependencies, import/no-extraneous-dependencies,node/no-unpublished-import
import Generator from 'yeoman-generator';

import getModelAttributeNames from './helpers/get-model-attribute-names.js';
import getModelNames from './helpers/get-model-names.js';
import getTimestamp from './helpers/get-timestamp.js';

/**
 * Custom Yeoman generator for generating code.
 *
 * @extends Generator
 */
export default class extends Generator {
  /**
   * Constructor for the generator.
   *
   * @param {String[]} args - Command line arguments.
   * @param {Object} opts - Generator options.
   */
  constructor(args, opts) {
    super(args, opts);
    this.argument('modelName', { type: String, required: true });
    this.argument('modelAttributes', { type: Array, required: true });
  }

  /**
   * Main generator function.
   */
  app() {
    const { modelName, modelAttributes } = this.options;
    this.modelNames = getModelNames(modelName);
    this.pluralModelNames = getModelNames(pluralize.plural(modelName));
    this.typeNamesByModelAttibutes = getModelAttributeNames(modelAttributes);

    this.fs.copyTpl(
      '_generators/templates/add-columns-migration.js.ejs',
      this.destinationPath(
        `migrations/${getTimestamp()}-add-${Object.keys(this.typeNamesByModelAttibutes).join(
          '-',
        )}-to-${this.modelNames.kebabCase}.js`,
      ),
      this,
    );
  }
}