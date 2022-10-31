'use strict';

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
     await queryInterface.bulkInsert('ReviewImages', [
       {
        reviewId: 1,
        url: "11"
       },
       {
        reviewId: 2,
        url: "22"
       },
       {
        reviewId: 3,
        url: "33"
       },
       {
        reviewId: 4,
        url: "44"
       },
       {
        reviewId: 5,
        url: "55"
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
     await queryInterface.bulkDelete('ReviewImages', null, {});
  }
};
