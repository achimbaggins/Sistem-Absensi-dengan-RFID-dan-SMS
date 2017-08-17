'use strict';
module.exports = function(sequelize, DataTypes) {
  const salt = require('../helpers/salt');
  const encryptme = require('../helpers/encryptme');
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    secret: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: models => {
        let salt =  salt().toString();
        let pass = encryptme(models.password, salt)
        models.password = pass;
        models.secret = salt
      },
      beforeUpdate: models => {
        let salt =  salt().toString();
        let pass = encryptme(models.password, salt)
        models.password = pass;
        models.secret = salt
      }
    }
  });
  return User;
};
