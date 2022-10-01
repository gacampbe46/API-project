'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsToMany(models.User, {
        through: 'Bookings',
        foreignKey: 'spotId',
        otherKey: 'userId'
      });
      Spot.belongsToMany(models.User, {
        through: 'Reviews',
        as: 'Owner',
        foreignKey: 'spotId',
        otherKey: 'userId'
      });
      Spot.hasMany(models.Reviews, { foreignKey: 'spotId' });
      Spot.belongsTo(models.User, { foreignKey: "ownerId" });
      Spot.hasMany(models.SpotImages, { foreignKey: "spotId" });
    }
  }
  Spot.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
    },
    lng: {
      type: DataTypes.DECIMAL,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [5, 1000]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 1000]
      }
    },
    price: {
      type: DataTypes.DECIMAL,
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
