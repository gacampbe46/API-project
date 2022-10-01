'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookings.belongsTo(models.User, { foreignKey: 'userId' })
      Bookings.belongsTo(models.Spot, { foreignKey: 'spotId' })
    }
  }
  Bookings.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY
    },
    endDate: {
      type: DataTypes.DATEONLY
    },
  }, {
    sequelize,
    modelName: 'Bookings',
  });
  return Bookings;
};
