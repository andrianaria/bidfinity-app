'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Items', [
      {
        id: 1,
        name: 'Item 1',
        start_price: 100,
        time_window: 300, // in seconds
        is_published: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: new Date(),
      },
      {
        id: 2,
        name: 'Item 2',
        start_price: 200,
        time_window: 600, // in seconds
        is_published: false,
        created_by: 2,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: null,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
