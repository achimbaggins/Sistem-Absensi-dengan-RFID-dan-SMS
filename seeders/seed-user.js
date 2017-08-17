'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: '68ba831b00d873d5602da2d9308c520f3ca8549b7d5519c6021a848905e2',
      role: 'administrator',
      secret: 'wrr2ear8'
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
