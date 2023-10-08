/**
 * Module for retrieving names and types of model attributes.
 * @module getModelAttributeNames
 */

import toSequelizeType from './to-sequelize-type.js';
import toSwaggerType from './to-swagger-type.js';

/**
 * Function for retrieving names and types of model attributes.
 *
 * @param {string[]} modelAttributes - Array of model attributes in the format "name:type".
 * @returns {Object.<string, { model: string, migration: string, swagger: string }>} - Object with names and types.
 */
const getModelAttributeNames = (modelAttributes) => {
  const modelAttributesArray =
    modelAttributes.length === 1 && modelAttributes[0].indexOf(' ') >= 0
      ? modelAttributes[0].split(/[, ]/)
      : modelAttributes;

  return modelAttributesArray.reduce((acc, item) => {
    const [key, dataType] = item.split(':');

    acc[key] = {
      model: toSequelizeType(dataType).replace(/Sequelize/gi, 'DataTypes'),
      migration: toSequelizeType(dataType).replace(/DataTypes|Sequelize/gi, 'Sequelize'),
      swagger: toSwaggerType(dataType),
    };
    return acc;
  }, {});
};

export default getModelAttributeNames;
