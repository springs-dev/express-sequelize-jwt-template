/* eslint-disable no-useless-escape */
const toSwaggerType = require('./toSwaggerType');
const toSequelizeType = require('./toSequelizeType');

const getModelAttributeNames = (modelAttributes) => {
  const modelAttributesArray =
    modelAttributes.length === 1 && modelAttributes[0].indexOf(' ') >= 0
      ? modelAttributes[0].split(/[, ]/)
      : modelAttributes;

  return modelAttributesArray.reduce((acc, item) => {
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
};

module.exports = getModelAttributeNames;
