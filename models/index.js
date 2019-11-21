const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db');

const models = {};

fs.readdirSync(__dirname)
  .filter((fileName) => /\.js$/.test(fileName) && fileName !== 'index.js')
  .forEach((fileName) => {
    const model = sequelize.import(path.join(__dirname, fileName));
    models[model.name] = model;
  });

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
