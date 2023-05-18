'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Deposits', [
      {
        user_id: 1,
        amount: 500,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        amount: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        amount: 300,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Deposits', null, {});
  }
};
