'use strict';

module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert('users', [{ firstName: 'Chris', lastName: 'Human' }]);
  },
  async down(queryInterface) {
    return await queryInterface.bulkDelete('users', {});
  },
};
