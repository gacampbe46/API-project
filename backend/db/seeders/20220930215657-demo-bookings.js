'use strict';

const { Bookings } = require('../models')

const books = [
  {
    spotId: 1,
    userId: 1,
    startDate: 2022-7-30,
    endDate: 2022-8-3,
  },
  {
    spotId: 2,
    userId: 2,
    startDate: 2022-8-4,
    endDate: 2022-8-14,
  },
  {
    spotId: 3,
    userId: 3,
    startDate: 2022-9-12,
    endDate: 2022-9-14,
  }
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await Bookings.bulkCreate(books, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bookings', {
      where: { userId: books.map(book => book.userId) }
    }, {});
  }
};
