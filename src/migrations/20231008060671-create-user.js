/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(50),
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
    });

    await queryInterface.addIndex('Users', [Sequelize.fn('lower', Sequelize.col('email'))], {
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Users', [Sequelize.fn('lower', Sequelize.col('email'))]);

    await queryInterface.dropTable('Users');
  },
};
