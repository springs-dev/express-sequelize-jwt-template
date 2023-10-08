import { randomBytes, pbkdf2Sync } from 'node:crypto';

import CreateError from 'http-errors';
import { DataTypes } from 'sequelize';

import { BaseModel } from '#src/utils/base-model.js';

const HASH_ITERATIONS = 10000;
const HASH_BYTE_SIZE = 128;
const PASSWORD_LENGTH = 7;

/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} email
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @property {User} dataValues
 */
export default class User extends BaseModel {
  // Instance Methods

  /**
   * Convert the model instance to a JSON representation,
   * excluding sensitive fields.
   * @returns {object}
   */
  toJSON() {
    const values = { ...this.dataValues };
    delete values.password;
    delete values.encryptionHash;
    delete values.encryptedPassword;
    delete values.refreshToken;
    return values;
  }

  /**
   * Checks if the given password matches the encrypted password of the user.
   * @param {string} password - The password to check.
   * @returns {boolean} - True if the passwords match, false otherwise.
   */
  isEqualPassword(password) {
    return User.#encrypt(password, this.encryptionHash) === this.encryptedPassword;
  }

  // Static Methods

  /**
   * Encrypts the given data using PBKDF2.
   * @param {string} data - The data to encrypt.
   * @param {string} encryptionHash - The encryption hash to use.
   * @returns {string} - The encrypted data.
   */
  static #encrypt(data, encryptionHash) {
    return pbkdf2Sync(data, encryptionHash, HASH_ITERATIONS, HASH_BYTE_SIZE, 'sha1').toString(
      'base64',
    );
  }

  /**
   * Associates this model with another by defining a relationship.
   * @param {Object<string, import('sequelize').Model>} models - The collection of models in your application with which this model might be associated.
   */
  // eslint-disable-next-line no-unused-vars
  static associate(models) {
    // associations can be defined here
  }

  /**
   * Initializes the model with its configuration, to be called in your model definitions.
   * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance to which this model is to be attached.
   */
  static initialization(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.UUIDV4,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },

        email: {
          type: DataTypes.STRING(64),
          validate: {
            isEmail: true,
            notEmpty: true,
            isLowercase: true,
          },
        },

        encryptionHash: {
          type: DataTypes.STRING,
        },

        encryptedPassword: {
          type: DataTypes.STRING,
        },

        password: {
          validate: {
            isLongEnough(value) {
              if (value.length < PASSWORD_LENGTH) {
                throw new CreateError.BadRequest(
                  `Password should be at least ${PASSWORD_LENGTH} characters long.`,
                );
              }
            },
          },
          type: DataTypes.VIRTUAL,

          set(password) {
            const encryptionHash = randomBytes(HASH_BYTE_SIZE).toString('base64');
            this.setDataValue('password', password);
            this.setDataValue('encryptionHash', encryptionHash);
            this.setDataValue('encryptedPassword', User.#encrypt(password, encryptionHash));
          },
        },
      },
      {
        sequelize,
        modelName: User.name,
        timestamps: true,
      },
    );
    return User;
  }
}
