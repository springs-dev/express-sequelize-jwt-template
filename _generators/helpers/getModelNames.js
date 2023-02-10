/* eslint-disable no-useless-escape */
const _ = require('lodash');

const getModelNames = (modelName) => ({
  camelCase: _.upperFirst(_.camelCase(modelName)),
  lowerCamelCase: _.camelCase(modelName),
  kebabCase: _.kebabCase(modelName),
});

module.exports = getModelNames;
