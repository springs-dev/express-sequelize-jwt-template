const pick = require('lodash/pick');
const { Op } = require('sequelize');
const isEqual = require('lodash/isEqual');

/**
 * Create or update the record if keyAttributes matches the existed record
 * example:
 createOrUpdate(
   Weather,
   dailyForecast,
   ['date', 'cityId']
 )
 * @param Model {object}
 * @param dataToCreate {array<object>}
 * @param keyAttributes {array<string>}
 * @param attributesToUpdate {array<string>}
 * @returns {Promise<number>}
 */
const createOrUpdate = (
  Model,
  dataToCreate,
  keyAttributes,
  attributesToUpdate = undefined
) => {
  if (!dataToCreate.length) {
    return Promise.resolve();
  }

  return Model.findAll({
    attributes: ['id', ...keyAttributes],
    where: { [Op.or]: dataToCreate.map((item) => pick(item, keyAttributes)) },
  }).then((existedModels) =>
    Model.bulkCreate(
      dataToCreate.map((item) => ({
        ...pick(
          existedModels.find((existedItem) =>
            isEqual(pick(existedItem, keyAttributes), pick(item, keyAttributes))
          ),
          'id'
        ),
        ...item,
      })),
      {
        updateOnDuplicate: attributesToUpdate || Object.keys(dataToCreate[0]),
      }
    )
  );
};

module.exports = createOrUpdate;
