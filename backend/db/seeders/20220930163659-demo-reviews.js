'use strict';

const { Reviews } = require('../models')

const review = [
  {
    spotId: 1,
    userId: 1,
    review: "A great weekend getaway!",
    stars: 5
  },
  {
    spotId: 1,
    userId: 2,
    review: "Wished I didn't book",
    stars: 3
  },
  {
    spotId: 2,
    userId: 2,
    review: "Loved the view!",
    stars: 4
  },
  {
    spotId: 3,
    userId: 3,
    review: "Small space, no parking",
    stars: 3
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await Reviews.bulkCreate(review, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', {
      where: { userId: review.map(myReview => myReview.userId) }
    }, {});
  }
};
