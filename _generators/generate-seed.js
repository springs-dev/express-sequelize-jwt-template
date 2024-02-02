/**
 * Module for Yeoman generator.
 * @module GeneratorModule
 */

// eslint-disable-next-line node/no-unpublished-import,import/no-extraneous-dependencies
import Generator from 'yeoman-generator';

import getModelNames from './helpers/get-model-names.js';
import getTimestamp from './helpers/get-timestamp.js';

/**
 * Custom Yeoman generator for generating code.
 *
 * @extends Generator
 */
export default class extends Generator {
  /**
   *
   * Constructor for the generator.
   *
   * @param {String[]} args - Command line arguments.
   * @param {Object} opts - Generator options.
   */
  constructor(args, opts) {
    super(args, opts);
    this.argument('modelName', { type: String, required: true });
  }

  /**
   * Main generator function.
   */
  app() {
    const { modelName } = this.options;
    this.modelNames = getModelNames(modelName);

    this.fs.copyTpl(
      '_generators/templates/seed.js.ejs',
      this.destinationPath(`src/seeders/${getTimestamp()}-${this.modelNames.kebabCase}.js`),
      this,
    );
  }
}
