import CreateError from 'http-errors';
import { Model } from 'sequelize';

/**
 * This class extends the basic Sequelize Model to provide additional methods.
 * @extends {Model}
 */
export class BaseModel extends Model {
  /**
   * Searches for a single instance based on the query provided.
   * If no instance is found, it throws a NotFound error.
   *
   * @template {Model} T This is the model type.
   * @param {import('sequelize').FindOptions<T['attributes']>} [query={}] - The Sequelize query object to pass to findOne method.
   * @throws {CreateError.NotFound} If no instance is found.
   * @returns {Promise<Record<string, *>>} A promise that resolves with the found instance.
   */
  static async findOneOrFail(query = {}) {
    const instance = await this.findOne(query);

    if (!instance) {
      throw new CreateError(`${this.name} not found.`, {
        key: `${this.name.toLowerCase()}-not-found`,
      });
    }

    return instance;
  }

  /**
   * Searches for a single instance by its primary key.
   * If no instance is found, it throws a NotFound error.
   *
   * @template {Model} T This is the model type.
   * @param {number|string} id - The primary key of the instance to find.
   * @param {import('sequelize').FindOptions<T['attributes']>} [query={}] - Additional Sequelize query options to pass to findByPk method.
   * @throws {CreateError.NotFound} If no instance with the given id is found.
   * @returns {Promise<Record<string, *>>} A promise that resolves with the found instance.
   */
  static async findByPkOrFail(id, query = {}) {
    const instance = await this.findByPk(id, query);

    if (!instance) {
      throw new CreateError(`${this.name} with id: ${id} not found.`, {
        key: `${this.name.toLowerCase()}.not-found`,
      });
    }

    return instance;
  }

  /**
   * Updates a single instance based on the query and data provided.
   * If no instance is found or updated, it throws a NotFound error.
   *
   * @template {Model} T This is the model type.
   * @param {Partial<T['attributes']>} data - The data to update the instance with.
   * @param {import('sequelize').UpdateOptions<T['attributes']>} options - The Sequelize update options.
   * @throws {CreateError.NotFound} If no instance is found or updated.
   * @returns {Promise<[number, Record<string, *>[]]>} A promise that resolves with the updated instance.
   */
  static async updateOrFail(data, options) {
    const [count, updatedInstances] = await this.update(data, {
      ...options,
    });

    if (count === 0) {
      throw new CreateError.NotFound(`Update failed. No of ${this.name} matched the criteria.`, {
        key: `${this.name.toLowerCase()}-not-found`,
      });
    }

    return [count, updatedInstances];
  }

  /**
   * Deletes a single instance based on the query provided.
   * If no instance is found or deleted, it throws a NotFound error.
   *
   * @template {Model} T This is the model type.
   * @param {import('sequelize').DestroyOptions<T['attributes']>} options - The Sequelize destroy options.
   * @throws {CreateError.NotFound} If no instance is found or deleted.
   * @returns {Promise<number>}
   */
  static async destroyOrFail(options) {
    const numberDestroyed = await this.destroy(options);

    if (numberDestroyed === 0) {
      throw new CreateError(404, `Deletion failed. No of ${this.name} found to delete.`, {
        key: `${this.name.toLowerCase()}-not-found`,
      });
    }

    return numberDestroyed;
  }
}
