const Generator = require('yeoman-generator');
const pluralize = require('pluralize');
const moment = require('moment');
const _ = require('lodash');

const toSwaggerType = (type) => {
  const inArrayRegexp = /array\(([^)]+)\)/i;
  if (inArrayRegexp.test(type)) {
    const dataType = toSwaggerType(type.match(inArrayRegexp)[1]);
    return `Array.\<${dataType}\>`;
  }

  const inSquareBracketsRegexp = /\[([^\]]+)]/i;
  if (inSquareBracketsRegexp.test(type)) {
    const dataType = toSwaggerType(type.match(inSquareBracketsRegexp)[1]);
    return `Array.\<${dataType}\>`;
  }

  const withSquareBracketsEndingRegexp = /^([^)]+)\[]/i;
  if (withSquareBracketsEndingRegexp.test(type)) {
    const dataType = toSwaggerType(type.match(withSquareBracketsEndingRegexp)[1]);
    return `Array.\<${dataType}\>`;
  }

  if (
    /string|text|date|dateonly|enum|uuid|inet|macaddr|cidr|geometry|range/i.test(
      type
    )
  ) {
    return 'string';
  }

  if (/integer|bigint|real|decimal/i.test(type)) {
    return 'integer';
  }

  if (/float|real|double/i.test(type)) {
    return 'number';
  }

  if (/boolean/i.test(type)) {
    return 'boolean';
  }

  return type.replace(/\([^)]+\)/gi, '').toLowerCase();
};

const toSequelizeType = (type) => {
  const inSquareBracketsRegexp = /\[([^\]]+)]/i;
  if (inSquareBracketsRegexp.test(type)) {
    const dataType = toSequelizeType(type.match(inSquareBracketsRegexp)[1]);
    return `ARRAY(Sequelize.${dataType})`;
  }
  const withSquareBracketsEndingRegexp = /^([^)]+)\[]/i;
  if (withSquareBracketsEndingRegexp.test(type)) {
    const dataType = toSequelizeType(type.match(withSquareBracketsEndingRegexp)[1]);
    return `ARRAY(Sequelize.${dataType})`;
  }

  const withParameterRegexp = /\((["'0-9].+)\)]/i;
  if (withParameterRegexp.test(type)) {
    const dataType = toSequelizeType(type.match(withParameterRegexp)[1]);
    return type.replace(withParameterRegexp, `(${dataType})`);
  }

  const withNestedTypeRegexp = /\(((DataTypes\.|Sequelize\.)?.+)\)]/i;
  if (withNestedTypeRegexp.test(type)) {
    const dataType = toSequelizeType(type.match(withNestedTypeRegexp)[1]);
    return type.replace(withNestedTypeRegexp, `(Sequelize.${dataType})`);
  }

  return type.toUpperCase();
};

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

      const modelAttributesArray =
        modelAttributes.length === 1 && modelAttributes[0].indexOf(' ') >= 0
          ? modelAttributes[0].split(/[, ]/)
          : modelAttributes;

      this.modelAttibutes = modelAttributesArray.reduce((acc, item) => {
        const [key, dataType] = item.split(':');
        acc[key] = {
          model: toSequelizeType(dataType).replace(/Sequelize/gi, 'DataTypes'),
          migration: toSequelizeType(dataType).replace(
            /DataTypes|Sequelize/gi,
            'Sequelize'
          ),
          swagger: toSwaggerType(dataType),
        };
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
