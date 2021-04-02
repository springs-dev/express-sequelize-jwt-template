module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Users', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v1()'),
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING(50),
        },
        refreshToken: {
          type: Sequelize.STRING,
        },
        encryptionHash: {
          type: Sequelize.STRING,
        },
        encryptedPassword: {
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() =>
        queryInterface.addIndex(
          'Users',
          [Sequelize.fn('lower', Sequelize.col('email'))],
          {
            unique: true,
          }
        )
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeIndex('Users', [Sequelize.fn('lower', Sequelize.col('email'))], {
        unique: true,
      })
      .then(() => queryInterface.dropTable('Users'));
  },
};
