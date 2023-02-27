const { literal, Op, QueryTypes } = require('sequelize');
const { Literal } = require('sequelize/lib/utils');
const sequelize = require('../config/db');

const createSubQuery = (Model, queryOptions = {}) => {
  if (queryOptions.include) {
    Model._validateIncludedElements.bind(Model)(queryOptions);
  }

  return sequelize.dialect.queryGenerator
    .selectQuery(Model.tableName, queryOptions, Model)
    .slice(0, -1);
};

const createSubQueryArrayLiteral = (Model, queryOptions) => {
  if (!queryOptions.limit) {
    return literal(`(${createSubQuery(Model, queryOptions)})`);
  }

  return literal(
    `( SELECT DISTINCT("InnerSubQuery".id) FROM (${createSubQuery(Model, {
      ...queryOptions,
      limit: undefined,
      offset: undefined,
    })}) as "InnerSubQuery" LIMIT ${queryOptions.limit} OFFSET ${
      queryOptions.offset
    })`
  );
};

const getOrderQuery = (order) =>
  order
    .map((data) => {
      const value = data instanceof Array ? data[0] : data;
      const type = data instanceof Array ? data[1] : 'ASC';

      if (value instanceof Literal) {
        return `${value.val} ${type}`;
      }

      return `${value} ${type}`;
    })
    .join(', ');

/**
 * example:
  findAndCountAllPaginated(
    User,
    {where: {...}, include: [...], order: [...]},
    0,
    20
  )
    .then(([totalCount, data]) =>
      res.json({
        totalCount,
        data,
      })
    )
    .catch(next);
 * @param Model {object}
 * @param queryOptions {object} sequelize query options
 * @param pageIndex {integer}
 * @param perPageCount {integer}
 * @returns {Promise<never>|Promise<unknown>}
 */
const findAndCountAllPaginated = (
  Model,
  queryOptions,
  pageIndex,
  perPageCount
) => {
  const subQueryOptions = {
    ...queryOptions,
    include: (queryOptions.include || []).map((include) => ({
      ...include,
      attributes: [],
    })),
  };

  return Promise.all([
    Model.count({
      ...subQueryOptions,
      distinct: true,
    }),

    sequelize
      .query(
        `SELECT DISTINCT("InnerSubQuery".id), "InnerSubQuery".rnum FROM (${createSubQuery(
          Model,
          {
            ...queryOptions,
            attributes: [
              'id',
              literal(
                `row_number() OVER (ORDER BY ${
                  queryOptions.order
                    ? getOrderQuery(queryOptions.order)
                    : 'id DESC'
                }) as rnum`
              ),
            ],
            distinct: true,
            limit: undefined,
            offset: undefined,
          }
        )}) as "InnerSubQuery" ORDER BY "InnerSubQuery".rnum LIMIT ${perPageCount} OFFSET ${
          perPageCount * pageIndex
        }`,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: queryOptions.replacements,
        }
      )
      .then((idsData) =>
        idsData && idsData.length
          ? Model.findAll({
              ...queryOptions,
              limit: undefined,
              offset: undefined,
              order: [
                literal(
                  `CASE ${idsData
                    .map(
                      ({ id }, index) =>
                        `WHEN "${Model.name}".id = '${id}' THEN ${index}`
                    )
                    .join(' ')} ELSE ${idsData.length} END`
                ),
              ],
              where: {
                id: {
                  [Op.in]: idsData.map(({ id }) => id),
                },
              },
            })
          : Promise.resolve([])
      ),
  ]);
};

/**
 * example:
 User.findOne({
      where: { id },
    })
 .then(rejectOnNotFound)
 * @param item
 * @param key - eg. 'user.not-found'
 * @returns {Promise<never>|Promise<unknown>}
 */
const rejectOnNotFound = (item, key) => {
  if (item) {
    return Promise.resolve(item);
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    status: 404,
    message: 'Not found',
    key,
  });
};

module.exports = {
  createSubQuery,
  createSubQueryArrayLiteral,
  findAndCountAllPaginated,
  rejectOnNotFound,
  rejectOnNotFoundWithKey: (key) => (item) => rejectOnNotFound(item, key),
};
