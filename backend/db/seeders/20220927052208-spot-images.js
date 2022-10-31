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
     return await queryInterface.bulkInsert('SpotImages', [
       {
         spotId: 1,
         url: "url1",
         preview: true
       },
       {
        spotId: 1,
        url: "url2",
        preview: true
      },
      {
        spotId: 2,
        url: null,
        preview: false
      },
      {
        spotId: 2,
        url: null,
        preview: false
      },
      {
        spotId: 3,
        url: "url5",
        preview: true
      },
      {
        spotId: 3,
        url: "url6",
        preview: true
      },
      {
        spotId: 4,
        url: "url7",
        preview: true
      },
      {
        spotId: 4,
        url: "url8",
        preview: true
      },
      {
        spotId: 5,
        url: "url9",
        preview: true
      },
      {
        spotId: 5,
        url: "url10",
        preview: true
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
     await queryInterface.bulkDelete('SpotImages', null, {});
  }
};
