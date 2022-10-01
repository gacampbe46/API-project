'use strict';

const { ReviewImages } = require('../models')

const pics = [
  {
    reviewId: 1,
    url: "https://unsplash.com/photos/28aXiCvyU1I",
  },
  {
    reviewId: 2,
    url: "https://unsplash.com/photos/wn-K-jX9LJ0",
  },
  {
    reviewId: 3,
    url: "https://unsplash.com/photos/28aXiCvyU1I",
  }
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImages.bulkCreate(pics, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', {
      where: { reviewId: pics.map(spot => pics.reviewId) }
    }, {});
  }
};
