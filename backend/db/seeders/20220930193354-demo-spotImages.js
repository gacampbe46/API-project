'use strict';

const { SpotImages } = require('../models')

const pics = [
  {
    spotId: 1,
    url: "https://unsplash.com/photos/Yd8lKOYNnjQ",
    preview: true
  },
  {
    spotId: 2,
    url: "https://unsplash.com/photos/s2M_-HGaQuA",
    preview: true
  },
  {
    spotId: 3,
    url: "https://unsplash.com/photos/p6rNTdAPbuk",
    preview: true
  }
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImages.bulkCreate(pics, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', {
      where: { spotId: pics.map(spot => spot.spotId) }
    }, {});
  }
};
