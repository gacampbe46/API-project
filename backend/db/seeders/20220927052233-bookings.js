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
     await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 1,
        startDate: "2022-11-11",
        endDate: "2022-11-15"
      },
      {
        spotId: 2,
        userId: 1,
        startDate: "2022-6-1",
        endDate: "2022-6-5"
     },
     {
        spotId: 3,
        userId: 5,
        startDate: "2022-7-1",
        endDate: "2022-7-5"
      },
      {
        spotId: 4,
        userId: 5,
        startDate: "2022-5-12",
        endDate: "2022-5-14"
      },
      {
        spotId: 5,
        userId: 5,
        startDate: "2022-8-12",
        endDate: "2022-8-14"
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
     await queryInterface.bulkDelete('Bookings', null, {});
  }
};
