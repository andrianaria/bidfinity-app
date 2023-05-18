'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('password', 10),
        balance: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('password1', 10),
        balance: 500,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
