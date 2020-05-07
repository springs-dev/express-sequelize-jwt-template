const Generator = require('yeoman-generator');
const pluralize = require('pluralize');
const moment = require('moment');
const _ = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('modelName', { type: String, required: true });
    this.argument('modelAttributes', { type: String, required: true });
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
      const { modelName, modelAttributes } = this.options;
      const pluralModelName = pluralize.plural(modelName);

      this.modelName = {
        camelCase: _.upperFirst(_.camelCase(modelName)),
        lowerCamelCase: _.camelCase(modelName),
        kebabCase: _.kebabCase(modelName),
      };

      this.pluralModelName = {
        camelCase: _.upperFirst(_.camelCase(pluralModelName)),
        lowerCamelCase: _.camelCase(pluralModelName),
        kebabCase: _.kebabCase(pluralModelName),
      };

      this.modelAttibutes = modelAttributes
        .split(/[, ]+/)
        .reduce((acc, item) => {
          const [key, dataType] = item.split(':');
          acc[key] = dataType;
          return acc;
        }, {});

      this.isSecure = isSecure;
    });
  }

  app() {
    this.fs.copyTpl(
      '_templates/model.js.ejs',
      this.destinationPath(`models/${this.modelName.camelCase}.js`),
      this
    );
    this.fs.copyTpl(
      '_templates/migration.js.ejs',
      this.destinationPath(
        `migrations/${moment().format('YYYYMMDDhhmmss')}-create-${
          this.modelName.kebabCase
        }.js`
      ),
      this
    );
    this.fs.copyTpl(
      '_templates/route.js.ejs',
      this.destinationPath(`routes/${this.pluralModelName.lowerCamelCase}.js`),
      this
    );
  }

  end() {
    this.log(
      `Done!
Add next code to routes/index.js:

const ${this.pluralModelName.lowerCamelCase} = require('./${this.pluralModelName.lowerCamelCase}');
router.use('/${this.pluralModelName.lowerCamelCase}', ${this.pluralModelName.lowerCamelCase});

`
    );
  }
};
