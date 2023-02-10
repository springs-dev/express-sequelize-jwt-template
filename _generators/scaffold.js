const Generator = require('yeoman-generator');
const pluralize = require('pluralize');
const getTimestamp = require('./helpers/getTimestamp');
const getModelNames = require('./helpers/getModelNames');
const getModelAttributeNames = require('./helpers/getModelAttributeNames');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('modelName', { type: String, required: true });
    this.argument('modelAttributes', { type: Array, required: true });
  }

  prompting() {
    return this.prompt([
      {
        type: 'confirm',
        name: 'isSecure',
        message: 'Need request authorization?',
        default: true,
      },
    ]).then(({ isSecure }) => {
      this.isSecure = isSecure;
    });
  }

  app() {
    const { modelName, modelAttributes } = this.options;
    this.modelNames = getModelNames(modelName);
    this.pluralModelNames = getModelNames(pluralize.plural(modelName));
    this.typeNamesByModelAttibutes = getModelAttributeNames(modelAttributes);

    this.fs.copyTpl(
      '_generators/templates/model.js.ejs',
      this.destinationPath(`models/${this.modelNames.camelCase}.js`),
      this
    );
    this.fs.copyTpl(
      '_generators/templates/migration.js.ejs',
      this.destinationPath(
        `migrations/${getTimestamp()}-create-${this.modelNames.kebabCase}.js`
      ),
      this
    );
    this.fs.copyTpl(
      '_generators/templates/route.js.ejs',
      this.destinationPath(`routes/${this.pluralModelNames.lowerCamelCase}.js`),
      this
    );
  }

  end() {
    this.log(`
Add next code to routes/index.js:

const ${this.pluralModelNames.lowerCamelCase} = require('./${this.pluralModelNames.lowerCamelCase}');
router.use('/${this.pluralModelNames.lowerCamelCase}', ${this.pluralModelNames.lowerCamelCase});

`);
  }
};
