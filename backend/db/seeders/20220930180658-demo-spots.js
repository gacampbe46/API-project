'use strict';

const { Spot } = require('../models')

const spots = [
  {
    ownerId: 1,
    address: "12345 Bradley Place",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 43.21,
    lng: 62.34,
    name: "Sunshine Plaza",
    description: "A beautiful nook with palm trees and sunshine",
    price: 25.62
  },
  {
    ownerId: 2,
    address: "98765 Elm St",
    city: "New Haven",
    state: "CT",
    country: "USA",
    lat: 123.2,
    lng: 4.56,
    name: "Vanderbilt Hall",
    description: "A cozy space to study and enjoy company",
    price: 60.4
  },
  {
    ownerId: 3,
    address: "90210 Platt Ave",
    city: "West Hills",
    state: "CA",
    country: "USA",
    lat: 12455.564,
    lng: 65434.2,
    name: "Tudor Center",
    description: "A large preformance space",
    price: 113.8
  }
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(spots, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spot', {
      where: { name: spots.map(spot => spot.name) }
    }, {});
  }
};
