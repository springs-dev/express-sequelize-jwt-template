import { DataTypes } from 'sequelize';

import { BaseModel } from '#src/utils/base-model.js';

export default class Token extends BaseModel {
  /** @param {Object<string, import('sequelize').Model>} models */
  static associate(models) {
    // This line associates Token with User by a foreign key 'userId'.
    this.belongsTo(models.User, { foreignKey: 'userId' });
  }

  /** @param {import('sequelize').Sequelize }sequelize */
  static initialization(sequelize) {
    Token.init(
      {
        id: {
          type: DataTypes.UUIDV4,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },

        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        token: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      { sequelize, modelName: Token.name, timestamps: false },
    );
    return Token;
  }
}
