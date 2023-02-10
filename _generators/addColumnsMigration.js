const Generator = require('yeoman-generator');
const pluralize = require('pluralize');
const getTimestamp = require('./helpers/getTimestamp');
const getModelAttributeNames = require('./helpers/getModelAttributeNames');
const getModelNames = require('./helpers/getModelNames');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('modelName', { type: String, required: true });
    this.argument('modelAttributes', { type: Array, required: true });
  }

  app() {
    const { modelName, modelAttributes } = this.options;
    this.modelNames = getModelNames(modelName);
    this.pluralModelNames = getModelNames(pluralize.plural(modelName));
    this.typeNamesByModelAttibutes = getModelAttributeNames(modelAttributes);

    this.fs.copyTpl(
      '_generators/templates/addColumnsMigration.js.ejs',
      this.destinationPath(
        `migrations/${getTimestamp()}-add-${Object.keys(
          this.typeNamesByModelAttibutes
        ).join('-')}-to-${this.modelNames.kebabCase}.js`
      ),
      this
    );
  }
};
