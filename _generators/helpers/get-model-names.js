/**
 * Module for retrieving model name in different cases.
 * @module getModelNames
 */

import _ from 'lodash-es';
/**
 * Function for retrieving model name in different cases.
 *
 * @param {string} modelName - The model name.
 * @returns {Object} - Object with model name in different cases.
 */
const getModelNames = (modelName) => ({
  camelCase: _.upperFirst(_.camelCase(modelName)),
  lowerCamelCase: _.camelCase(modelName),
  kebabCase: _.kebabCase(modelName),
});

export default getModelNames;
