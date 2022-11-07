module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface
      .createTable('Users', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.literal('uuid_generate_v1()'),
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(50),
        },
        refreshToken: {
          type: DataTypes.STRING,
        },
        encryptionHash: {
          type: DataTypes.STRING,
        },
        encryptedPassword: {
          type: DataTypes.STRING,
        },
        resetPasswordToken: {
          type: DataTypes.STRING,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      })
      .then(() =>
        queryInterface.addIndex(
          'Users',
          [DataTypes.fn('lower', DataTypes.col('email'))],
          {
            unique: true,
          }
        )
      );
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface
      .removeIndex('Users', [DataTypes.fn('lower', DataTypes.col('email'))], {
        unique: true,
      })
      .then(() => queryInterface.dropTable('Users'));
  },
};
