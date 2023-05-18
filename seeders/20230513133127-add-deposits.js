'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Bids', [
      {
        item_id: 1,
        user_id: 2,
        bid_price: 150,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: 2,
        user_id: 1,
        bid_price: 250,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: 2,
        user_id: 2,
        bid_price: 300,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bids', null, {});
  }
};
