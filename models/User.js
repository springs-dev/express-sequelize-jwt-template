const crypto = require('crypto');

const encrypt = (data, encryptionHash) =>
  crypto.pbkdf2Sync(data, encryptionHash, 1, 128, 'sha1').toString('base64');

module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} User
   * @property {string} id
   * @property {string} email
   * @property {string} createdAt - ISO Date
   * @property {string} updatedAt - ISO Date
   */
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(50),
        validate: {
          isEmail: true,
        },
      },
      refreshToken: {
        type: DataTypes.STRING,
        unique: true,
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
      password: {
        type: DataTypes.VIRTUAL,
        set(password) {
          const encryptionHash = crypto.randomBytes(128).toString('base64');
          this.setDataValue('password', password);
          this.setDataValue('encryptionHash', encryptionHash);
          this.setDataValue(
            'encryptedPassword',
            encrypt(password, encryptionHash)
          );
        },
      },
    },
    {}
  );
  User.associate = function() {
    // associations can be defined here
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());

    delete values.password;
    delete values.encryptionHash;
    delete values.encryptedPassword;
    delete values.refreshToken;
    return values;
  };

  User.prototype.isEqualPassword = function(password) {
    return encrypt(password, this.encryptionHash) === this.encryptedPassword;
  };

  return User;
};
