'use strict';

const { User, Spot, Review } = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return await queryInterface.bulkInsert('Reviews',
    [
       {
        spotId: 1,
        userId: 1,
        review: "Great location, pleasant and spacious with amazing views. Hard to find this combo in Laguna.",
        stars: 5
       },
       {
        spotId: 1,
        userId: 5,
        review: "Absolutely perfect location and home. Wish we could have stayed longer!",
        stars: 5
       },
       {
        spotId: 2,
        userId: 1,
        review: "Cannot beat the location! Fantastic h it, very clean, very comfortable. We cannnot wait to plan a second stay!",
        stars: 5
       },
       {
        spotId: 2,
        userId: 5,
        review: "What a great way to vacation in Newport Beach! Location was amazing for beach, restaurants, and activities. Would highly recommend.",
        stars: 5
       },
       {
        spotId: 3,
        userId: 1,
        review: "Great view and location. AC and mini fridge were very nice to have. I had no issues with the water/shower pressure in the bathroom. Really enjoyed it!",
        stars: 5
       },
       {
        spotId: 3,
        userId: 5,
        review: "Clean room, comfortable beds. Everything else as described. Small shower with drainage issues, building in need of repair, and bright outdoor lights that cannot be dimmed.",
        stars: 4
       },
       {
        spotId: 4,
        userId: 1,
        review: "If you are looking for a mediocre, subpar, and non memorable experience then you need to find somewhere else! THIS CABIN IS AWESOME IN EVERY WAY!",
        stars: 5
       },
       {
        spotId: 4,
        userId: 5,
        review: "This amazing cabin is the hosts' personal getaway and they have chosen to make it available to lucky Airbnb guests as well.",
        stars: 5
       },
       {
        spotId: 5,
        userId: 1,
        review: "Beautifully located hillside, the house was designed to optimize views of the ocean. In the morning from the living room we enjoyed watching pods of dolphins swim by.",
        stars: 5
       },
       {
        spotId: 5,
        userId: 5,
        review: "It was hard to believe that a place so special in the photos could live up to our expectations in reality. There was so much room to either spread out or congregate.",
        stars: 5
       }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Reviews', null, {});
  }
};
