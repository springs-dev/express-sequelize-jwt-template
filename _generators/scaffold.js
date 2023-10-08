/**
 * Module for Yeoman generator.
 * @module GeneratorModule
 */

// eslint-disable-next-line node/no-unpublished-import,import/no-extraneous-dependencies
import pluralize from 'pluralize';
// eslint-disable-next-line node/no-unpublished-import,import/no-extraneous-dependencies
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
  hasValidators = false;

  isSecure = false;

  /**
   * @param {String[]} args - Command line arguments.
   * @param {Object} opts - Generator options.
   */
  constructor(args, opts) {
    super(args, opts);
    this.argument('modelName', { type: String, required: true });
    this.argument('modelAttributes', { type: Array, required: true });
    this.typeNamesByModelAttibutes = null;
  }

  /**
   * @returns {Promise<void>} - Promise that resolves when the prompt is completed.
   */
  prompting() {
    return this.prompt([
      {
        type: 'confirm',
        name: 'isSecure',
        message: 'Need request authorization?',
        default: true,
      },
    ]).then((dto) => {
      const { isSecure, hasValidators } = dto;
      this.isSecure = isSecure;
      this.hasValidators = hasValidators;
    });
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
      '_generators/templates/model.js.ejs',
      this.destinationPath(`src/models/${this.modelNames.kebabCase}.js`),
      this,
    );
    this.fs.copyTpl(
      '_generators/templates/migration.js.ejs',
      this.destinationPath(
        `src/migrations/${getTimestamp()}-create-${this.modelNames.kebabCase}.js`,
      ),
      this,
    );
    this.fs.copyTpl(
      '_generators/templates/route.js.ejs',
      this.destinationPath(`src/routes/${this.pluralModelNames.kebabCase}.js`),
      this,
    );
  }

  end() {
    this.log(`
Add next code to routes/index.js:
import ${this.pluralModelNames.lowerCamelCase} from '#src/routes/${this.pluralModelNames.kebabCase}.js';
router.use('/${this.pluralModelNames.lowerCamelCase}', ${this.pluralModelNames.lowerCamelCase});
`);
  }
}
