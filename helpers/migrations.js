const Sequelize = require('sequelize');

/**
 * Update Enum allowed values in migration
 * example:
 updateEnum(
   'Users',
   'role',
   ['ADMIN', 'MANAGER', 'CUSTOMER'],
   queryInterface,
   transaction
 )
 * @param tableName
 * @param attributeName
 * @param values
 * @param queryInterface
 * @param transaction
 * @returns {Promise<void>}
 */
const updateEnum = (
  tableName,
  attributeName,
  values,
  queryInterface,
  transaction = undefined
) =>
  queryInterface
    .changeColumn(
      tableName,
      attributeName,
      {
        type: Sequelize.STRING,
      },
      { transaction }
    )
    .then(() =>
      queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_${tableName}_${attributeName}";`,
        {
          transaction,
        }
      )
    )
    .then(() =>
      queryInterface.changeColumn(
        tableName,
        attributeName,
        {
          type: Sequelize.ENUM(values),
        },
        { transaction }
      )
    );
module.exports = {
  updateEnum,
};
